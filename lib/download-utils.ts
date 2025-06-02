import { resizeSVG } from './svg-utils'

export const downloadSVG = (svg: string, size: number) => {
  const svgWithSize = resizeSVG(svg, size)
  
  const blob = new Blob([svgWithSize], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `icon-${size}x${size}.svg`
  a.click()
  URL.revokeObjectURL(url)
}