import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to generate image" },
        { status: response.status }
      )
    }

    // Check if response is base64 or URL
    if (data.data[0].b64_json) {
      // Handle base64 response
      const base64Data = data.data[0].b64_json;
      const imageDataUrl = `data:image/png;base64,${base64Data}`;
      
      return NextResponse.json({
        imageUrl: imageDataUrl,
      })
    } else if (data.data[0].url) {
      // Handle URL response
      return NextResponse.json({
        imageUrl: data.data[0].url,
      })
    } else {
      throw new Error("Invalid response format from OpenAI")
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}