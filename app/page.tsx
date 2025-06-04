"use client";

import { EmptyState } from "@/components/empty-state";
import { GenerationControls } from "@/components/generation-controls";
import { HistoryGrid } from "@/components/history-grid";
import { IconPreview } from "@/components/icon-preview";
import { LoadingState } from "@/components/loading-state";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useHistory } from "@/hooks/use-history";
import { useIconGeneration } from "@/hooks/use-icon-generation";
import { downloadSVG, downloadPNG } from "@/lib/download-utils";
import { formatSVG } from "@/lib/svg-utils";
import { APP_VERSION } from "@/lib/version";
import type { HistoryItem } from "@/types";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";

export default function IconGenerator() {
	const [prompt, setPrompt] = useState("");
	const { history, addToHistory, clearHistory } = useHistory();
	const { loading, svg, metadata, iconStyle, generate, setSvg, setIconStyle } = useIconGeneration();

	const handleGenerate = async () => {
		const result = await generate(prompt);
		if (result) {
			addToHistory(prompt, result.svg);
		}
	};

	const handleSelectHistoryItem = (item: HistoryItem) => {
		setSvg(item.svg);
		setPrompt(item.prompt);
	};

	const copyToClipboard = (text: string) => {
		const formattedSVG = formatSVG(text);
		navigator.clipboard
			.writeText(formattedSVG)
			.then(() => {
				toast.success("SVGコードをコピーしました");
			})
			.catch(() => {
				toast.error("コピーに失敗しました", {
					description: "クリップボードへのアクセスが拒否されました",
				});
			});
	};

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "20rem",
				} as React.CSSProperties
			}
		>
			<div className="flex h-screen w-full">
				<Sidebar>
					<SidebarHeader className="border-b px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<div>
									<h1 className="text-lg font-semibold">Pictogen</h1>
									<p className="text-xs text-muted-foreground">AI powered pictogram generator</p>
								</div>
							</div>
							<ThemeToggle />
						</div>
					</SidebarHeader>

					<SidebarContent className="px-6 py-6">
						<div className="space-y-6">
							<GenerationControls
								prompt={prompt}
								onPromptChange={setPrompt}
								iconStyle={iconStyle}
								onIconStyleChange={setIconStyle}
								onGenerate={handleGenerate}
								loading={loading}
							/>

							<HistoryGrid
								history={history}
								currentSvg={svg}
								onSelectItem={handleSelectHistoryItem}
								onClearHistory={clearHistory}
							/>
						</div>
					</SidebarContent>

					<SidebarFooter className="border-t px-6 py-4">
						<div className="text-xs text-muted-foreground text-center">Pictogen v{APP_VERSION}</div>
					</SidebarFooter>
				</Sidebar>

				<main className="flex-1 flex flex-col overflow-hidden">
					<header className="border-b px-6 py-4 flex items-center justify-between min-h-[64px]">
						<div className="flex items-center">
							<SidebarTrigger />
							<div className="ml-4">
								<h2 className="text-xl font-semibold">
									{loading ? "Generating..." : svg ? "Pictogram preview" : "Generate a pictogram"}
								</h2>
							</div>
						</div>
						{svg && (
							<div className="flex gap-2">
								<Button variant="secondary" size="sm" onClick={() => copyToClipboard(svg)}>
									Copy SVG
								</Button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button size="sm">
											<DownloadIcon />
											SVG
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onClick={() => downloadSVG(svg, 16)}>
											16×16px
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => downloadSVG(svg, 24)}>
											24×24px
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => downloadSVG(svg, 32)}>
											32×32px
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => downloadSVG(svg, 48)}>
											48×48px
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => downloadSVG(svg, 64)}>
											64×64px
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button 
									size="sm" 
									onClick={() => downloadPNG(svg, 1024).catch(() => toast.error("PNGのダウンロードに失敗しました"))}
								>
									<DownloadIcon />
									PNG
								</Button>
							</div>
						)}
					</header>

					<div className="flex-1 overflow-auto">
						<div className="h-full p-6">
							{loading ? (
								<LoadingState />
							) : svg ? (
								<IconPreview svg={svg} metadata={metadata} />
							) : (
								<EmptyState />
							)}
						</div>
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
