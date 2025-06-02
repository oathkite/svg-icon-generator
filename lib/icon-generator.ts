import { searchIcons, getIconSVG, type IconSearchResult } from './icon-search'
import { findMatchingPattern, type IconPattern } from './icon-patterns'
import { vertexAIGenerator } from './vertex-ai-generator'
import OpenAI from 'openai'

export interface IconGenerationResult {
  svg: string
  source: 'iconify' | 'pattern' | 'composed' | 'vertex-ai' | 'generated'
  confidence: number
  alternatives: {
    svg: string
    source: string
    score: number
  }[]
  metadata?: {
    collection?: string
    name?: string
    keywords?: string[]
  }
}

class IconGenerationService {
  private openai: OpenAI
  
  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })
  }
  
  async generateIcon(prompt: string): Promise<IconGenerationResult> {
    const alternatives: IconGenerationResult['alternatives'] = []
    
    // 1. Iconifyライブラリから検索
    const iconifyResult = await this.tryIconifySearch(prompt)
    if (iconifyResult) {
      alternatives.push(...iconifyResult.alternatives)
      return {
        svg: iconifyResult.svg,
        source: 'iconify',
        confidence: iconifyResult.confidence,
        alternatives,
        metadata: iconifyResult.metadata
      }
    }
    
    // 2. 事前定義パターンから検索
    const patternResult = await this.tryPatternSearch(prompt)
    if (patternResult) {
      alternatives.push({
        svg: patternResult.svg,
        source: 'pattern',
        score: patternResult.confidence
      })
      return {
        svg: patternResult.svg,
        source: 'pattern',
        confidence: patternResult.confidence,
        alternatives
      }
    }
    
    // 3. Vertex AI Imagen 4.0での画像生成
    const vertexResult = await this.tryVertexAIGeneration(prompt)
    if (vertexResult) {
      alternatives.push({
        svg: vertexResult.svg,
        source: 'vertex-ai',
        score: vertexResult.confidence
      })
      return {
        svg: vertexResult.svg,
        source: 'vertex-ai',
        confidence: vertexResult.confidence,
        alternatives
      }
    }
    
    // 4. OpenAI GPT-4による生成（最終手段）
    const generatedResult = await this.tryOpenAIGeneration(prompt)
    if (generatedResult) {
      return {
        svg: generatedResult.svg,
        source: 'generated',
        confidence: generatedResult.confidence,
        alternatives
      }
    }
    
    throw new Error('アイコンの生成に失敗しました')
  }
  
  private async tryIconifySearch(prompt: string): Promise<IconGenerationResult | null> {
    try {
      const searchResults = searchIcons(prompt)
      
      if (searchResults.length === 0) {
        return null
      }
      
      // 最高スコアのアイコンを取得
      const bestResult = searchResults[0]
      const svg = await getIconSVG(bestResult.collection, bestResult.name)
      
      if (!svg) {
        return null
      }
      
      // 代替案を取得
      const alternatives = await Promise.all(
        searchResults.slice(1, 4).map(async (result) => {
          const altSvg = await getIconSVG(result.collection, result.name)
          return altSvg ? {
            svg: altSvg,
            source: 'iconify',
            score: result.score
          } : null
        })
      )
      
      return {
        svg: this.ensureSVGFormat(svg),
        source: 'iconify',
        confidence: Math.min(bestResult.score, 100),
        alternatives: alternatives.filter(alt => alt !== null) as any[],
        metadata: {
          collection: bestResult.collection,
          name: bestResult.name,
          keywords: bestResult.keywords
        }
      }
    } catch (error) {
      console.error('Iconify search failed:', error)
      return null
    }
  }
  
  private async tryPatternSearch(prompt: string): Promise<IconGenerationResult | null> {
    const pattern = findMatchingPattern(prompt)
    if (!pattern) {
      return null
    }
    
    return {
      svg: this.ensureSVGFormat(pattern.svg),
      source: 'pattern',
      confidence: 90,
      alternatives: []
    }
  }
  
  private async tryVertexAIGeneration(prompt: string): Promise<IconGenerationResult | null> {
    try {
      const result = await vertexAIGenerator.generateIconWithFallback(prompt)
      if (result) {
        return {
          svg: result.svg,
          source: result.source === 'vertex-ai' ? 'vertex-ai' : 'generated',
          confidence: result.confidence,
          alternatives: []
        }
      }
      return null
    } catch (error) {
      console.error('Vertex AI generation failed:', error)
      return null
    }
  }
  
  private async tryOpenAIGeneration(prompt: string): Promise<IconGenerationResult | null> {
    try {
      // 改善されたプロンプトで生成
      const enhancedPrompt = this.enhancePromptForAI(prompt)
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `あなたはSVGピクトグラムアイコンのエキスパートです。以下の条件でシンプルなアイコンを作成してください：

- 24x24 viewBoxを使用
- シンプルな幾何学的形状
- stroke-width="2" stroke="currentColor" fill="none"
- 認識しやすいミニマルデザイン
- 完全なSVGコードのみを出力`
          },
          {
            role: 'user',
            content: `「${enhancedPrompt}」のピクトグラムアイコンを作成してください。`
          }
        ],
        temperature: 0.3,
        max_tokens: 400,
      })
      
      const content = completion.choices[0]?.message?.content || ''
      const svg = this.extractAndCleanSVG(content)
      
      if (!svg) {
        return null
      }
      
      return {
        svg,
        source: 'generated',
        confidence: 60, // AI生成は信頼度を低めに設定
        alternatives: []
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      return null
    }
  }
  
  private enhancePromptForAI(prompt: string): string {
    // プロンプトをより具体的に変換
    const enhancements: { [key: string]: string } = {
      'メール': 'email envelope with simple rectangular shape',
      'ホーム': 'house with triangular roof and square base',
      '設定': 'gear or cog wheel with teeth',
      'ユーザー': 'person silhouette with circular head',
      '検索': 'magnifying glass with circular lens',
      'メニュー': 'three horizontal parallel lines',
    }
    
    return enhancements[prompt] || prompt
  }
  
  private extractAndCleanSVG(content: string): string {
    const svgMatch = content.match(/<svg[^>]*>.*?<\/svg>/s)
    if (!svgMatch) {
      return ''
    }
    
    let svg = svgMatch[0]
    
    // 必須属性を確認・追加
    if (!svg.includes('viewBox=')) {
      svg = svg.replace('<svg', '<svg viewBox="0 0 24 24"')
    }
    if (!svg.includes('width=')) {
      svg = svg.replace('<svg', '<svg width="24"')
    }
    if (!svg.includes('height=')) {
      svg = svg.replace('<svg', '<svg height="24"')
    }
    if (!svg.includes('xmlns=')) {
      svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
    }
    
    return svg
  }
  
  private ensureSVGFormat(svg: string): string {
    // SVGが必要な属性を持っているか確認
    if (!svg.includes('<svg')) {
      return svg
    }
    
    let formatted = svg
    
    // strokeやfillの設定を統一
    if (!formatted.includes('stroke="currentColor"')) {
      formatted = formatted.replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
      if (!formatted.includes('stroke=')) {
        formatted = formatted.replace(/<path([^>]*)>/g, '<path$1 stroke="currentColor">')
      }
    }
    
    return formatted
  }
}

export const iconGenerator = new IconGenerationService()