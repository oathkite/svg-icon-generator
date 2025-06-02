import { getIcons, type IconifyJSON } from '@iconify/utils'

// 人気のアイコンコレクション
export const iconCollections = [
  'material-symbols',
  'mdi',
  'heroicons',
  'lucide',
  'tabler',
  'ph',
  'solar',
  'fluent',
  'mingcute',
  'iconamoon'
]

// アイコンメタデータ（事前に定義された検索用データ）
export const iconMetadata: Record<string, { keywords: string[], collection: string, name: string }[]> = {
  'mail': [
    { keywords: ['mail', 'email', 'envelope', 'message', 'メール'], collection: 'material-symbols', name: 'mail-outline' },
    { keywords: ['mail', 'email', 'envelope'], collection: 'heroicons', name: 'envelope' },
    { keywords: ['mail', 'email'], collection: 'lucide', name: 'mail' },
  ],
  'home': [
    { keywords: ['home', 'house', 'ホーム', '家'], collection: 'material-symbols', name: 'home' },
    { keywords: ['home', 'house'], collection: 'heroicons', name: 'home' },
    { keywords: ['home'], collection: 'lucide', name: 'home' },
  ],
  'settings': [
    { keywords: ['settings', 'gear', 'cog', '設定'], collection: 'material-symbols', name: 'settings' },
    { keywords: ['settings', 'cog'], collection: 'heroicons', name: 'cog-6-tooth' },
    { keywords: ['settings'], collection: 'lucide', name: 'settings' },
  ],
  'user': [
    { keywords: ['user', 'person', 'account', 'ユーザー'], collection: 'material-symbols', name: 'person' },
    { keywords: ['user', 'person'], collection: 'heroicons', name: 'user' },
    { keywords: ['user'], collection: 'lucide', name: 'user' },
  ],
  'search': [
    { keywords: ['search', 'find', 'magnifying', '検索'], collection: 'material-symbols', name: 'search' },
    { keywords: ['search', 'magnifying'], collection: 'heroicons', name: 'magnifying-glass' },
    { keywords: ['search'], collection: 'lucide', name: 'search' },
  ],
  'menu': [
    { keywords: ['menu', 'hamburger', 'メニュー'], collection: 'material-symbols', name: 'menu' },
    { keywords: ['menu', 'bars'], collection: 'heroicons', name: 'bars-3' },
    { keywords: ['menu'], collection: 'lucide', name: 'menu' },
  ],
  'close': [
    { keywords: ['close', 'x', 'cancel', '閉じる'], collection: 'material-symbols', name: 'close' },
    { keywords: ['close', 'x'], collection: 'heroicons', name: 'x-mark' },
    { keywords: ['close', 'x'], collection: 'lucide', name: 'x' },
  ],
  'check': [
    { keywords: ['check', 'done', 'checkmark', 'チェック'], collection: 'material-symbols', name: 'check' },
    { keywords: ['check'], collection: 'heroicons', name: 'check' },
    { keywords: ['check'], collection: 'lucide', name: 'check' },
  ],
  'star': [
    { keywords: ['star', 'favorite', 'スター'], collection: 'material-symbols', name: 'star' },
    { keywords: ['star'], collection: 'heroicons', name: 'star' },
    { keywords: ['star'], collection: 'lucide', name: 'star' },
  ],
  'heart': [
    { keywords: ['heart', 'love', 'favorite', 'ハート'], collection: 'material-symbols', name: 'favorite' },
    { keywords: ['heart', 'love'], collection: 'heroicons', name: 'heart' },
    { keywords: ['heart'], collection: 'lucide', name: 'heart' },
  ],
  'download': [
    { keywords: ['download', 'save', 'ダウンロード'], collection: 'material-symbols', name: 'download' },
    { keywords: ['download', 'arrow-down'], collection: 'heroicons', name: 'arrow-down-tray' },
    { keywords: ['download'], collection: 'lucide', name: 'download' },
  ],
  'upload': [
    { keywords: ['upload', 'import', 'アップロード'], collection: 'material-symbols', name: 'upload' },
    { keywords: ['upload', 'arrow-up'], collection: 'heroicons', name: 'arrow-up-tray' },
    { keywords: ['upload'], collection: 'lucide', name: 'upload' },
  ],
  'delete': [
    { keywords: ['delete', 'trash', 'remove', '削除', 'ゴミ箱'], collection: 'material-symbols', name: 'delete' },
    { keywords: ['trash', 'delete'], collection: 'heroicons', name: 'trash' },
    { keywords: ['trash'], collection: 'lucide', name: 'trash' },
  ],
  'edit': [
    { keywords: ['edit', 'pencil', 'write', '編集'], collection: 'material-symbols', name: 'edit' },
    { keywords: ['edit', 'pencil'], collection: 'heroicons', name: 'pencil' },
    { keywords: ['edit', 'pencil'], collection: 'lucide', name: 'pencil' },
  ],
  'save': [
    { keywords: ['save', 'disk', '保存'], collection: 'material-symbols', name: 'save' },
    { keywords: ['save'], collection: 'heroicons', name: 'folder' },
    { keywords: ['save'], collection: 'lucide', name: 'save' },
  ],
  'share': [
    { keywords: ['share', 'send', '共有'], collection: 'material-symbols', name: 'share' },
    { keywords: ['share'], collection: 'heroicons', name: 'share' },
    { keywords: ['share'], collection: 'lucide', name: 'share' },
  ],
  'lock': [
    { keywords: ['lock', 'security', 'password', 'ロック'], collection: 'material-symbols', name: 'lock' },
    { keywords: ['lock'], collection: 'heroicons', name: 'lock-closed' },
    { keywords: ['lock'], collection: 'lucide', name: 'lock' },
  ],
  'unlock': [
    { keywords: ['unlock', 'open', 'アンロック'], collection: 'material-symbols', name: 'lock-open' },
    { keywords: ['unlock', 'lock-open'], collection: 'heroicons', name: 'lock-open' },
    { keywords: ['unlock'], collection: 'lucide', name: 'unlock' },
  ],
  'calendar': [
    { keywords: ['calendar', 'date', 'schedule', 'カレンダー'], collection: 'material-symbols', name: 'calendar-today' },
    { keywords: ['calendar'], collection: 'heroicons', name: 'calendar' },
    { keywords: ['calendar'], collection: 'lucide', name: 'calendar' },
  ],
  'clock': [
    { keywords: ['clock', 'time', '時計'], collection: 'material-symbols', name: 'schedule' },
    { keywords: ['clock', 'time'], collection: 'heroicons', name: 'clock' },
    { keywords: ['clock'], collection: 'lucide', name: 'clock' },
  ],
}

export interface IconSearchResult {
  collection: string
  name: string
  svg?: string
  keywords: string[]
  score: number
}

export function searchIcons(query: string): IconSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim()
  const results: IconSearchResult[] = []
  
  // スコア計算関数
  const calculateScore = (keywords: string[], query: string): number => {
    let score = 0
    for (const keyword of keywords) {
      if (keyword.toLowerCase() === query) {
        score += 100 // 完全一致
      } else if (keyword.toLowerCase().includes(query)) {
        score += 50 // 部分一致
      } else if (query.includes(keyword.toLowerCase())) {
        score += 30 // クエリがキーワードを含む
      }
    }
    return score
  }
  
  // すべてのメタデータを検索
  for (const [category, icons] of Object.entries(iconMetadata)) {
    for (const icon of icons) {
      const score = calculateScore(icon.keywords, normalizedQuery)
      if (score > 0) {
        results.push({
          collection: icon.collection,
          name: icon.name,
          keywords: icon.keywords,
          score
        })
      }
    }
  }
  
  // スコア順にソート
  results.sort((a, b) => b.score - a.score)
  
  // 上位10件を返す
  return results.slice(0, 10)
}

// Iconifyコレクションから実際のSVGを取得
export async function getIconSVG(collection: string, name: string): Promise<string | null> {
  try {
    // 実際の実装では、CDNからアイコンデータを取得
    const response = await fetch(`https://api.iconify.design/${collection}/${name}.svg`)
    if (response.ok) {
      return await response.text()
    }
  } catch (error) {
    console.error('Failed to fetch icon:', error)
  }
  return null
}