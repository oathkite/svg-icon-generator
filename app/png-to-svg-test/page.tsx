"use client";

import { SvgIcon } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadSVG } from "@/lib/download-utils";
import { useState } from "react";

export default function PngToSvgTestPage() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [svgResult, setSvgResult] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			setError("画像ファイルを選択してください");
			return;
		}

		setError("");
		setSelectedFile(file);
		setSvgResult("");

		// Create preview URL
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewUrl(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const convertToSvg = async () => {
		if (!previewUrl) return;

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/trace-image", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ imageUrl: previewUrl }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "変換に失敗しました");
			}

			setSvgResult(data.svg);
		} catch (err) {
			setError(err instanceof Error ? err.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(svgResult).then(() => {
			alert("SVGコードをコピーしました");
		});
	};

	return (
		<div className="container mx-auto max-w-4xl p-8">
			<h1 className="text-3xl font-bold mb-8">PNG to SVG 変換テスト</h1>

			<Card className="p-6 mb-6">
				<div className="space-y-4">
					<div>
						<Label htmlFor="file-input">PNG画像を選択</Label>
						<Input
							id="file-input"
							type="file"
							accept="image/png,image/*"
							onChange={handleFileSelect}
							className="mt-2"
						/>
						<p className="text-sm text-muted-foreground mt-1">
							背景が白で図柄が黒のモノクロPNG画像を選択してください
						</p>
					</div>

					<Button onClick={convertToSvg} disabled={!selectedFile || loading} className="w-full">
						{loading ? "変換中..." : "SVGに変換"}
					</Button>

					{error && <div className="text-red-500 text-sm">Error: {error}</div>}
				</div>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Original PNG Preview */}
				<div>
					<h2 className="text-xl font-semibold mb-3">元画像 (PNG)</h2>
					<Card className="p-4 h-80 flex items-center justify-center bg-white">
						{loading && <Skeleton className="w-full h-full" />}
						{previewUrl && !loading && (
							<img
								src={previewUrl}
								alt="Original PNG"
								className="max-w-full max-h-full object-contain"
							/>
						)}
						{!previewUrl && !loading && (
							<p className="text-muted-foreground">画像を選択してください</p>
						)}
					</Card>
				</div>

				{/* SVG Result */}
				<div>
					<h2 className="text-xl font-semibold mb-3">変換結果 (SVG)</h2>
					<Card className="p-4 h-80 flex items-center justify-center bg-secondary">
						{loading && <Skeleton className="w-full h-full" />}
						{svgResult && !loading && (
							<SvgIcon svg={svgResult} className="w-full h-full object-contain" />
						)}
						{!svgResult && !loading && (
							<p className="text-muted-foreground">変換結果がここに表示されます</p>
						)}
					</Card>
				</div>
			</div>

			{/* SVG Code and Actions */}
			{svgResult && (
				<Card className="p-6 mt-6">
					<h3 className="text-lg font-semibold mb-3">SVGコード</h3>
					<div className="relative">
						<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
							<code>{svgResult}</code>
						</pre>
					</div>
					<div className="flex gap-2 mt-4">
						<Button variant="secondary" onClick={copyToClipboard}>
							コピー
						</Button>
						<Button onClick={() => downloadSVG(svgResult, 24)}>ダウンロード</Button>
					</div>
				</Card>
			)}

			{/* Technical Details */}
			<Card className="p-6 mt-6">
				<h3 className="text-lg font-semibold mb-3">技術仕様</h3>
				<ul className="space-y-2 text-sm text-muted-foreground">
					<li>• Potrace を使用してビットマップをベクターパスに変換</li>
					<li>• 前処理: グレースケール変換、コントラスト調整</li>
					<li>• 出力: 24x24 viewBox、currentColor 使用</li>
					<li>• 背景透過、パスデータのみ抽出</li>
				</ul>
			</Card>
		</div>
	);
}
