'use client'

import { StagewiseToolbar } from '@stagewise/toolbar-next'

const stagewiseConfig = {
  plugins: []
}

export function StagewiseDevToolbar() {
  // 只在开发环境下渲染工具栏
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <StagewiseToolbar config={stagewiseConfig} />
}