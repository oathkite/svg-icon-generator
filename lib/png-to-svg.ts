/**
 * PNG to SVG conversion utility
 * Converts PNG images to SVG with transparent background
 */

export interface ConversionOptions {
	threshold?: number;
	turdSize?: number;
	optTolerance?: number;
}

export interface ConversionResult {
	svg: string;
	success: boolean;
	error?: string;
}

/**
 * Convert PNG file or data URL to SVG
 */
export async function convertPngToSvg(
	imageData: string | File,
	options: ConversionOptions = {},
): Promise<ConversionResult> {
	try {
		let imageUrl: string;

		if (typeof imageData === "string") {
			imageUrl = imageData;
		} else {
			// Convert File to data URL
			imageUrl = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => resolve(e.target?.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(imageData);
			});
		}

		const response = await fetch("/api/trace-image", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				imageUrl,
				options: {
					threshold: options.threshold || 128,
					turdSize: options.turdSize || 2,
					optTolerance: options.optTolerance || 0.2,
				},
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				svg: "",
				success: false,
				error: data.error || "変換に失敗しました",
			};
		}

		return {
			svg: data.svg,
			success: true,
		};
	} catch (error) {
		return {
			svg: "",
			success: false,
			error: error instanceof Error ? error.message : "エラーが発生しました",
		};
	}
}

/**
 * Validate if the image is suitable for conversion
 */
export function validateImageForConversion(file: File): { valid: boolean; error?: string } {
	if (!file.type.startsWith("image/")) {
		return { valid: false, error: "画像ファイルを選択してください" };
	}

	if (file.size > 10 * 1024 * 1024) {
		// 10MB limit
		return { valid: false, error: "ファイルサイズが大きすぎます（10MB以下にしてください）" };
	}

	return { valid: true };
}
