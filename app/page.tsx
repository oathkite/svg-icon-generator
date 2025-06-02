'use client'

import { useState, useEffect } from 'react'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DownloadIcon } from "@radix-ui/react-icons"
import { SvgIcon } from "@/components/svg-icon"
import { toast } from "sonner"

interface HistoryItem {
  prompt: string
  svg: string
  date: string
}

interface IconMetadata {
  collection?: string
  name?: string
}

export default function IconGenerator() {
  const [prompt, setPrompt] = useState('')
  const [svg, setSvg] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [alternatives, setAlternatives] = useState<{svg: string, score: number, source?: string}[]>([])
  const [quality, setQuality] = useState(0)
  const [iconSource, setIconSource] = useState<string>('')
  const [metadata, setMetadata] = useState<IconMetadata | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('icons')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const generate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      const data = await res.json()
      
      if (data.svg) {
        setSvg(data.svg)
        setQuality(data.confidence || 0)
        setAlternatives(data.alternatives || [])
        setIconSource(data.source || 'unknown')
        setMetadata(data.metadata || null)
        
        const newHistory = [
          { prompt, svg: data.svg, date: new Date().toISOString() },
          ...history.slice(0, 19),
        ]
        setHistory(newHistory)
        localStorage.setItem('icons', JSON.stringify(newHistory))
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadSVG = (size: number) => {
    const svgWithSize = svg
      .replace(/width="\d+"/, `width="${size}"`)
      .replace(/height="\d+"/, `height="${size}"`)
      .replace(/currentColor/g, '#000000')
    
    const blob = new Blob([svgWithSize], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `icon-${size}x${size}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatSVG = (svgString: string): string => {
    // Parse and format SVG with proper indentation
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, 'image/svg+xml')
    
    // Format with indentation
    const formatNode = (node: Node, indent: string = ''): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() || ''
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return ''
      }
      
      const element = node as Element
      let result = `${indent}<${element.tagName.toLowerCase()}`
      
      // Add attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        result += ` ${attr.name}="${attr.value}"`
      }
      
      // Check if element has children
      const hasChildren = element.childNodes.length > 0
      if (!hasChildren) {
        result += ' />'
        return result
      }
      
      result += '>'
      
      // Process children
      const childIndent = indent + '  '
      let hasTextContent = false
      
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i]
        if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          hasTextContent = true
          result += child.textContent.trim()
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          result += '\n' + formatNode(child, childIndent)
        }
      }
      
      if (!hasTextContent && element.childNodes.length > 0) {
        result += '\n' + indent
      }
      
      result += `</${element.tagName.toLowerCase()}>`
      return result
    }
    
    const svgElement = doc.documentElement
    return formatNode(svgElement)
  }

  const copyToClipboard = (text: string) => {
    const formattedSVG = formatSVG(text)
    navigator.clipboard.writeText(formattedSVG).then(() => {
      toast.success("SVGコードをコピーしました")
    }).catch(() => {
      toast.error("コピーに失敗しました", {
        description: "クリップボードへのアクセスが拒否されました"
      })
    })
  }

  return (
    <main className="h-screen bg-background flex flex-col">
      <header className="bg-card border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Pictogram Generator
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
      >
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full overflow-y-auto p-6 bg-card">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">何のアイコンを作りますか？</Label>
                <div className="flex gap-2">
                  <Input
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generate()}
                    placeholder="メール"
                    className="flex-1"
                  />
                  <Button
                    onClick={generate}
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? '生成中...' : '生成'}
                  </Button>
                </div>
              </div>

              {history.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label>履歴</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {history.slice(0, 20).map((item, index) => (
                        <Button
                          key={`history-${index}-${item.date}`}
                          variant="outline"
                          onClick={() => {
                            setSvg(item.svg)
                            setPrompt(item.prompt)
                          }}
                          className="w-full aspect-square p-2 hover:bg-secondary"
                          title={item.prompt}
                        >
                          <SvgIcon 
                            svg={item.svg.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"')}
                            className="w-full h-full [&_svg]:w-full [&_svg]:h-full [&_svg]:text-current aspect-square"
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full bg-background overflow-y-auto p-6">
            {svg ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="p-8 bg-secondary rounded-lg">
                          <SvgIcon 
                            svg={svg}
                            style={{ width: 48, height: 48 }}
                            className="mx-auto text-foreground"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          プレビュー
                        </p>
                        {quality > 0 && (
                          <Badge variant="secondary" className="mt-1">
                            信頼度: {quality}%
                          </Badge>
                        )}
                        {iconSource && (
                          <Badge variant="default" className="mt-1 ml-1">
                            {iconSource === 'iconify' ? 'Iconifyライブラリ' : 
                             iconSource === 'pattern' ? '事前定義パターン' :
                             iconSource === 'vertex-ai' ? 'Vertex AI Imagen' :
                             iconSource === 'generated' ? 'OpenAI GPT-4' : iconSource}
                          </Badge>
                        )}
                        {metadata?.collection && metadata?.name && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {metadata.collection}:{metadata.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {alternatives.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">他の候補</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3 justify-center">
                        {alternatives.map((alt, index) => (
                          <Button
                            key={`alt-${index}-${alt.score}`}
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSvg(alt.svg)
                              setQuality(alt.score)
                              setIconSource(alt.source || 'unknown')
                            }}
                            className="h-16 w-16"
                            title={`スコア: ${alt.score}/100`}
                          >
                            <SvgIcon 
                              svg={alt.svg}
                              style={{ width: 24, height: 24 }}
                              className="text-foreground"
                            />
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(svg)}
                  >
                    Copy SVG
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm">
                        <DownloadIcon />
                        Download
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => downloadSVG(16)}>
                        16×16px
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadSVG(24)}>
                        24×24px
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadSVG(32)}>
                        32×32px
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadSVG(48)}>
                        48×48px
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadSVG(64)}>
                        64×64px
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card className="max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle>アイコンを生成してください</CardTitle>
                    <CardDescription>
                      左側でプロンプトを入力し、生成ボタンをクリックしてください
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}