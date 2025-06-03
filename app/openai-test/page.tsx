"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function OpenAITestPage() {
	const [prompt, setPrompt] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const generateImage = async () => {
		setLoading(true);
		setError("");
		setImageUrl("");

		try {
			const response = await fetch("/api/openai-generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to generate image");
			}

			setImageUrl(data.imageUrl);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-2xl p-8">
			<h1 className="text-3xl font-bold mb-8">OpenAI Image Generation Test</h1>

			<Card className="p-6">
				<div className="space-y-4">
					<div>
						<Label htmlFor="prompt">Image Prompt</Label>
						<Input
							id="prompt"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder="Enter a description for the image..."
							className="mt-2"
						/>
					</div>

					<Button onClick={generateImage} disabled={!prompt || loading} className="w-full">
						{loading ? "Generating..." : "Generate Image"}
					</Button>

					{error && <div className="text-red-500 text-sm mt-2">Error: {error}</div>}

					{loading && (
						<div className="mt-6">
							<Skeleton className="w-full h-96" />
						</div>
					)}

					{imageUrl && !loading && (
						<div className="mt-6">
							<img src={imageUrl} alt={prompt} className="w-full rounded-lg shadow-lg" />
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
