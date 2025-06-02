export interface IconMetadata {
  collection?: string
  name?: string
}

export interface HistoryItem {
  prompt: string
  svg: string
  date: string
}

export interface GenerationResult {
  svg: string
  confidence: number
  alternatives: Alternative[]
  source: string
  metadata?: IconMetadata
}

export interface Alternative {
  svg: string
  score: number
  source?: string
}

export interface IconGenerationRequest {
  prompt: string
}

export interface IconGenerationResponse {
  svg: string
  confidence: number
  alternatives: Alternative[]
  source: string
  metadata?: IconMetadata
}