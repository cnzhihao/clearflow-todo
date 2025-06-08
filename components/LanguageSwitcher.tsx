"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
}

const translations = {
  zh: { language: "语言" },
  en: { language: "Language" }
}

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = translations[currentLanguage]

  const setLanguage = (lang: "zh" | "en") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("lang", lang)
    
    // 获取当前路径
    const currentPath = window.location.pathname
    router.push(`${currentPath}?${params.toString()}`)
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