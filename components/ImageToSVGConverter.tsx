'use client'

import { useRef, useCallback } from 'react'

interface ImageToSVGConverterProps {
  base64Image: string
  onSVGGenerated: (svg: string) => void
}

export function ImageToSVGConverter({ base64Image, onSVGGenerated }: ImageToSVGConverterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const convertToSVG = useCallback(async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Load the image
    const img = new Image()
    img.onload = () => {
      // Set canvas size
      canvas.width = 256
      canvas.height = 256

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, 256, 256)

      // Get image data
      const imageData = ctx.getImageData(0, 0, 256, 256)
      const data = imageData.data

      // Convert to black and white
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
        const binary = gray > 128 ? 255 : 0
        data[i] = binary     // Red
        data[i + 1] = binary // Green
        data[i + 2] = binary // Blue
        // Alpha stays the same
      }

      // Put the processed image back
      ctx.putImageData(imageData, 0, 0)

      // Simple edge detection and path generation
      const paths = extractPaths(imageData)
      const svg = generateSVG(paths)
      onSVGGenerated(svg)
    }

    img.src = `data:image/png;base64,${base64Image}`
  }, [base64Image, onSVGGenerated])

  // Simple path extraction (very basic implementation)
  function extractPaths(imageData: ImageData): string[] {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data
    const paths: string[] = []

    // Very simple approach: create rectangles for black pixels
    // This is a placeholder - a real implementation would use
    // more sophisticated edge detection and curve fitting
    let path = 'M'
    let hasPoints = false

    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 8) {
        const index = (y * width + x) * 4
        const isBlack = data[index] < 128

        if (isBlack && !hasPoints) {
          // Convert to 24x24 coordinate system
          const svgX = Math.round((x / width) * 24)
          const svgY = Math.round((y / height) * 24)
          path += `${svgX},${svgY} `
          hasPoints = true
        }
      }
    }

    if (hasPoints) {
      paths.push(path)
    }

    return paths
  }

  function generateSVG(paths: string[]): string {
    if (paths.length === 0) {
      // Fallback: create a simple shape
      return `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>`
    }

    const pathElements = paths.map(path => 
      `<path d="${path}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('\n  ')

    return `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  ${pathElements}
</svg>`
  }

  return (
    <div className="hidden">
      <canvas ref={canvasRef} />
      <button onClick={convertToSVG} className="hidden">
        Convert to SVG
      </button>
    </div>
  )
}

// Hook for easier usage
export function useImageToSVG() {
  const convertImageToSVG = useCallback(async (base64Image: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(generateFallbackSVG())
        return
      }

      const img = new Image()
      img.onload = () => {
        canvas.width = 256
        canvas.height = 256
        ctx.drawImage(img, 0, 0, 256, 256)

        // Simple conversion to SVG (placeholder implementation)
        const svg = generateFallbackSVG()
        resolve(svg)
      }

      img.onerror = () => {
        resolve(generateFallbackSVG())
      }

      img.src = `data:image/png;base64,${base64Image}`
    })
  }, [])

  return { convertImageToSVG }
}

function generateFallbackSVG(): string {
  return `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" fill="none"/>
  </svg>`
}