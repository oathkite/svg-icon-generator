/**
 * Direct PNG to SVG conversion without API calls
 * This can be used as an alternative to avoid internal API routing issues
 */

import sharp from "sharp";

interface PotraceModule {
	trace: (
		buffer: Buffer,
		options: {
			threshold?: number;
			color?: string;
			background?: string;
			turdSize?: number;
			optTolerance?: number;
			turnPolicy?: string;
			alphamax?: number;
		},
		callback: (err: Error | null, svg: string) => void,
	) => void;
}

let potrace: PotraceModule | undefined;
try {
	potrace = require("potrace") as PotraceModule;
} catch (error) {
	console.error("Failed to load potrace:", error);
}

export interface DirectConversionOptions {
	threshold?: number;
	turdSize?: number;
	optTolerance?: number;
}

export async function convertPngToSvgDirect(
	imageUrl: string,
	options: DirectConversionOptions = {},
): Promise<{ svg: string; success: boolean; error?: string }> {
	try {
		if (!potrace) {
			return {
				svg: "",
				success: false,
				error: "Image tracing library not available",
			};
		}

		// Handle both URL and base64 data
		let inputBuffer: Buffer;

		if (imageUrl.startsWith("data:image")) {
			// Handle base64 data URL
			const base64Data = imageUrl.split(",")[1];
			inputBuffer = Buffer.from(base64Data, "base64");
		} else {
			// Handle regular URL
			const response = await fetch(imageUrl);
			const arrayBuffer = await response.arrayBuffer();
			inputBuffer = Buffer.from(arrayBuffer);
		}

		// Process the image with sharp
		const buffer = await sharp(inputBuffer)
			.greyscale()
			.normalise()
			.png()
			.toBuffer();

		// Trace the image
		const svg = await new Promise<string>((resolve, reject) => {
			potrace.trace(
				buffer,
				{
					threshold: options.threshold || 128,
					color: "currentColor",
					background: "transparent",
					turdSize: options.turdSize || 2,
					optTolerance: options.optTolerance || 0.2,
					turnPolicy: "minority",
					alphamax: 1,
				},
				(err: Error | null, svg: string) => {
					if (err) {
						reject(err);
					} else {
						// Extract original viewBox or dimensions from the SVG
						const viewBoxMatch = svg.match(/viewBox="([^"]*)"/);
						const widthMatch = svg.match(/width="([^"]*)"/);
						const heightMatch = svg.match(/height="([^"]*)"/);

						let viewBox = "0 0 24 24";
						if (viewBoxMatch) {
							viewBox = viewBoxMatch[1];
						} else if (widthMatch && heightMatch) {
							const width = Number.parseFloat(widthMatch[1]);
							const height = Number.parseFloat(heightMatch[1]);
							viewBox = `0 0 ${width} ${height}`;
						}

						// Clean up the SVG
						const cleanedSvg = svg
							.replace(
								/<svg[^>]*>/,
								`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${viewBox}" fill="currentColor">`,
							)
							.replace(/fill="#[^"]*"/g, 'fill="currentColor"')
							.replace(/stroke="#[^"]*"/g, 'stroke="currentColor"');

						resolve(cleanedSvg);
					}
				},
			);
		});

		return {
			svg,
			success: true,
		};
	} catch (error) {
		console.error("Direct SVG conversion error:", error);
		return {
			svg: "",
			success: false,
			error: error instanceof Error ? error.message : "SVG conversion error occurred",
		};
	}
}