import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SVG Icon Generator - 単色ピクトグラム版',
  description: 'シンプルな単色ピクトグラムアイコンを生成する軽量Webアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            theme="system"
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: 'bg-background text-foreground border-border',
                title: 'text-foreground',
                description: 'text-muted-foreground',
                error: 'bg-destructive text-destructive-foreground',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}