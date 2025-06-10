"use client"

import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TouchFriendlyButton } from "@/components/ui/touch-friendly-button"
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
      {/* Header - 移动端优化 */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50 safe-area-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 移动端优化 */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-4xl spacing-mobile">
          {/* Title - 响应式文本 */}
          <div className="text-center spacing-mobile">
            <h1 className="text-responsive-xl font-bold text-slate-900 leading-tight">
              {t.subtitle}
            </h1>
            <p className="text-responsive-base text-slate-600 max-w-2xl mx-auto">
              {language === 'zh' 
                ? '输入任何想法、会议记录、项目计划，AI会帮你提取出具体的待办任务'
                : 'Enter any ideas, meeting notes, project plans, and AI will help extract specific todo tasks'
              }
            </p>
          </div>

          {/* Input Area - 移动端优化 */}
          <div className="spacing-mobile">
            <div className="relative">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="min-h-[200px] sm:min-h-[300px] text-base sm:text-lg leading-relaxed resize-none border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg bg-white/80 backdrop-blur-sm"
              />
              
              {/* Character count - 移动端优化位置 */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs sm:text-sm text-slate-400">
                {inputText.length} {language === 'zh' ? '字符' : 'characters'}
              </div>
            </div>

            {/* Action Button - 触摸友好 */}
            <div className="flex justify-center">
              <TouchFriendlyButton
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                size="lg"
                touchSize="large"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t.generateTasks}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </TouchFriendlyButton>
            </div>

            {/* Keyboard shortcut hint - 响应式 */}
            <div className="text-center text-xs sm:text-sm text-slate-500">
              {language === 'zh' 
                ? `按 ${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter 快速生成`
                : `Press ${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to generate quickly`
              }
            </div>
          </div>

          {/* Examples - 移动端网格优化 */}
          <div className="spacing-mobile">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-3 sm:mb-4 flex items-center justify-center gap-2">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                {t.examples.title}
              </h3>
            </div>
            
            {/* 移动端单列，平板及以上多列 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={() => handleExampleClick(t.exampleTexts.meeting)}
                className="card-mobile text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group btn-touch"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                  📝 {t.examples.meeting}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.meeting.substring(0, 80)}...
                </div>
              </button>

              <button
                onClick={() => handleExampleClick(t.exampleTexts.project)}
                className="card-mobile text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group btn-touch"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                  🚀 {t.examples.project}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.project.substring(0, 80)}...
                </div>
              </button>

              <button
                onClick={() => handleExampleClick(t.exampleTexts.daily)}
                className="card-mobile text-left bg-white/60 hover:bg-white/80 border border-slate-200 rounded-xl transition-all duration-200 hover:shadow-md group btn-touch sm:col-span-2 md:col-span-1"
              >
                <div className="font-medium text-slate-700 mb-2 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                  📅 {t.examples.daily}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 line-clamp-3">
                  {t.exampleTexts.daily.substring(0, 80)}...
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - 移动端优化 */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="text-sm sm:text-base font-semibold text-slate-700">{t.title}</div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-right">
              © 2024 Clearflow To-Do. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>}>
      <HomePageContent />
    </Suspense>
  )
}
