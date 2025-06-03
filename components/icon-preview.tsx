"use client";

import { SvgIcon } from "@/components/svg-icon";
import { Card } from "@/components/ui/card";
import type { IconMetadata } from "@/types";

interface IconPreviewProps {
	svg: string;
	metadata?: IconMetadata | null;
}

export function IconPreview({ svg, metadata }: IconPreviewProps) {
	// Check if this is an AI-generated icon with an image URL
	const isAiGenerated = metadata?.collection === "openai" && metadata?.imageUrl;

	return (
		<div className="h-full flex items-center justify-center">
			<Card className="w-full max-w-lg aspect-square p-6 bg-secondary shadow-none">
				{isAiGenerated && metadata?.imageUrl ? (
					<img 
						src={metadata.imageUrl} 
						alt={metadata.name || "Generated icon"}
						className="w-full h-full object-contain"
					/>
				) : (
					<SvgIcon svg={svg} className="text-foreground w-full h-full aspect-square" />
				)}
			</Card>
		</div>
	);
}
