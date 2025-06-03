import { iconGenerator } from "@/lib/icon-generator";
import { formatSVG } from "@/lib/svg-utils";
import type { GenerationResult, IconMetadata, IconStyle } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

export function useIconGeneration() {
	const [loading, setLoading] = useState(false);
	const [svg, setSvg] = useState("");
	const [iconSource, setIconSource] = useState<string>("");
	const [metadata, setMetadata] = useState<IconMetadata | null>(null);
	const [iconStyle, setIconStyle] = useState<IconStyle>("auto");

	const generate = async (prompt: string): Promise<GenerationResult | null> => {
		if (!prompt.trim()) {
			toast.error("プロンプトを入力してください");
			return null;
		}

		setLoading(true);

		try {
			const result = await iconGenerator.generateIcon(prompt, iconStyle);

			if (result?.svg) {
				const formattedSvg = formatSVG(result.svg);
				setSvg(formattedSvg);
				setIconSource(result.source || "unknown");
				setMetadata(null); // メタデータは不要になった

				return {
					svg: formattedSvg,
					confidence: result.confidence || 0,
					source: result.source || "unknown",
					metadata: undefined,
				};
			}
			toast.error("アイコンの生成に失敗しました", {
				description: "別のキーワードやスタイルで再度お試しください。",
			});
			return null;
		} catch (error) {
			console.error("Generation error:", error);
			toast.error("エラーが発生しました", {
				description: error instanceof Error ? error.message : "不明なエラー",
			});
			return null;
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setSvg("");
		setIconSource("");
		setMetadata(null);
	};

	return {
		loading,
		svg,
		iconSource,
		metadata,
		iconStyle,
		generate,
		reset,
		setSvg,
		setIconStyle,
	};
}
