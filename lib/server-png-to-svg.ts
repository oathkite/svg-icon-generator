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
	// Try the simple endpoint first (no sharp dependency)
	const endpoints = ["/api/trace-image-simple", "/api/trace-image"];
	
	for (const endpoint of endpoints) {
		try {
			const response = await fetch(`${baseUrl}${endpoint}`, {
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
				console.error(`Non-JSON response from ${endpoint}:`, contentType);
				continue; // Try next endpoint
			}

			const data = await response.json();

			if (!response.ok) {
				console.error(`${endpoint} failed:`, data.error);
				continue; // Try next endpoint
			}

			return {
				svg: data.svg,
				success: true,
			};
		} catch (error) {
			console.error(`Error with ${endpoint}:`, error);
			continue; // Try next endpoint
		}
	}
	
	// All endpoints failed
	return {
		svg: "",
		success: false,
		error: "All SVG conversion endpoints failed. Check server configuration.",
	};
}
