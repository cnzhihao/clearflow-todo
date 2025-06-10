'use client'

import { useEffect } from 'react'

interface ClarityProps {
  projectId: string
}

export function Clarity({ projectId }: ClarityProps) {
  useEffect(() => {
    // 使用 clarity npm 包的正确方式
    import('@microsoft/clarity').then((clarity) => {
      clarity.default.init(projectId)
    })
  }, [projectId])

  return null
} 