import { useState, useEffect } from 'react'
import { HistoryItem } from '@/types'

const STORAGE_KEY = 'icons'
const MAX_HISTORY_ITEMS = 20

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
  }, [])

  const addToHistory = (prompt: string, svg: string) => {
    const newItem: HistoryItem = {
      prompt,
      svg,
      date: new Date().toISOString()
    }

    const newHistory = [
      newItem,
      ...history.filter(item => item.svg !== svg).slice(0, MAX_HISTORY_ITEMS - 1)
    ]

    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
}