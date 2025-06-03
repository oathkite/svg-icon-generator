"use client";

import { Card, CardContent } from "@/components/ui/card";

export function LoadingState() {
	return (
		<div className="h-full flex items-center justify-center">
			<Card className="max-w-md">
				<CardContent className="pt-6">
					<div className="text-center space-y-4">
						<div className="p-8 bg-secondary rounded-lg">
							<div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">
								生成中
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								AIがアイコンを作成しています...
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}