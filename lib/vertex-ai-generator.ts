import { GoogleAuth } from 'google-auth-library'

interface VertexAIImageResponse {
  predictions: Array<{
    bytesBase64Encoded: string
    mimeType: string
  }>
}

export class VertexAIIconGenerator {
  private auth: GoogleAuth
  private projectId: string
  private location: string
  
  constructor() {
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || ''
    this.location = process.env.VERTEX_AI_LOCATION || 'us-central1'
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    })
  }
  
  async generateIconImage(prompt: string): Promise<string | null> {
    try {
      const authClient = await this.auth.getClient()
      const accessToken = await authClient.getAccessToken()
      
      if (!accessToken.token) {
        throw new Error('Failed to get access token')
      }
      
      // Imagen 4.0 用に最適化されたプロンプト
      const optimizedPrompt = this.optimizePromptForImagen(prompt)
      
      const requestBody = {
        instances: [{
          prompt: optimizedPrompt,
          sampleCount: 1
        }],
        parameters: {
          sampleImageSize: "1024",
          aspectRatio: "1:1",
          safetyFilterLevel: "block_some",
          personGeneration: "dont_allow"
        }
      }
      
      const endpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-001:predict`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Vertex AI API error:', response.status, errorText)
        return null
      }
      
      const data: VertexAIImageResponse = await response.json()
      
      if (data.predictions && data.predictions.length > 0) {
        return data.predictions[0].bytesBase64Encoded
      }
      
      return null
    } catch (error) {
      console.error('Vertex AI generation error:', error)
      return null
    }
  }
  
  private optimizePromptForImagen(prompt: string): string {
    // 日本語プロンプトを英語に変換し、アイコン生成に最適化
    const translations: { [key: string]: string } = {
      'メール': 'email envelope',
      'ホーム': 'home house',
      '設定': 'settings gear',
      'ユーザー': 'user person profile',
      '検索': 'search magnifying glass',
      'メニュー': 'menu hamburger lines',
      '閉じる': 'close x cancel',
      'チェック': 'check checkmark done',
      'スター': 'star favorite',
      'ハート': 'heart love',
      'ダウンロード': 'download arrow down',
      'アップロード': 'upload arrow up',
      '削除': 'delete trash bin',
      '編集': 'edit pencil write',
      '保存': 'save disk floppy',
      '共有': 'share send export',
      'ロック': 'lock security',
      'カレンダー': 'calendar date schedule',
      '時計': 'clock time'
    }
    
    const translatedPrompt = translations[prompt] || prompt
    
    return `Minimalist icon design: ${translatedPrompt}. 
Simple, clean, single-color pictogram. 
Line art style with 2px stroke weight. 
White background, black lines only. 
No gradients, no shadows, no 3D effects. 
Centered, geometric, professional icon suitable for user interface. 
Vector-style illustration, high contrast.`
  }
  
  async convertImageToSVG(base64Image: string): Promise<string | null> {
    try {
      // 現在は簡易的な実装として、Vertex AIで生成された画像を
      // 外部サービスやクライアントサイドでSVGに変換することを想定
      // 実際の実装では以下のオプションが考えられます：
      // 1. 外部のImage-to-SVG変換API使用
      // 2. クライアントサイドでCanvas APIを使用
      // 3. 別のマイクロサービスでの変換処理
      
      console.log('Image to SVG conversion is not implemented yet')
      return null
    } catch (error) {
      console.error('Image to SVG conversion error:', error)
      return null
    }
  }
  
  private normalizeSVG(svgString: string): string {
    // SVGを24x24のviewBoxに正規化し、適切なスタイルを適用
    let normalized = svgString
      .replace(/width="[^"]*"/g, 'width="24"')
      .replace(/height="[^"]*"/g, 'height="24"')
      .replace(/viewBox="[^"]*"/g, 'viewBox="0 0 24 24"')
    
    // ストロークとフィルの設定を統一
    normalized = normalized.replace(
      /<path([^>]*)>/g, 
      '<path$1 stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">'
    )
    
    // 黒いfillを削除してストロークのみに
    normalized = normalized.replace(/fill="#000000?"/g, 'fill="none"')
    normalized = normalized.replace(/fill="black"/g, 'fill="none"')
    
    return normalized
  }
  
  async generateIconWithFallback(prompt: string): Promise<{
    svg: string
    source: 'vertex-ai' | 'fallback'
    confidence: number
    base64Image?: string
  } | null> {
    // Vertex AIで画像生成を試行
    const base64Image = await this.generateIconImage(prompt)
    
    if (base64Image) {
      // 画像生成が成功した場合、base64Imageを返してクライアントサイドで変換
      // 実際のSVG変換はクライアントサイドで行う
      return {
        svg: this.generateFallbackSVG(prompt) || this.createPlaceholderSVG(prompt),
        source: 'vertex-ai',
        confidence: 85,
        base64Image // クライアントサイドでの変換用
      }\n    }\n    \n    // フォールバック: シンプルなSVGパターンを生成\n    const fallbackSVG = this.generateFallbackSVG(prompt)\n    if (fallbackSVG) {\n      return {\n        svg: fallbackSVG,\n        source: 'fallback',\n        confidence: 40\n      }\n    }\n    \n    return null\n  }\n  \n  private createPlaceholderSVG(prompt: string): string {\n    // Vertex AI画像が生成されたが、SVG変換待ちの場合のプレースホルダー\n    return `<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n      <rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/>\n      <path d=\"M8 12h8M12 8v8\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\"/>\n      <text x=\"12\" y=\"20\" text-anchor=\"middle\" font-size=\"6\" fill=\"currentColor\">AI</text>\n    </svg>`\n  }
  
  private generateFallbackSVG(prompt: string): string | null {
    // 基本的なフォールバックSVGパターン
    const fallbackPatterns: { [key: string]: string } = {
      'メール': '<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="m22 7-10 5L2 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      'ホーム': '<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
      '設定': '<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 1v6m0 6v6m11-7h-6M7 12H1m15.09-5.09l-4.24 4.24m-5.66 0L1.95 6.95m15.18 10.1l-4.24-4.24m-5.66 0L1.95 17.05" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    }
    
    return fallbackPatterns[prompt] || null
  }
}

export const vertexAIGenerator = new VertexAIIconGenerator()