"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Plus, X, Globe, Loader2, CheckCircle2, Circle, Brain, Target, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useTasks } from "@/hooks/useTasks"
import { AIReasoningDisplay } from "@/components/AIReasoningDisplay"

const translations = {
  zh: {
    title: "清流待办",
    workspace: "工作台",
    language: "语言",
    tabs: {
      aiAnalysis: "智能分析",
      taskManagement: "任务管理",
    },
    aiAnalysis: {
      title: "AI 智能分析",
      description: "输入您的想法，让 AI 为您提取待办任务",
      inputPlaceholder:
        "在这里输入您的想法、会议记录或任何文字内容...\n\n例如：今天开会讨论了新项目，需要准备方案文档，联系设计师确认UI稿，下周一前完成原型开发，还要记得给客户发邮件确认需求...",
      extractButton: "AI 智能提取",
      processing: "AI 正在分析中...",
      suggestions: "AI 建议任务",
      addToToday: "添加到今日",
      ignore: "忽略",
      noSuggestions: "暂无 AI 建议",
      error: "分析失败，请重试",
    },
    todayTodos: {
      title: "今日待办",
      addManually: "手动添加任务",
      addTask: "添加",
      completed: "已完成",
      pending: "待处理",
      noTodos: "今日暂无待办事项",
      delete: "删除",
    },
    taskManagement: {
      title: "任务管理",
      description: "查看和管理所有任务",
      allTasks: "所有任务",
      filter: {
        all: "全部",
        pending: "待完成",
        completed: "已完成",
        ai: "AI 生成",
        manual: "手动添加",
      },
    },
    stats: {
      title: "任务统计",
      aiSuggestions: "AI 建议",
      totalTasks: "总任务",
      completed: "已完成",
      pending: "待处理",
      completionRate: "完成率",
    },
  },
  en: {
    title: "Clearflow To-Do",
    workspace: "Workspace",
    language: "Language",
    tabs: {
      aiAnalysis: "AI Analysis",
      taskManagement: "Task Management",
    },
    aiAnalysis: {
      title: "AI Smart Analysis",
      description: "Enter your thoughts and let AI extract tasks for you",
      inputPlaceholder:
        "Enter your thoughts, meeting notes, or any text content here...\n\nExample: Had a meeting today about the new project, need to prepare proposal documents, contact designer to confirm UI mockups, complete prototype development by next Monday, and remember to email client to confirm requirements...",
      extractButton: "AI Extract Tasks",
      processing: "AI is analyzing...",
      suggestions: "AI Suggested Tasks",
      addToToday: "Add to Today",
      ignore: "Ignore",
      noSuggestions: "No AI suggestions yet",
      error: "Analysis failed, please try again",
    },
    todayTodos: {
      title: "Today's To-Dos",
      addManually: "Add task manually",
      addTask: "Add",
      completed: "Completed",
      pending: "Pending",
      noTodos: "No to-dos for today",
      delete: "Delete",
    },
    taskManagement: {
      title: "Task Management",
      description: "View and manage all tasks",
      allTasks: "All Tasks",
      filter: {
        all: "All",
        pending: "Pending",
        completed: "Completed",
        ai: "AI Generated",
        manual: "Manual",
      },
    },
    stats: {
      title: "Task Statistics",
      aiSuggestions: "AI Suggestions",
      totalTasks: "Total Tasks",
      completed: "Completed",
      pending: "Pending",
      completionRate: "Completion Rate",
    },
  },
}

export default function WorkspacePage() {
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const [activeTab, setActiveTab] = useState<"analysis" | "management">("analysis")
  const [inputText, setInputText] = useState("")
  const [newTask, setNewTask] = useState("")
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed" | "ai" | "manual">("all")
  const [error, setError] = useState<string>("")

  const {
    tasks,
    aiSuggestions,
    isLoading,
    analysisResult,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    adoptAISuggestion,
    analyzeText,
    extractTasksFromAnalysis,
  } = useTasks()

  const t = translations[language]

  const handleAIExtract = async () => {
    if (!inputText.trim()) return
    
    setError("")
    try {
      await analyzeText(inputText)
    } catch (err) {
      setError(t.aiAnalysis.error)
      console.error("AI analysis error:", err)
    }
  }

  const handleAddManualTask = () => {
    if (!newTask.trim()) return
    
    addTask({
      title: newTask,
      completed: false,
      priority: "medium",
      source: "manual"
    })
    setNewTask("")
  }

  const handleTaskAdopt = (suggestion: any) => {
    adoptAISuggestion(suggestion)
  }

  const handleExtractTasks = () => {
    extractTasksFromAnalysis(analysisResult)
  }

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    switch (taskFilter) {
      case "pending":
        return !task.completed
      case "completed":
        return task.completed
      case "ai":
        return task.source === "ai"
      case "manual":
        return task.source === "manual"
      default:
        return true
    }
  })

  return (
          <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100/50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">{t.title}</h1>
                  <p className="text-sm text-slate-500">{t.workspace}</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 p-6">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "analysis" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "analysis"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("analysis")}
            >
              <Brain className="w-4 h-4 mr-3" />
              {t.tabs.aiAnalysis}
            </Button>
            <Button
              variant={activeTab === "management" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "management"
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveTab("management")}
            >
              <Target className="w-4 h-4 mr-3" />
              {t.tabs.taskManagement}
            </Button>
          </nav>

          {/* Stats Panel */}
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-medium text-slate-900 mb-4">{t.stats.title}</h3>

            <Card className="border-slate-200/60 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">{t.stats.completionRate}</span>
                  <span className="text-lg font-bold text-blue-600">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Card className="border-slate-200/60">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                  <div className="text-xs text-slate-600">{t.stats.completed}</div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-orange-600">{stats.pending}</div>
                  <div className="text-xs text-slate-600">{t.stats.pending}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Card className="border-slate-200/60">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.aiSuggested}</div>
                  <div className="text-xs text-slate-600">{t.stats.aiSuggestions}</div>
                </CardContent>
              </Card>
              <Card className="border-slate-200/60">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.total}</div>
                  <div className="text-xs text-slate-600">{t.stats.totalTasks}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "analysis" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* AI Analysis Section */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-slate-900">
                        <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                        {t.aiAnalysis.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600">{t.aiAnalysis.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder={t.aiAnalysis.inputPlaceholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[200px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                      )}
                      <Button
                        onClick={handleAIExtract}
                        disabled={!inputText.trim() || isLoading}
                        className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium py-3 rounded-xl transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.aiAnalysis.processing}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            {t.aiAnalysis.extractButton}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* AI Reasoning Display */}
                  <AIReasoningDisplay
                    reasoning={analysisResult}
                    isLoading={isLoading}
                    language={language}
                    onExtractTasks={handleExtractTasks}
                    onTaskAdopt={handleTaskAdopt}
                    suggestions={aiSuggestions}
                  />
                </div>

                {/* Today's Todos Section */}
                <div className="space-y-6">
                  <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-slate-900">
                        <span className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                          {t.todayTodos.title}
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {stats.pending} {t.todayTodos.pending}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Manual Add Task */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder={t.todayTodos.addManually}
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddManualTask()}
                          className="flex-1 border-slate-200 focus:border-green-500 focus:ring-green-500/20"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddManualTask}
                          className="bg-green-500 hover:bg-green-600 text-white px-4"
                          disabled={!newTask.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Todo List */}
                      {tasks.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center space-x-3 p-3 bg-slate-50/80 rounded-lg border border-slate-200/60"
                            >
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                              <div className="flex-1">
                                <span
                                  className={`block ${task.completed ? "line-through text-slate-500" : "text-slate-700"}`}
                                >
                                  {task.title}
                                </span>
                                {task.description && (
                                  <span className="text-sm text-slate-500">{task.description}</span>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  {task.source === "ai" && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                      AI
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className={`text-xs ${
                                    task.priority === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                    task.priority === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                    "bg-green-50 text-green-700 border-green-200"
                                  }`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <Circle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <p>{t.todayTodos.noTodos}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "management" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    {t.taskManagement.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">{t.taskManagement.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Task Filters */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(t.taskManagement.filter).map(([key, label]) => (
                      <Button
                        key={key}
                        size="sm"
                        variant={taskFilter === key ? "default" : "outline"}
                        onClick={() => setTaskFilter(key as any)}
                        className={taskFilter === key ? "bg-blue-500 text-white" : ""}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>

                  {/* Task List */}
                  {filteredTasks.length > 0 ? (
                    <div className="space-y-3">
                      {filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-slate-50/80 rounded-lg border border-slate-200/60"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                            <div className="flex-1">
                              <h4 className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className={`text-xs ${
                                  task.priority === "high" ? "bg-red-50 text-red-700 border-red-200" :
                                  task.priority === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                  "bg-green-50 text-green-700 border-green-200"
                                }`}>
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${
                                  task.source === "ai" ? "bg-purple-50 text-purple-700 border-purple-200" :
                                  "bg-blue-50 text-blue-700 border-blue-200"
                                }`}>
                                  {task.source === "ai" ? "AI" : "Manual"}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Target className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === "zh" ? "暂无任务" : "No tasks"}
                      </h3>
                      <p>
                        {language === "zh" ? "开始添加一些任务或使用 AI 分析功能" : "Start adding tasks or use AI analysis"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
