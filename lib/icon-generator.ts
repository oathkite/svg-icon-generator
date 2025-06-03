import type { GenerationResult } from "@/types";
import { formatSVG } from "./svg-utils";

class IconGenerationService {
	async generateIcon(prompt: string, iconStyle?: string): Promise<GenerationResult> {
		if (!prompt.trim()) {
			throw new Error("プロンプトが空です");
		}

		// OpenAI APIで画像生成を試みる
		const result = await this.generateWithOpenAI(prompt, iconStyle);
		
		if (!result) {
			throw new Error("アイコンの生成に失敗しました。OpenAI APIの接続を確認してください。");
		}

		return result;
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

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				const errorMessage = errorData?.error || `API エラー: ${response.status}`;
				throw new Error(errorMessage);
			}

			const result = await response.json();

			if (!result.svg) {
				throw new Error("SVGの生成に失敗しました");
			}

			return {
				svg: formatSVG(result.svg),
				confidence: result.confidence || 1,
				source: result.source || "openai",
				metadata: result.metadata || {},
			};
		} catch (error) {
			console.error("OpenAI API error:", error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("不明なエラーが発生しました");
		}
	}
}

export const iconGenerator = new IconGenerationService();