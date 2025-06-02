import { iconGenerator } from "@/lib/icon-generator";
import { type NextRequest, NextResponse } from "next/server";
import { optimize } from "svgo";

async function optimizeSVG(svg: string): Promise<string> {
	try {
		const result = optimize(svg, {
			plugins: [
				"preset-default",
				{
					name: "removeAttrs",
					params: {
						attrs: "(fill)",
					},
				},
			],
		});
		return result.data;
	} catch (error) {
		console.error("SVG optimization error:", error);
		return svg;
	}
}

export async function POST(req: NextRequest) {
	try {
		const { prompt } = await req.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: "プロンプトが必要です" },
				{ status: 400 },
			);
		}

		// 改善されたアイコン生成サービスを使用
		const result = await iconGenerator.generateIcon(prompt);

		// SVGの最適化
		const optimizedSvg = await optimizeSVG(result.svg);
		const pathMatch = optimizedSvg.match(/<path[^>]*d="([^"]+)"/);
		const path = pathMatch ? pathMatch[1] : "";

		return NextResponse.json({
			svg: optimizedSvg,
			path: path,
			source: result.source,
			confidence: result.confidence,
			alternatives: result.alternatives,
			metadata: result.metadata,
			fromPattern: result.source === "pattern",
			fromIconify: result.source === "iconify",
		});
	} catch (error) {
		console.error("Generation error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "アイコンの生成中にエラーが発生しました",
			},
			{ status: 500 },
		);
	}
}
