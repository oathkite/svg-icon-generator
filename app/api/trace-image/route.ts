import { NextRequest, NextResponse } from "next/server";
import potrace from "potrace";
import Jimp from "jimp";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Download and process the image
    const image = await Jimp.read(imageUrl);
    
    // Convert to grayscale for better tracing
    image.grayscale();
    
    // Increase contrast for better edge detection
    image.contrast(0.5);
    
    // Get buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
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
      { error: "Failed to trace image" },
      { status: 500 }
    );
  }
}