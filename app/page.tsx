"use client"

import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import {
  Sparkles,
  Brain,
  Loader2,
  ArrowRight,
  Lightbulb,
} from "lucide-react"

const translations = {
  zh: {
    title: "清流待办",
    subtitle: "描述你的想法，让AI为你规划任务",
    placeholder: "例如：今天开会讨论了新项目，需要准备方案文档，联系设计师确认UI稿，下周一前完成原型开发...\n\n或者：\n- 明天要给客户做产品演示\n- 需要准备PPT和演示数据\n- 联系技术团队确认功能状态\n- 预约会议室\n\n输入任何想法、会议记录、项目计划，AI会帮你提取出具体的待办任务。",
    analyzing: "AI正在分析中...",
    generateTasks: "生成任务规划",
    examples: {
      title: "试试这些示例：",
      meeting: "会议记录分析",
      project: "项目规划整理", 
      daily: "日常事务安排"
    },
    exampleTexts: {
      meeting: "今天的产品会议确定了几个关键事项：UI设计需要在下周三前完成，后端API开发要配合前端进度，测试环境需要尽快搭建，还要安排用户访谈收集反馈。",
      project: "新产品发布准备：完成市场调研报告，制作产品宣传视频，培训销售团队，建立客户服务流程，准备发布会演示。",
      daily: "明天的安排：上午9点开晨会，10点半与客户电话沟通需求，下午2点参加技术评审，4点前要完成周报，晚上准备明天的演示材料。"
    }
  },
  en: {
    title: "Clearflow To-Do",
    subtitle: "Describe your ideas, let AI plan your tasks",
    placeholder: "For example: Today's meeting discussed the new project, need to prepare proposal documents, contact designers to confirm UI drafts, complete prototype development by next Monday...\n\nOr:\n- Tomorrow need to demo product to client\n- Need to prepare PPT and demo data\n- Contact tech team to confirm feature status\n- Book meeting room\n\nEnter any ideas, meeting notes, project plans, and AI will help extract specific todo tasks.",
    analyzing: "AI is analyzing...",
    generateTasks: "Generate Task Plan",
    examples: {
      title: "Try these examples:",
      meeting: "Meeting Notes Analysis",
      project: "Project Planning",
      daily: "Daily Task Organization"
    },
    exampleTexts: {
      meeting: "Today's product meeting determined several key items: UI design needs to be completed by next Wednesday, backend API development should coordinate with frontend progress, test environment needs to be set up ASAP, and user interviews need to be arranged to collect feedback.",
      project: "New product launch preparation: complete market research report, create product promotional video, train sales team, establish customer service process, prepare launch demo.",
      daily: "Tomorrow's schedule: 9am morning meeting, 10:30am phone call with client about requirements, 2pm technical review, complete weekly report by 4pm, prepare demo materials for tomorrow evening."
    }
  },
}

function HomePageContent() {
  const router = useRouter()
  const [language, setLanguage] = useState<"zh" | "en">("en")
  const [inputText, setInputText] = useState("")

  // 初始化语言设置 - 完全基于localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as "zh" | "en" | null
      const currentLang = savedLang || "en"
      setLanguage(currentLang)
    }
  }, [])

  const t = translations[language]

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    
    // 直接跳转到planning页面，传递输入文本（移除lang参数）
    const planningData = {
      inputText,
      timestamp: Date.now()
    }
    
    router.push(`/planning?data=${encodeURIComponent(JSON.stringify(planningData))}`)
  }

  const handleLanguageChange = (lang: "zh" | "en") => {
    setLanguage(lang)
  }

  const handleExampleClick = (exampleText: string) => {
    setInputText(exampleText)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleAnalyze()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-2.5xl md:text-5xl font-bold text-slate-900 leading-tight whitespace-nowrap">
              {t.subtitle}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {language === 'zh' 
                ? '输入任何想法、会议记录、项目计划，AI会帮你提取出具体的待办任务'
                : 'Enter any ideas, meeting notes, project plans, and AI will help extract specific todo tasks'
              }
            </p>
          </div>

          {/* Input Area */}
          <div className="space-y-6">
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="min-h-[300px] text-lg leading-relaxed resize-none border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl p-6 shadow-lg bg-white/80 backdrop-blur-sm"
              />
              
              {/* Character count */}
              <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                {inputText.length} {language === 'zh' ? '字符' : 'characters'}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Brain className="w-5 h-5 mr-2" />
                {t.generateTasks}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="text-center text-sm text-slate-500">
              {language === 'zh' 
                ? `按 ${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter 快速生成`
                : `Press ${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to generate quickly`
              }
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                {t.examples.title}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => handleExampleClick(t.exampleTexts.meeting)}
                className="p-4 text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors">
                  📝 {t.examples.meeting}
                </div>
                <div className="text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.meeting.substring(0, 80)}...
                </div>
              </button>

              <button
                onClick={() => handleExampleClick(t.exampleTexts.project)}
                className="p-4 text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors">
                  🚀 {t.examples.project}
                </div>
                <div className="text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.project.substring(0, 80)}...
                </div>
              </button>

              <button
                onClick={() => handleExampleClick(t.exampleTexts.daily)}
                className="p-4 text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors">
                  📅 {t.examples.daily}
                </div>
                <div className="text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.daily.substring(0, 80)}...
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200/60 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-700">{t.title}</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Clearflow To-Do. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-slate-600">加载中...</span>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
