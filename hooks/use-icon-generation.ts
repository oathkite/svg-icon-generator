import { useState } from 'react'
import { toast } from 'sonner'

export interface IconMetadata {
  collection?: string
  name?: string
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

export function useIconGeneration() {
  const [loading, setLoading] = useState(false)
  const [svg, setSvg] = useState('')
  const [quality, setQuality] = useState(0)
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [iconSource, setIconSource] = useState<string>('')
  const [metadata, setMetadata] = useState<IconMetadata | null>(null)

  const generate = async (prompt: string): Promise<GenerationResult | null> => {
    if (!prompt.trim()) {
      toast.error('プロンプトを入力してください')
      return null
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.svg) {
        setSvg(data.svg)
        setQuality(data.confidence || 0)
        setAlternatives(data.alternatives || [])
        setIconSource(data.source || 'unknown')
        setMetadata(data.metadata || null)

        return {
          svg: data.svg,
          confidence: data.confidence || 0,
          alternatives: data.alternatives || [],
          source: data.source || 'unknown',
          metadata: data.metadata
        }
      } else {
        toast.error('アイコンの生成に失敗しました')
        return null
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('エラーが発生しました', {
        description: error instanceof Error ? error.message : '不明なエラー'
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const selectAlternative = (alternative: Alternative) => {
    setSvg(alternative.svg)
    setQuality(alternative.score)
    setIconSource(alternative.source || 'unknown')
  }

  const reset = () => {
    setSvg('')
    setQuality(0)
    setAlternatives([])
    setIconSource('')
    setMetadata(null)
  }

  return {
    loading,
    svg,
    quality,
    alternatives,
    iconSource,
    metadata,
    generate,
    selectAlternative,
    reset,
    setSvg
  }
}