import { type NextRequest, NextResponse } from "next/server";
import type { GenerationResult } from "@/types";

export async function POST(request: NextRequest) {
	try {
		const { prompt, iconStyle } = await request.json();

		if (!prompt?.trim()) {
			return NextResponse.json(
				{ error: "プロンプトが空です" },
				{ status: 400 }
			);
		}

		const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "OpenAI API key not configured" },
				{ status: 500 }
			);
		}

		// アイコンセットスタイルに応じたプロンプトの調整
		let styleGuide = "";
		let styleReference = "";
		
		// プリセットスタイルの定義
		const stylePresets: Record<string, { reference: string; guide: string }> = {
			fontawesome: {
				reference: "Font Awesome",
				guide: "Bold, solid shapes with rounded corners. Thick outlines when using strokes. Friendly and approachable design."
			},
			material: {
				reference: "Material Design Icons",
				guide: "Following Material Design principles. 24x24 grid-based design. Geometric and consistent stroke weights. Clean and modern."
			},
			feather: {
				reference: "Feather Icons",
				guide: "Thin, consistent 2px strokes only. No fills. Light and elegant. Minimalist line art style."
			},
			tabler: {
				reference: "Tabler Icons",
				guide: "Medium weight strokes. Rounded line caps and joins. Balanced and versatile design."
			},
			heroicons: {
				reference: "Heroicons",
				guide: "Clean and simple. Available in both outline (2px stroke) and solid styles. Optimized for small sizes."
			},
			phosphor: {
				reference: "Phosphor Icons",
				guide: "Flexible and consistent. Multiple weights available. Rounded corners and friendly appearance."
			},
			lucide: {
				reference: "Lucide Icons",
				guide: "Fork of Feather Icons. Consistent 2px strokes. Community-driven and highly optimized."
			},
			ionicons: {
				reference: "Ionicons",
				guide: "Premium design for iOS and Android. Available in outline, filled, and sharp styles."
			},
			bootstrap: {
				reference: "Bootstrap Icons",
				guide: "Official Bootstrap icon library. Consistent stroke weights. Works well at small sizes."
			},
		};

		// スタイルの解決
		if (iconStyle && iconStyle !== "auto") {
			const normalizedStyle = iconStyle.toLowerCase();
			const preset = stylePresets[normalizedStyle];
			
			if (preset) {
				styleReference = preset.reference;
				styleGuide = preset.guide;
			} else {
				// カスタムスタイルの場合
				styleReference = iconStyle;
				styleGuide = `Designed in the style of ${iconStyle} icons. Professional and consistent design.`;
			}
		} else {
			// autoまたは未指定の場合
			styleReference = "modern icon libraries";
			styleGuide = "Clean, professional, and versatile design suitable for UI/UX.";
		}

		// ピクトグラム生成用の詳細なプロンプト
		const enhancedPrompt = `Create a minimal, geometric pictogram icon for: "${prompt}". 
The icon should be designed in the style of ${styleReference} icons:
- ${styleGuide}
- Simple geometric shapes (circles, squares, triangles, lines)
- Monochromatic black on white background
- No gradients, shadows, or 3D effects
- Clear and recognizable at small sizes (16x16 to 24x24)
- Professional icon design
- Consistent with ${styleReference} visual language`;

		const response = await fetch("https://api.openai.com/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-image-1",
				prompt: enhancedPrompt,
				background: "transparent",
				size: "1024x1024",
				quality: "low",
			}),
		});

		const data = await response.json();

		if (!response.ok || !data.data?.[0]?.url) {
			return NextResponse.json(
				{ error: data.error?.message || "Failed to generate image" },
				{ status: response.status }
			);
		}

		// PNG画像をSVGに変換
		const imageUrl = data.data[0].url;
		
		// Call trace API to convert PNG to SVG
		const traceResponse = await fetch(new URL("/api/trace-image", request.url).toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ imageUrl }),
		});

		if (!traceResponse.ok) {
			throw new Error("Failed to trace image");
		}

		const { svg } = await traceResponse.json();

		const result: GenerationResult = {
			svg: svg,
			confidence: 0.85,
			source: "ai",
			metadata: {
				name: prompt,
				collection: "openai",
				imageUrl: imageUrl,
			},
		};

		return NextResponse.json(result);
	} catch (error) {
		console.error("Icon generation error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}