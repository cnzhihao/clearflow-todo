import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import {
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react"

const translations = {
      zh: {
    title: "清流待办",
    subtitle: "AI 驱动的智能任务管理",
    description: "让 AI 帮您从复杂的想法中提取清晰的待办事项，告别繁琐的任务整理过程",
    getStarted: "开始使用",
    learnMore: "了解更多",
    language: "语言",
    badge: "AI 驱动的智能工具",
    featuresSubtitle: "让 AI 成为您的智能助手",
    workflowSubtitle: "三步完成智能任务管理",
    features: {
      title: "核心功能",
      aiExtract: {
        title: "智能任务提取",
        description: "输入大段文字，AI 自动识别并提取可执行的待办任务",
      },
      smartAnalysis: {
        title: "智能分析建议",
        description: "AI 分析任务复杂度，提供分解建议和优先级排序",
      },
      progressTracking: {
        title: "进度可视化",
        description: "清晰的任务统计和完成进度，让工作状态一目了然",
      },
    },
    workflow: {
      title: "工作流程",
      step1: {
        title: "输入想法",
        description: "将会议记录、灵感笔记或任何文字内容输入到系统中",
      },
      step2: {
        title: "AI 分析",
        description: "AI 智能识别文本中的任务项，并提供分解建议",
      },
      step3: {
        title: "确认管理",
        description: "审核 AI 建议，添加到待办清单并跟踪完成进度",
      },
    },
    cta: {
      title: "准备好提升您的工作效率了吗？",
      description: "立即开始使用清流待办，体验 AI 驱动的智能任务管理",
      button: "免费开始使用",
    },
  },
  en: {
    title: "Clearflow To-Do",
    subtitle: "AI-Powered Smart Task Management",
    description: "Let AI help you extract clear to-dos from complex thoughts and eliminate tedious task organization",
    getStarted: "Get Started",
    learnMore: "Learn More",
    language: "Language",
    badge: "AI-Powered Smart Tool",
    featuresSubtitle: "Let AI become your smart assistant",
    workflowSubtitle: "Complete smart task management in three steps",
    features: {
      title: "Core Features",
      aiExtract: {
        title: "Smart Task Extraction",
        description: "Input large text blocks, AI automatically identifies and extracts actionable tasks",
      },
      smartAnalysis: {
        title: "Intelligent Analysis",
        description: "AI analyzes task complexity, provides breakdown suggestions and priority sorting",
      },
      progressTracking: {
        title: "Progress Visualization",
        description: "Clear task statistics and completion progress for better work visibility",
      },
    },
    workflow: {
      title: "Workflow",
      step1: {
        title: "Input Ideas",
        description: "Enter meeting notes, inspiration notes, or any text content into the system",
      },
      step2: {
        title: "AI Analysis",
        description: "AI intelligently identifies tasks in text and provides breakdown suggestions",
      },
      step3: {
        title: "Confirm & Manage",
        description: "Review AI suggestions, add to todo list and track completion progress",
      },
    },
    cta: {
      title: "Ready to boost your productivity?",
      description: "Start using Clearflow To-Do now and experience AI-driven smart task management",
      button: "Start Free",
    },
  },
}

interface HomePageProps {
  searchParams: { lang?: string }
}

export default function HomePage({ searchParams }: HomePageProps) {
  const language = (searchParams.lang === "en" ? "en" : "zh") as "zh" | "en"
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100/50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher currentLanguage={language} />

              <Link href="/workspace">
                <Button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white">
                  {t.getStarted}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-sky-100 text-sky-700 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {t.badge}
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">{t.subtitle}</h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/workspace">
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-4 text-lg"
              >
                {t.getStarted}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-slate-300 hover:bg-slate-50">
              {t.learnMore}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.features.title}</h2>
            <p className="text-xl text-slate-600">{t.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.aiExtract.title}</h3>
                <p className="text-slate-600 leading-relaxed">{t.features.aiExtract.description}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.smartAnalysis.title}</h3>
                <p className="text-slate-600 leading-relaxed">{t.features.smartAnalysis.description}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.features.progressTracking.title}</h3>
                <p className="text-slate-600 leading-relaxed">{t.features.progressTracking.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.workflow.title}</h2>
            <p className="text-xl text-slate-600">{t.workflowSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.workflow.step1.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.workflow.step1.description}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.workflow.step2.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.workflow.step2.description}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-sky-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{t.workflow.step3.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.workflow.step3.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-sky-500 to-sky-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t.cta.title}</h2>
                      <p className="text-xl text-sky-100 mb-8 leading-relaxed">{t.cta.description}</p>
          <Link href="/workspace">
                          <Button size="lg" className="bg-white text-sky-600 hover:bg-sky-50 px-8 py-4 text-lg font-semibold">
                {t.cta.button}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">{t.title}</h3>
          </div>
          <p className="text-slate-400">© 2024 Clearflow To-Do. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
