"use client";

import { SvgIcon } from "@/components/svg-icon";
import { Card } from "@/components/ui/card";
import type { IconMetadata } from "@/types";

interface IconPreviewProps {
	svg: string;
	metadata?: IconMetadata | null;
}

export function IconPreview({ svg, metadata }: IconPreviewProps) {
	const isAiGenerated = metadata?.collection === "openai" && metadata?.imageUrl;

	return (
		<div className="h-full flex items-center justify-center">
			{isAiGenerated ? (
				<div className="flex gap-4 items-center">
					<div>
						<h3 className="text-sm font-medium mb-2">Generated PNG</h3>
						<Card className="w-64 h-64 p-4 bg-secondary shadow-none">
							<img 
								src={metadata.imageUrl} 
								alt="Generated PNG"
								className="w-full h-full object-contain"
							/>
						</Card>
					</div>
					<div>
						<h3 className="text-sm font-medium mb-2">Converted SVG</h3>
						<Card className="w-64 h-64 p-4 bg-secondary shadow-none">
							<SvgIcon svg={svg} className="text-foreground w-full h-full aspect-square" />
						</Card>
					</div>
				</div>
			) : (
				<Card className="w-full max-w-lg aspect-square p-6 bg-secondary shadow-none">
					<SvgIcon svg={svg} className="text-foreground w-full h-full aspect-square" />
				</Card>
			)}
		</div>
	);
}
