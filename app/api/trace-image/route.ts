import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Load potrace using dynamic require to avoid bundling issues
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

export async function POST(request: NextRequest) {
	try {
		if (!potrace) {
			return NextResponse.json({ error: "Image tracing library not available" }, { status: 500 });
		}

		const { imageUrl, options = {} } = await request.json();

		if (!imageUrl) {
			return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
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
			.greyscale() // Convert to grayscale
			.normalise() // Enhance contrast
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
							// Use existing viewBox if available
							viewBox = viewBoxMatch[1];
						} else if (widthMatch && heightMatch) {
							// Create viewBox from width and height
							const width = Number.parseFloat(widthMatch[1]);
							const height = Number.parseFloat(heightMatch[1]);
							viewBox = `0 0 ${width} ${height}`;
						}

						// Clean up the SVG while preserving the correct viewBox
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

		return NextResponse.json({ svg });
	} catch (error) {
		console.error("Image tracing error:", error);
		const errorMessage =
			error && typeof error === "object" && "message" in error
				? String(error.message)
				: "Failed to trace image";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
