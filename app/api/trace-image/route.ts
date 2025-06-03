import { type NextRequest, NextResponse } from "next/server";
import potrace from "potrace";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Handle both URL and base64 data
    let inputBuffer: Buffer;
    
    if (imageUrl.startsWith('data:image')) {
      // Handle base64 data URL
      const base64Data = imageUrl.split(',')[1];
      inputBuffer = Buffer.from(base64Data, 'base64');
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
      potrace.trace(buffer, {
        threshold: 128,
        color: "currentColor",
        background: "transparent",
        turdSize: 10,
        optTolerance: 0.2,
      }, (err, svg) => {
        if (err) {
          reject(err);
        } else {
          // Clean up the SVG
          const cleanedSvg = svg
            .replace(/width="[^"]*"/, 'width="24"')
            .replace(/height="[^"]*"/, 'height="24"')
            .replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">')
            .replace(/fill="#[^"]*"/g, 'fill="currentColor"');
          
          resolve(cleanedSvg);
        }
      });
    });

    return NextResponse.json({ svg });
  } catch (error) {
    console.error("Image tracing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to trace image" },
      { status: 500 }
    );
  }
}