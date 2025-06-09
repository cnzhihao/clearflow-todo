"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  currentLanguage: "zh" | "en"
  onLanguageChange?: (lang: "zh" | "en") => void
}

const translations = {
  zh: { language: "语言" },
  en: { language: "Language" }
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const t = translations[currentLanguage]

  const setLanguage = (lang: "zh" | "en") => {
    // 保存到 localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang)
    }
    
    // 调用回调函数通知父组件
    if (onLanguageChange) {
      onLanguageChange(lang)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-600">
          <Globe className="w-4 h-4 mr-2" />
          {t.language}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("zh")}>中文</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 