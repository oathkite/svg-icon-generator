"use client";

import { SvgIcon } from "@/components/svg-icon";
import { Card } from "@/components/ui/card";
import type { IconMetadata } from "@/types";

interface IconPreviewProps {
	svg: string;
	metadata?: IconMetadata | null;
}

export function IconPreview({ svg, metadata }: IconPreviewProps) {
	return (
		<div className="h-full flex items-center justify-center">
			<Card className="w-full max-w-lg aspect-square p-6 bg-secondary shadow-none">
				<SvgIcon svg={svg} className="text-foreground w-full h-full aspect-square" />
			</Card>
		</div>
	);
}
