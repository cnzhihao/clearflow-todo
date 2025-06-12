"use client"

import React, { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TouchFriendlyButton } from "@/components/ui/touch-friendly-button"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputButton } from "@/components/ui/voice-input-button"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useDynamicTitle } from "@/hooks/use-dynamic-title"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
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
    subtitle: "今天做什么？",
    description: "告诉我你今天想做什么，智能AI助理帮你生成待办清单",
    placeholder: "例如：今天要开晨会、整理项目文档、联系设计师确认UI稿、下午2点开技术评审...\n\n或者：\n- 上午完成周报\n- 准备明天的客户演示\n- 联系供应商确认交期\n- 整理这周的会议记录\n\n无论是模糊的想法还是具体的计划，我都能帮你整理成清晰的待办事项。\n\n💡 提示：点击右下角的麦克风图标可以使用语音输入！",
    analyzing: "AI正在分析中...",
    generateTasks: "生成我的待办清单",
    voiceInput: {
      tooltip: "点击开始语音输入",
      listening: "正在聆听...",
      notSupported: "您的浏览器不支持语音识别",
      permissionDenied: "请允许使用麦克风权限",
      networkError: "网络错误，请检查网络连接",
      noSpeech: "未检测到语音，请重试",
      audioCapture: "音频捕获失败",
      error: "语音识别出错"
    },
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
    subtitle: "What to do today?",
    description: "Tell me what you want to do today, I'll help you generate a todo list",
    placeholder: "For example: Today I need to attend morning standup, organize project docs, contact designer for UI confirmation, technical review at 2pm...\n\nOr:\n- Finish weekly report in the morning\n- Prepare demo for tomorrow's client meeting\n- Contact supplier about delivery schedule\n- Organize this week's meeting notes\n\nWhether it's vague ideas or specific plans, I can help organize them into clear todo items.\n\n💡 Tip: Click the microphone icon in the bottom right to use voice input!",
    analyzing: "AI is analyzing...",
    generateTasks: "Generate My Todo List",
    voiceInput: {
      tooltip: "Click to start voice input",
      listening: "Listening...",
      notSupported: "Speech recognition not supported in your browser",
      permissionDenied: "Microphone permission denied",
      networkError: "Network error, please check connection",
      noSpeech: "No speech detected, please try again",
      audioCapture: "Audio capture failed",
      error: "Speech recognition error"
    },
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

  // 语音识别功能
  const {
    isSupported: voiceSupported,
    isListening,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    language: language === 'zh' ? 'zh-CN' : 'en-US',
    continuous: false,
    interimResults: false
  })

  // 初始化语言设置 - 完全基于localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as "zh" | "en" | null
      const currentLang = savedLang || "en"
      setLanguage(currentLang)
    }
  }, [])

  // 处理语音识别结果 - 追加而不是替换
  React.useEffect(() => {
    if (transcript) {
      setInputText(prev => {
        // 如果已有内容，追加新内容
        const separator = prev.trim() ? '' : ''
        return prev + separator + transcript
      })
      resetTranscript()
    }
  }, [transcript, resetTranscript])

  // 动态设置网页标题
  useDynamicTitle(language, {
    zh: "清流待办 - AI 驱动的智能任务管理",
    en: "Clearflow To-Do - AI-Powered Smart Task Management"
  })

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

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  // 获取本地化的错误消息
  const getLocalizedErrorMessage = (error: string) => {
    if (error.includes('not-allowed') || error.includes('permission denied')) {
      return t.voiceInput.permissionDenied
    } else if (error.includes('no-speech')) {
      return t.voiceInput.noSpeech
    } else if (error.includes('network')) {
      return t.voiceInput.networkError
    } else if (error.includes('audio-capture')) {
      return t.voiceInput.audioCapture
    } else {
      return t.voiceInput.error
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
              {t.description}
            </p>
          </div>

          {/* Input Area - 移动端优化 */}
          <div className="spacing-mobile">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="min-h-[200px] sm:min-h-[300px] text-base sm:text-lg leading-relaxed resize-none border-0 bg-transparent p-4 sm:p-6 rounded-xl sm:rounded-2xl focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              
              {/* Bottom controls bar */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-t border-slate-100">
                {/* Character count */}
                <div className="text-xs sm:text-sm text-slate-400">
                  {inputText.length} {language === 'zh' ? '字符' : 'characters'}
                </div>
                
                {/* Voice Input Button */}
                <VoiceInputButton
                  isListening={isListening}
                  isSupported={voiceSupported}
                  onToggle={handleVoiceToggle}
                  className=""
                />
              </div>
            </div>

            {/* Voice Input Status and Error Messages */}
            {isListening && (
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {t.voiceInput.listening}
              </div>
            )}
            
            {voiceError && (
              <div className="text-sm text-red-500 mt-2 text-center">
                {getLocalizedErrorMessage(voiceError)}
              </div>
            )}
            
            {!voiceSupported && (
              <div className="text-sm text-amber-600 mt-2 text-center">
                {t.voiceInput.notSupported}
              </div>
            )}

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
