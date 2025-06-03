import type { GenerationResult } from "@/types";
import { findMatchingPattern, iconPatterns } from "./icon-patterns";
import { formatSVG, isValidSVG } from "./svg-utils";

class IconGenerationService {
	async generateIcon(prompt: string, _iconStyle?: string): Promise<GenerationResult> {
		if (!prompt.trim()) {
			throw new Error("プロンプトが空です");
		}

		// パターンマッチングでアイコンを検索
		const matchedPattern = findMatchingPattern(prompt);

		if (matchedPattern) {
			try {
				// Validate SVG before processing
				if (!isValidSVG(matchedPattern.svg)) {
					throw new Error("パターンのSVGが無効です");
				}

				// メインの結果
				const formattedSvg = formatSVG(matchedPattern.svg);

				return {
					svg: formattedSvg,
					confidence: 0.95,
					source: "pattern",
					metadata: {
						name: matchedPattern.name,
						collection: "built-in",
					},
				};
			} catch (error) {
				console.error("SVG formatting error:", error);
				// Fall through to fallback
			}
		}

		// マッチしない場合は汎用アイコンと提案を返す
		return this.generateFallbackResult(prompt);
	}

	private generateFallbackResult(_prompt: string): GenerationResult {
		// 汎用的なアイコンまたは最も近いマッチを返す
		const fallbackPattern = iconPatterns.find((p) => p.name === "info") || iconPatterns[0];

		return {
			svg: formatSVG(fallbackPattern.svg),
			confidence: 0.2,
			source: "fallback",
			metadata: {
				name: fallbackPattern.name,
				collection: "fallback",
			},
		};
	}
}

export const iconGenerator = new IconGenerationService();
