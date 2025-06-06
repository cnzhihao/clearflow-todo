"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Menu, 
  Home, 
  Book, 
  Settings, 
  Code, 
  Brain, 
  Target, 
  Palette,
  Globe,
  Smartphone,
  Monitor,
  ChevronRight,
  ChevronDown,
  Search
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

interface WikiSection {
  id: string
  title: string
  icon: React.ReactNode
  children?: WikiSection[]
}

const wikiStructure: WikiSection[] = [
  {
    id: "overview",
    title: "项目概览",
    icon: <Home className="w-4 h-4" />,
    children: [
      { id: "introduction", title: "应用简介", icon: <Book className="w-4 h-4" /> },
      { id: "features", title: "核心功能", icon: <Target className="w-4 h-4" /> },
      { id: "architecture", title: "技术架构", icon: <Code className="w-4 h-4" /> }
    ]
  },
  {
    id: "user-guide",
    title: "用户指南",
    icon: <Book className="w-4 h-4" />,
    children: [
      { id: "getting-started", title: "快速上手", icon: <Target className="w-4 h-4" /> },
      { id: "ai-analysis", title: "AI智能分析", icon: <Brain className="w-4 h-4" /> },
      { id: "task-management", title: "任务管理", icon: <Settings className="w-4 h-4" /> }
    ]
  },
  {
    id: "features-detail",
    title: "功能详解",
    icon: <Settings className="w-4 h-4" />,
    children: [
      { id: "ai-engine", title: "AI分析引擎", icon: <Brain className="w-4 h-4" /> },
      { id: "task-system", title: "任务系统", icon: <Target className="w-4 h-4" /> },
      { id: "ui-components", title: "UI组件", icon: <Palette className="w-4 h-4" /> },
      { id: "internationalization", title: "国际化", icon: <Globe className="w-4 h-4" /> }
    ]
  },
  {
    id: "technical",
    title: "技术文档",
    icon: <Code className="w-4 h-4" />,
    children: [
      { id: "frontend", title: "前端架构", icon: <Monitor className="w-4 h-4" /> },
      { id: "api", title: "API接口", icon: <Code className="w-4 h-4" /> },
      { id: "components", title: "组件库", icon: <Palette className="w-4 h-4" /> },
      { id: "deployment", title: "部署配置", icon: <Settings className="w-4 h-4" /> }
    ]
  },
  {
    id: "design",
    title: "设计系统",
    icon: <Palette className="w-4 h-4" />,
    children: [
      { id: "colors", title: "色彩体系", icon: <Palette className="w-4 h-4" /> },
      { id: "typography", title: "字体排版", icon: <Book className="w-4 h-4" /> },
      { id: "responsive", title: "响应式设计", icon: <Smartphone className="w-4 h-4" /> }
    ]
  }
]

export default function WikiPage() {
  const [activeSection, setActiveSection] = useState("introduction")
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const SidebarContent = () => (
    <div className="w-full h-full">
      <div className="p-6 border-b border-emerald-200/60">
        <h1 className="text-xl font-bold text-emerald-900">清流待办 Wiki</h1>
        <p className="text-sm text-emerald-600 mt-1">完整功能文档</p>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400" />
          <Input
            placeholder="搜索文档..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-6">
          {wikiStructure.map((section) => (
            <div key={section.id}>
              <Button
                variant="ghost"
                onClick={() => toggleSection(section.id)}
                className="w-full justify-start p-2 h-auto text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
              >
                <div className="flex items-center gap-2 flex-1">
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </div>
                {section.children && (
                  expandedSections.includes(section.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              
              {section.children && expandedSections.includes(section.id) && (
                <div className="ml-6 space-y-1 mt-1">
                  {section.children.map((child) => (
                    <Button
                      key={child.id}
                      variant="ghost"
                      onClick={() => setActiveSection(child.id)}
                      className={`w-full justify-start p-2 h-auto text-left ${
                        activeSection === child.id
                          ? "bg-emerald-100 text-emerald-900 border-l-2 border-emerald-500"
                          : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {child.icon}
                        <span className="text-sm">{child.title}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50/30">
      {/* Header */}
      <header className="border-b border-emerald-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-emerald-900">清流待办</span>
              </Link>
              <Separator orientation="vertical" className="h-6 bg-emerald-200" />
              <span className="text-emerald-700 font-medium">文档中心</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/workspace">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  返回工作台
                </Button>
              </Link>
              
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-emerald-200/60 bg-white/40 backdrop-blur-sm min-h-screen">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-8">
            <WikiContent activeSection={activeSection} />
          </div>
        </main>
      </div>
    </div>
  )
}

function WikiContent({ activeSection }: { activeSection: string }) {
  const contentMap: Record<string, React.ReactNode> = {
    introduction: <IntroductionContent />,
    features: <FeaturesContent />,
    architecture: <ArchitectureContent />,
    "getting-started": <GettingStartedContent />,
    "ai-analysis": <AIAnalysisContent />,
    "task-management": <TaskManagementContent />,
    "ai-engine": <AIEngineContent />,
    "task-system": <TaskSystemContent />,
    "ui-components": <UIComponentsContent />,
    internationalization: <InternationalizationContent />,
    frontend: <FrontendContent />,
    api: <APIContent />,
    components: <ComponentsContent />,
    deployment: <DeploymentContent />,
    colors: <ColorsContent />,
    typography: <TypographyContent />,
    responsive: <ResponsiveContent />
  }

  return contentMap[activeSection] || <IntroductionContent />
}

import {
  IntroductionContent,
  FeaturesContent,
  ArchitectureContent
} from "./content"

import {
  GettingStartedContent,
  AIAnalysisContent,
  TaskManagementContent,
  AIEngineContent,
  TaskSystemContent,
  UIComponentsContent,
  InternationalizationContent,
  FrontendContent,
  APIContent,
  ComponentsContent,
  DeploymentContent,
  ColorsContent,
  TypographyContent,
  ResponsiveContent
} from "./additional-content" 