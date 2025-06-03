"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
	return (
		<div className="h-full flex items-center justify-center">
			<Card className="max-w-md">
				<CardHeader className="text-center">
					<CardTitle>アイコンを生成してください</CardTitle>
					<CardDescription>
						左側でプロンプトを入力し、生成ボタンをクリックしてください
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
