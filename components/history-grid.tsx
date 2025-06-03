"use client";

import { SvgIcon } from "@/components/svg-icon";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { normalizeSVG } from "@/lib/svg-utils";
import type { HistoryItem } from "@/types";
import { toast } from "sonner";

interface HistoryGridProps {
	history: HistoryItem[];
	currentSvg: string;
	onSelectItem: (item: HistoryItem) => void;
	onClearHistory: () => void;
}

export function HistoryGrid({
	history,
	currentSvg,
	onSelectItem,
	onClearHistory,
}: HistoryGridProps) {
	if (history.length === 0) {
		return null;
	}

	const handleClearHistory = () => {
		onClearHistory();
		toast.success("履歴をクリアしました");
	};

	return (
		<>
			<Separator />
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>履歴</Label>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs text-muted-foreground hover:text-foreground"
							>
								クリア
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>履歴をクリアしますか？</AlertDialogTitle>
								<AlertDialogDescription>
									この操作は元に戻すことができません。すべてのアイコン履歴が削除されます。
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>キャンセル</AlertDialogCancel>
								<AlertDialogAction onClick={handleClearHistory}>クリア</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
				<div className="grid grid-cols-4 gap-3">
					{history.slice(0, 20).map((item, index) => {
						const isActive = currentSvg === item.svg;
						return (
							<Button
								key={`history-${index}-${item.date}`}
								variant="outline"
								onClick={() => onSelectItem(item)}
								className={`w-full aspect-square p-3 min-h-[58px] ${
									isActive ? "ring-2 ring-primary" : "hover:bg-secondary border-border"
								}`}
								title={item.prompt}
							>
								<div className="w-full h-full flex items-center justify-center">
									<SvgIcon
										svg={normalizeSVG(item.svg)}
										style={{ width: 24, height: 24 }}
										className="[&_svg]:w-full [&_svg]:h-full [&_svg]:text-current [&_svg_*]:fill-current [&_svg_*]:stroke-none flex-shrink-0"
									/>
								</div>
							</Button>
						);
					})}
				</div>
			</div>
		</>
	);
}
