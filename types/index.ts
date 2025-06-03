export interface IconMetadata {
	collection?: string;
	name?: string;
	imageUrl?: string;
}

export interface HistoryItem {
	prompt: string;
	svg: string;
	date: string;
}

export interface GenerationResult {
	svg: string;
	confidence: number;
	source: string;
	metadata?: IconMetadata;
}

export type IconStyle = string;
