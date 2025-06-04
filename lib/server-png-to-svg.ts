/**
 * Server-side PNG to SVG conversion utility
 * Used by API routes to convert PNG images to SVG
 */

import type { ConversionOptions, ConversionResult } from "./png-to-svg";

/**
 * Convert PNG to SVG on the server side
 * This function calls the trace-image API endpoint internally
 */
export async function convertPngToSvgServer(
	imageUrl: string,
	baseUrl: string,
	options: ConversionOptions = {},
): Promise<ConversionResult> {
	try {
		const response = await fetch(`${baseUrl}/api/trace-image`, {
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

		// Check if response is JSON
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			console.error("Received non-JSON response from trace-image API:", contentType);
			const text = await response.text();
			console.error("Response body:", text.substring(0, 200));
			return {
				svg: "",
				success: false,
				error: "API endpoint returned HTML instead of JSON. Check server configuration.",
			};
		}

		const data = await response.json();

		if (!response.ok) {
			return {
				svg: "",
				success: false,
				error: data.error || "SVG conversion failed",
			};
		}

		return {
			svg: data.svg,
			success: true,
		};
	} catch (error) {
		console.error("SVG conversion error:", error);
		return {
			svg: "",
			success: false,
			error: error instanceof Error ? error.message : "SVG conversion error occurred",
		};
	}
}
