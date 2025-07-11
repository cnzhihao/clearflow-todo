import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'
import { Clarity } from '../components/clarity'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "清流待办 - AI 驱动的智能任务管理",
  description: "让 AI 帮您从复杂的想法中提取清晰的待办事项，告别繁琐的任务整理过程",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {children}
        <GoogleAnalytics gaId="G-LWBETX65FP" />
        <Clarity projectId="rxdgpwxh3v" />
      </body>
    </html>
  )
}
