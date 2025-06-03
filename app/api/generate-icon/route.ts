import { type NextRequest, NextResponse } from "next/server";
import type { GenerationResult } from "@/types";
import { convertPngToSvgServer } from "@/lib/server-png-to-svg";

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
		const enhancedPrompt = `あなたはピクトグラムアイコンのエキスパートです。以下の条件でシンプルな「${prompt}」のピクトグラムアイコンを作成してください。
		- シンプルな幾何学的形状を組み合わせる
		- 認識しやすいミニマルデザイン
		- スタイル : ${styleReference}`;

		const response = await fetch("https://api.openai.com/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-image-1",
				prompt: enhancedPrompt,
				quality: "low",
				size: "1024x1024",
			}),
		});

		const data = await response.json();

		if (!response.ok || !data.data?.[0]) {
			return NextResponse.json(
				{ error: data.error?.message || "Failed to generate image" },
				{ status: response.status }
			);
		}

		// Handle both base64 and URL responses
		let imageDataUrl: string;
		if (data.data[0].b64_json) {
			// Base64 format
			const base64Data = data.data[0].b64_json;
			imageDataUrl = `data:image/png;base64,${base64Data}`;
			console.log("Generated image in base64 format");
		} else if (data.data[0].url) {
			// URL format
			imageDataUrl = data.data[0].url;
			console.log("Generated image URL:", imageDataUrl);
		} else {
			throw new Error("Invalid response format from OpenAI");
		}
		
		// Convert PNG to SVG using the shared utility
		const baseUrl = request.headers.get("origin") || `http://localhost:${process.env.PORT || 3000}`;
		const conversionResult = await convertPngToSvgServer(imageDataUrl, baseUrl);
		
		// Use the converted SVG or fallback to default
		const svg = conversionResult.success 
			? conversionResult.svg 
			: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
			</svg>`;
		
		if (conversionResult.success) {
			console.log("SVG conversion successful");
		} else {
			console.error("SVG conversion failed:", conversionResult.error);
		}

		const result: GenerationResult = {
			svg: svg,
			confidence: 0.85,
			source: "ai",
			metadata: {
				name: prompt,
				collection: "openai",
				imageUrl: imageDataUrl,
			},
		};

		return NextResponse.json(result);
	} catch (error) {
		console.error("Icon generation error:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}