import { useEffect } from 'react'

interface TitleConfig {
  zh: string
  en: string
}

export function useDynamicTitle(language: "zh" | "en", titleConfig: TitleConfig) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = titleConfig[language]
    }
  }, [language, titleConfig])
} 