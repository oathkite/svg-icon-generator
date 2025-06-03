"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StyleCombobox } from "@/components/style-combobox";
import type { IconStyle } from "@/types";

interface GenerationControlsProps {
	prompt: string;
	onPromptChange: (prompt: string) => void;
	iconStyle: IconStyle;
	onIconStyleChange: (style: IconStyle) => void;
	onGenerate: () => void;
	loading: boolean;
}

export function GenerationControls({
	prompt,
	onPromptChange,
	iconStyle,
	onIconStyleChange,
	onGenerate,
	loading,
}: GenerationControlsProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="prompt">Description</Label>
				<Textarea
					id="prompt"
					value={prompt}
					onChange={(e) => onPromptChange(e.target.value)}
					placeholder="例: ペンギンドラゴン、かわいい"
					rows={3}
					className="resize-none"
					onKeyDown={(e) => {
						if (e.key === "Enter" && e.ctrlKey && !loading && prompt.trim()) {
							e.preventDefault();
							onGenerate();
						}
					}}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="icon-style">Style</Label>
				<StyleCombobox 
					value={iconStyle} 
					onValueChange={onIconStyleChange}
				/>
			</div>

			<div className="space-y-2">
				<Button onClick={onGenerate} disabled={loading || !prompt.trim()} className="w-full">
					{loading ? "生成中..." : "生成"}
				</Button>
				<p className="text-xs text-muted-foreground text-center">Ctrl + Enter で生成</p>
			</div>
		</div>
	);
}
