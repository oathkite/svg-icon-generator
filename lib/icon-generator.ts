import type { GenerationResult } from "@/types";
import { findMatchingPattern, iconPatterns } from "./icon-patterns";
import { formatSVG, isValidSVG } from "./svg-utils";

class IconGenerationService {
	async generateIcon(prompt: string, iconStyle?: string): Promise<GenerationResult> {
		if (!prompt.trim()) {
			throw new Error("プロンプトが空です");
		}

		// まずOpenAI APIで画像生成を試みる
		try {
			const result = await this.generateWithOpenAI(prompt, iconStyle);
			console.log("OpenAI result:", result);
			if (result) {
				return result;
			}
			console.log("OpenAI returned null, falling back");
		} catch (error) {
			console.error("OpenAI generation error:", error);
		}

		// OpenAIが失敗した場合はパターンマッチングでアイコンを検索
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

	private async generateWithOpenAI(
		prompt: string,
		iconStyle?: string,
	): Promise<GenerationResult | null> {
		try {
			const response = await fetch("/api/generate-icon", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt, iconStyle }),
			});

			console.log("Response status:", response.ok);
			if (!response.ok) {
				return null;
			}

			const result = await response.json();
			console.log("API result:", result);

			if (!result.svg) {
				console.log("No SVG in result");
				return null;
			}

			const generationResult = {
				svg: formatSVG(result.svg),
				confidence: result.confidence,
				source: result.source,
				metadata: result.metadata,
			};
			console.log("Returning generation result:", generationResult);
			return generationResult;
		} catch (error) {
			console.error("OpenAI API error:", error);
			return null;
		}
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