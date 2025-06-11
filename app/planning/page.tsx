"use client"

import React, { useState, useEffect, Suspense, useCallback, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TouchFriendlyButton } from "@/components/ui/touch-friendly-button"
import { MobileTabSwitcher } from "@/components/ui/mobile-tab-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useDynamicTitle } from "@/hooks/use-dynamic-title"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Edit3,
  Trash2,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  Copy,
  Send,
  User,
  Bot,
  Download,
  MessageCircle,
  ListTodo,
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  category?: string
  deadline?: string
  completed: boolean
  source: 'ai' | 'manual'
}

interface TaskCard {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  deadline?: string
  category: string
  completed: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
  
  // JSON解析相关
  hasJson?: boolean
  jsonTasks?: ExtractableTask[]
  isProcessingJson?: boolean
  extractedTasks?: ExtractableTask[]
  // 新增：解析状态
  jsonParsingStatus?: 'detecting' | 'parsing' | 'completed' | 'error'
  taskCount?: number
}

interface ExtractableTask {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  deadline?: string
  category: string
  completed: boolean
}

// 移除流式解析状态接口，因为已改为非流式处理

const translations = {
  zh: {
    title: "AI任务规划",
    backToHome: "返回首页",
    chatTitle: "AI助手对话",
    tasksTitle: "提取的任务",
    noTasksFound: "暂无任务，与AI对话开始规划吧！",
    chatPlaceholder: "描述你的想法，或者询问如何优化任务...",
    sendMessage: "发送",
    thinking: "AI正在思考...",
    editTask: "编辑任务",
    deleteTask: "删除任务",
    taskTitle: "任务标题",
    taskDescription: "任务描述",
    priority: "优先级",
    category: "分类",
    deadline: "截止时间",
    high: "高",
    medium: "中",
    low: "低",
    save: "保存",
    cancel: "取消",
    createManualTask: "手动创建任务",
    copyToMarkdown: "复制Markdown",
    copySuccess: "已复制!",
    copyToNotion: "复制到Notion/飞书",
    streamingInProgress: "流式生成中...",
    copyTextFormat: "复制文本格式",
    copyTableFormat: "复制表格格式",
    copyTextSuccess: "已完成复制！现在你可以把它粘贴到你的 Notion 或飞书文档里了！",
    copyTableSuccess: "已完成复制！现在你可以把它粘贴到你的 Notion 或飞书多维表格里了！",
    deadlinePlaceholder: "选择截止时间",
    planGenerating: "计划生成中...",
    planCompleted: "已完成读取，共 {count} 个任务",
    extractTask: "提取",
    extractAllTasks: "提取所有任务",
    taskCard: "任务卡片",
    // 新增移动端文案
    chatTab: "对话",
    tasksTab: "任务",
  },
  en: {
    title: "AI Task Planning",
    backToHome: "Back to Home",
    chatTitle: "AI Assistant Chat",
    tasksTitle: "Extracted Tasks",
    noTasksFound: "No tasks yet, start chatting with AI to plan!",
    chatPlaceholder: "Describe your ideas, or ask how to optimize tasks...",
    sendMessage: "Send",
    thinking: "AI is thinking...",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    taskTitle: "Task Title",
    taskDescription: "Task Description",
    priority: "Priority",
    category: "Category",
    deadline: "Deadline",
    high: "High",
    medium: "Medium",
    low: "Low",
    save: "Save",
    cancel: "Cancel",
    createManualTask: "Create Manual Task",
    copyToMarkdown: "Copy Markdown",
    copySuccess: "Copied!",
    copyToNotion: "Copy to Notion/Feishu",
    streamingInProgress: "Streaming in progress...",
    copyTextFormat: "Copy Text Format",
    copyTableFormat: "Copy Table Format",
    copyTextSuccess: "Copy completed! You can now paste it into your Notion or Feishu documents!",
    copyTableSuccess: "Copy completed! You can now paste it into your Notion or Feishu multi-dimensional tables!",
    deadlinePlaceholder: "Select deadline",
    planGenerating: "Plan generating...",
    planCompleted: "Completed reading, {count} tasks found",
    extractTask: "Extract",
    extractAllTasks: "Extract All Tasks",
    taskCard: "Task Card",
    // 新增移动端文案
    chatTab: "Chat",
    tasksTab: "Tasks",
  },
}

// 预定义的样式对象，避免内联对象创建
const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
} as const

const PRIORITY_COLORS_BADGE = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200'
} as const

// 预定义的图标组件，避免重复创建
const PRIORITY_ICONS = {
  high: <AlertCircle className="w-4 h-4" />,
  medium: <Clock className="w-4 h-4" />,
  low: <CheckCircle2 className="w-4 h-4" />,
  default: <CheckCircle2 className="w-4 h-4" />
} as const

// 使用 React.memo 优化 TaskCard 组件
const TaskCard = React.memo(function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  language 
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  language: "zh" | "en"
}) {
  const t = translations[language]
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  // 使用 useCallback 缓存事件处理函数
  const handleSave = useCallback(() => {
    onEdit(editedTask)
    setIsEditing(false)
  }, [editedTask, onEdit])

  const handleCancel = useCallback(() => {
    setEditedTask(task)
    setIsEditing(false)
  }, [task])

  const handleDelete = useCallback(() => {
    if (confirm(language === 'zh' ? '确定要删除这个任务吗？' : 'Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }, [onDelete, task.id, language])

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t.editTask}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">{t.taskTitle}</label>
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1"
              placeholder={t.taskTitle}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700">{t.taskDescription}</label>
            <Textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 min-h-[80px] resize-none"
              placeholder={t.taskDescription}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">{t.priority}</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">{t.category}</label>
              <Input
                value={editedTask.category || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1"
                placeholder={t.category}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">{t.deadline}</label>
              <Input
                type="date"
                value={editedTask.deadline || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, deadline: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {t.save}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              {t.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full group hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-slate-900 leading-tight break-words">
              {task.title}
            </CardTitle>
            {task.description && (
              <p className="text-slate-600 text-sm mt-2 leading-relaxed break-words whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </div>
          
          {/* 桌面端：右上角操作按钮 */}
          <div className="hidden sm:flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={t.editTask}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title={t.deleteTask}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant="secondary" 
            className={`${PRIORITY_COLORS_BADGE[task.priority]} flex items-center gap-1`}
          >
            {PRIORITY_ICONS[task.priority]}
            <span>{t[task.priority]}</span>
          </Badge>
          
          {task.category && (
            <Badge variant="outline" className="text-slate-600">
              {task.category}
            </Badge>
          )}
          
          {task.deadline && (
            <Badge variant="outline" className="text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(task.deadline).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
            </Badge>
          )}
          
          <Badge variant="outline" className="text-slate-500">
            {task.source === 'ai' ? 'AI' : (language === 'zh' ? '手动' : 'Manual')}
          </Badge>
        </div>
        
        {/* 移动端：底部操作按钮 */}
        <div className="sm:hidden flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {t.editTask}
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            {t.deleteTask}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

// 新增：任务卡片组件（用于AI生成的可提取任务）
const TaskCardComponent = React.memo(function TaskCardComponent({
  task,
  onExtract,
  language
}: {
  task: TaskCard
  onExtract: (task: TaskCard) => void
  language: "zh" | "en"
}) {
  const t = translations[language]

  const handleExtract = useCallback(() => {
    onExtract(task)
  }, [task, onExtract])

  return (
    <Card className="w-full group hover:shadow-md transition-all duration-200 border-emerald-200 hover:border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-slate-900 leading-tight break-words">
              {task.title}
            </CardTitle>
            {task.description && (
              <p className="text-slate-600 text-sm mt-2 leading-relaxed break-words whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </div>
          
          <Button
            onClick={handleExtract}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex-shrink-0 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t.extractTask}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className={`${PRIORITY_COLORS_BADGE[task.priority]} flex items-center gap-1`}
          >
            {PRIORITY_ICONS[task.priority]}
            <span>{t[task.priority]}</span>
          </Badge>
          
          {task.category && (
            <Badge variant="outline" className="text-slate-600 border-slate-300">
              {task.category}
            </Badge>
          )}
          
          {task.deadline && (
            <Badge variant="outline" className="text-slate-600 border-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(task.deadline).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}
            </Badge>
          )}
          
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
            AI {language === 'zh' ? '生成' : 'Generated'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
})

// 使用 React.memo 优化 ChatMessage 组件
const ChatMessage = React.memo(function ChatMessage({ 
  message, 
  language, 
  onExtractTasks,
  onExtractSingleTask
}: { 
  message: ChatMessage; 
  language: "zh" | "en";
  onExtractTasks: (tasks: ExtractableTask[]) => void;
  onExtractSingleTask: (task: TaskCard) => void;
}) {
  const isUser = message.role === 'user'
  const t = translations[language]

  const handleExtractAllTasks = useCallback(() => {
    if (message.extractedTasks && message.extractedTasks.length > 0) {
      onExtractTasks(message.extractedTasks)
    }
  }, [message.extractedTasks, onExtractTasks])

  const handleExtractSingleTask = useCallback((task: TaskCard) => {
    onExtractSingleTask(task)
  }, [onExtractSingleTask])

  // 格式化计划完成状态消息
  const formatPlanCompletedMessage = useCallback((count: number) => {
    return t.planCompleted.replace('{count}', count.toString())
  }, [t.planCompleted])

  // 过滤掉JSON内容的显示文本 - 修改逻辑，在流式生成过程中就隐藏JSON
  const getDisplayContent = useCallback((content: string, isStreaming: boolean = false) => {
    // 如果是流式生成中，检测到JSON开始标记后就截断显示
    if (isStreaming) {
      // 检测markdown JSON代码块开始标记
      const jsonCodeBlockIndex = content.indexOf('```json')
      if (jsonCodeBlockIndex !== -1) {
        // 截取到```json之前的内容
        return content.substring(0, jsonCodeBlockIndex).trim()
      }
      
      // 检测裸露JSON数组开始标记
      const jsonArrayIndex = content.indexOf('[')
      if (jsonArrayIndex !== -1) {
        // 检查是否真的是JSON数组（包含{字符）
        const afterBracket = content.substring(jsonArrayIndex)
        if (afterBracket.includes('{')) {
          // 截取到[之前的内容
          return content.substring(0, jsonArrayIndex).trim()
        }
      }
      
      // 如果没有检测到JSON标记，返回完整内容
      return content
    }
    
    // 如果不是流式生成（已完成），移除所有JSON内容
    let cleanContent = content
    // 移除markdown格式的JSON代码块
    cleanContent = cleanContent.replace(/```json\s*[\s\S]*?\s*```/g, '')
    // 移除裸露的JSON数组
    cleanContent = cleanContent.replace(/\[\s*\{[\s\S]*?\}\s*\]/g, '')
    // 移除多余的空行
    cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n')
    return cleanContent.trim()
  }, [])

  if (isUser) {
    return (
      <div className="flex items-start space-x-2 mb-4 justify-end">
        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%] order-2">
          <p>{message.content}</p>
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 order-3">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    )
  }

  // AI 消息显示
  return (
    <div className="flex items-start space-x-2 mb-4">
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-50 rounded-lg p-3">
          {/* 始终显示文本内容，但在流式生成时截断JSON，完成后过滤JSON */}
          {message.content && getDisplayContent(message.content, message.isStreaming) && (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>
                {getDisplayContent(message.content, message.isStreaming)}
              </ReactMarkdown>
            </div>
          )}

          {/* JSON解析状态指示器 */}
          {(message.jsonParsingStatus === 'detecting' || message.jsonParsingStatus === 'parsing') && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.planGenerating}</span>
              </div>
            </div>
          )}

          {message.jsonParsingStatus === 'completed' && message.taskCount && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-green-600 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>{formatPlanCompletedMessage(message.taskCount)}</span>
              </div>
            </div>
          )}

          {/* 任务卡片网格 */}
          {message.extractedTasks && message.extractedTasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-3 mb-4">
                {message.extractedTasks.map((task) => (
                  <TaskCardComponent
                    key={task.id}
                    task={task as TaskCard}
                    onExtract={handleExtractSingleTask}
                    language={language}
                  />
                ))}
              </div>
              
              {/* 提取所有任务按钮 */}
              <Button
                onClick={handleExtractAllTasks}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium h-auto min-h-[44px] px-4 py-2 touch-manipulation"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>{t.extractAllTasks}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

function PlanningPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<"zh" | "en">("en") // 确保默认为英文
  const [tasks, setTasks] = useState<Task[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [copySuccessMessage, setCopySuccessMessage] = useState("")
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false) // 新增：语言初始化完成标记
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat') // 新增：移动端标签状态

  // 初始化语言设置 - 完全基于localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language') as "zh" | "en" | null
      const currentLang = savedLang || "en"
      console.log('🌍 正在初始化语言设置:', currentLang) // 添加调试日志
      setLanguage(currentLang)
      setIsLanguageInitialized(true) // 标记语言初始化完成
    }
  }, [])

  // 动态设置网页标题
  useDynamicTitle(language, {
    zh: "任务规划 - 清流待办",
    en: "Task Planning - Clearflow To-Do"
  })

  const t = translations[language]

  // 语言变化处理函数
  const handleLanguageChange = useCallback((lang: "zh" | "en") => {
    setLanguage(lang)
  }, [])

  // 使用 useCallback 缓存所有回调函数，避免子组件不必要的重新渲染
  const extractTasks = useCallback((jsonTasks: ExtractableTask[]) => {
    const newTasks: Task[] = jsonTasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      source: 'ai' as const
    }))
    setTasks(prev => [...prev, ...newTasks])
  }, [])

  // 新增：提取单个任务
  const extractSingleTask = useCallback((taskCard: TaskCard) => {
    const newTask: Task = {
      ...taskCard,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      source: 'ai' as const
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const handleEditTask = useCallback((editedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === editedTask.id ? editedTask : task
    ))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  const toggleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }, [])

  const getPriorityColor = useCallback((priority: string) => {
    return PRIORITY_COLORS_BADGE[priority as keyof typeof PRIORITY_COLORS_BADGE] || PRIORITY_COLORS_BADGE.default
  }, [])

  const getPriorityIcon = useCallback((priority: string) => {
    return PRIORITY_ICONS[priority as keyof typeof PRIORITY_ICONS] || PRIORITY_ICONS.default
  }, [])

  const addManualTask = useCallback(() => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: language === 'zh' ? "新任务" : "New Task",
      description: "",
      priority: "medium",
      category: language === 'zh' ? "手动" : "Manual",
      deadline: "",
      completed: false,
      source: 'manual'
    }
    setTasks(prev => [...prev, newTask])
  }, [language])

  // 处理流式响应
  const sendMessage = useCallback(async (message?: string) => {
    const messageText = message || inputMessage.trim()
    if (!messageText || isLoading) return

    // 添加调试日志
    console.log('🔍 发送消息时的语言设置:', language)

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // 构建对话历史
    const conversationHistory = [...chatMessages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inputText: messageText,
          conversationHistory,
          existingTasks: tasks,
          language: language
        }),
      })

      console.log('📤 API请求参数 - language:', language)

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      // 创建AI消息
      let aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
        hasJson: false,
        extractedTasks: [],
        jsonParsingStatus: undefined,
        taskCount: 0
      }

      setChatMessages(prev => [...prev, aiMessage])

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      let fullContent = ''
      let hasDetectedJsonStart = false
      let hasDetectedJsonEnd = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.content || ''
              
              if (!content) continue

              fullContent += content

              // 检测JSON开始
              if (!hasDetectedJsonStart && (fullContent.includes('```json') || fullContent.includes('['))) {
                hasDetectedJsonStart = true
                setChatMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, jsonParsingStatus: 'detecting' }
                    : msg
                ))
              }

              // 检查JSON处理状态
              let isProcessingJson = false
              let extractedTasks: ExtractableTask[] = []
              let hasJson = false
              let jsonParsingStatus: 'detecting' | 'parsing' | 'completed' | 'error' | undefined = undefined
              let taskCount = 0

              // 方法1：检查markdown JSON代码块
              let jsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/)
              if (jsonMatch) {
                hasJson = true
                try {
                  const parsedTasks = JSON.parse(jsonMatch[1].trim())
                  if (Array.isArray(parsedTasks)) {
                    extractedTasks = parsedTasks.map((task: any) => ({
                      ...task,
                      id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      completed: false,
                      source: 'ai' as const
                    }))
                    isProcessingJson = false
                    jsonParsingStatus = 'completed'
                    taskCount = extractedTasks.length
                    hasDetectedJsonEnd = true
                  }
                } catch (e) {
                  isProcessingJson = true
                  jsonParsingStatus = 'parsing'
                }
              } 
              // 方法2：检查裸露的JSON数组（以 [ 开头，以 ] 结尾）
              else {
                const arrayMatch = fullContent.match(/\[\s*\{[\s\S]*?\}\s*\]/)
                if (arrayMatch) {
                  hasJson = true
                  try {
                    const parsedTasks = JSON.parse(arrayMatch[0])
                    if (Array.isArray(parsedTasks)) {
                      extractedTasks = parsedTasks.map((task: any) => ({
                        ...task,
                        id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        completed: false,
                        source: 'ai' as const
                      }))
                      isProcessingJson = false
                      jsonParsingStatus = 'completed'
                      taskCount = extractedTasks.length
                      hasDetectedJsonEnd = true
                    }
                  } catch (e) {
                    // 如果包含 [ 但解析失败，说明JSON还没完整
                    if (fullContent.includes('[') && fullContent.includes('{')) {
                      isProcessingJson = true
                      jsonParsingStatus = 'parsing'
                      hasJson = true
                    }
                  }
                }
                // 方法3：检查是否正在生成JSON（包含开始标记但还没结束）
                else if (hasDetectedJsonStart && !hasDetectedJsonEnd) {
                  if (fullContent.includes('```json') || (fullContent.includes('[') && fullContent.includes('{'))) {
                    isProcessingJson = true
                    hasJson = true
                    jsonParsingStatus = 'parsing'
                  }
                }
              }

              // 如果检测到JSON开始但没有其他状态，设置为检测中
              if (hasDetectedJsonStart && !jsonParsingStatus) {
                jsonParsingStatus = 'detecting'
              }

              // 实时更新内容
              setChatMessages(prev => prev.map(msg => 
                msg.id === aiMessage.id 
                  ? { 
                      ...msg, 
                      content: fullContent,
                      hasJson,
                      isProcessingJson,
                      extractedTasks,
                      jsonParsingStatus,
                      taskCount
                    }
                  : msg
              ))

            } catch (error) {
              console.error('解析流式数据失败:', error)
            }
          }
        }
      }

      // 最终状态更新 - 需要保留JSON解析结果
      let finalExtractedTasks: ExtractableTask[] = []
      let finalHasJson = false
      let finalJsonParsingStatus: 'detecting' | 'parsing' | 'completed' | 'error' | undefined = undefined
      let finalTaskCount = 0
      
      // 再次进行最终的JSON检测
      const finalJsonMatch = fullContent.match(/```json\s*([\s\S]*?)\s*```/)
      if (finalJsonMatch) {
        finalHasJson = true
        try {
          const parsedTasks = JSON.parse(finalJsonMatch[1].trim())
          if (Array.isArray(parsedTasks)) {
            finalExtractedTasks = parsedTasks.map((task: any) => ({
              ...task,
              id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
              completed: false,
              source: 'ai' as const
            }))
            finalJsonParsingStatus = 'completed'
            finalTaskCount = finalExtractedTasks.length
          }
        } catch (e) {
          console.error('最终JSON解析失败:', e)
          finalJsonParsingStatus = 'error'
        }
      } else {
        // 检查裸露JSON
        const finalArrayMatch = fullContent.match(/\[\s*\{[\s\S]*?\}\s*\]/)
        if (finalArrayMatch) {
          finalHasJson = true
          try {
            const parsedTasks = JSON.parse(finalArrayMatch[0])
            if (Array.isArray(parsedTasks)) {
              finalExtractedTasks = parsedTasks.map((task: any) => ({
                ...task,
                id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                completed: false,
                source: 'ai' as const
              }))
              finalJsonParsingStatus = 'completed'
              finalTaskCount = finalExtractedTasks.length
            }
          } catch (e) {
            console.error('最终裸露JSON解析失败:', e)
            finalJsonParsingStatus = 'error'
          }
        }
      }

      setChatMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { 
              ...msg, 
              content: fullContent,
              isStreaming: false,
              isProcessingJson: false,
              hasJson: finalHasJson,
              extractedTasks: finalExtractedTasks,
              jsonParsingStatus: finalJsonParsingStatus,
              taskCount: finalTaskCount
            }
          : msg
      ))

    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage = language === 'zh' 
        ? '抱歉，AI分析遇到了问题，请稍后重试。'
        : 'Sorry, AI analysis encountered an issue, please try again later.'
      
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, isLoading, chatMessages, tasks, language])

  // 初始化数据 - 使用 ref 来避免重复调用，并确保语言状态已加载
  const hasInitialized = useRef(false)
  
  useEffect(() => {
    const dataParam = searchParams.get('data')
    // 只有在语言初始化完成后才进行数据初始化
    if (dataParam && chatMessages.length === 0 && !hasInitialized.current && isLanguageInitialized) {
      console.log('📋 开始数据初始化，当前语言:', language) // 添加调试日志
      try {
        const data = JSON.parse(decodeURIComponent(dataParam))
        if (data.inputText) {
          hasInitialized.current = true
          sendMessage(data.inputText)
        }
      } catch (error) {
        console.error('解析初始数据失败:', error)
      }
    }
  }, [searchParams, chatMessages.length, sendMessage, language, isLanguageInitialized])

  const handleCopyToMarkdownText = useCallback(async () => {
    if (tasks.length === 0) return

    const priorityGroups = {
      high: tasks.filter(task => task.priority === 'high'),
      medium: tasks.filter(task => task.priority === 'medium'),
      low: tasks.filter(task => task.priority === 'low')
    }

    const priorityLabels = {
      zh: { high: "🔴 高优先级", medium: "🟡 中优先级", low: "🟢 低优先级" },
      en: { high: "🔴 High Priority", medium: "🟡 Medium Priority", low: "🟢 Low Priority" }
    }

    let markdown = language === 'zh' ? "# 任务清单\n\n" : "# Task List\n\n"

    if (priorityGroups.high.length > 0) {
      markdown += `## ${priorityLabels[language].high}\n`
      priorityGroups.high.forEach(task => {
        markdown += `- [ ] **${task.title}**`
        if (task.description) markdown += ` - ${task.description}`
        if (task.category) markdown += ` [${task.category}]`
        if (task.deadline) markdown += ` 📅 ${task.deadline}`
        markdown += "\n"
      })
      markdown += "\n"
    }

    if (priorityGroups.medium.length > 0) {
      markdown += `## ${priorityLabels[language].medium}\n`
      priorityGroups.medium.forEach(task => {
        markdown += `- [ ] **${task.title}**`
        if (task.description) markdown += ` - ${task.description}`
        if (task.category) markdown += ` [${task.category}]`
        if (task.deadline) markdown += ` 📅 ${task.deadline}`
        markdown += "\n"
      })
      markdown += "\n"
    }

    if (priorityGroups.low.length > 0) {
      markdown += `## ${priorityLabels[language].low}\n`
      priorityGroups.low.forEach(task => {
        markdown += `- [ ] **${task.title}**`
        if (task.description) markdown += ` - ${task.description}`
        if (task.category) markdown += ` [${task.category}]`
        if (task.deadline) markdown += ` 📅 ${task.deadline}`
        markdown += "\n"
      })
    }

    try {
      await navigator.clipboard.writeText(markdown)
      setCopySuccessMessage(t.copyTextSuccess)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 3000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }, [tasks, language, t.copyTextSuccess])

  const handleCopyToMarkdownTable = useCallback(async () => {
    if (tasks.length === 0) return

    const headers = {
      zh: {
        title: "# 任务清单\n\n",
        table: "| 任务 | 描述 | 优先级 | 分类 | 截止时间 | 状态 |\n|------|------|--------|------|----------|------|",
        priority: { high: '高', medium: '中', low: '低' }
      },
      en: {
        title: "# Task List\n\n",
        table: "| Task | Description | Priority | Category | Deadline | Status |\n|------|-------------|----------|----------|----------|--------|",
        priority: { high: 'High', medium: 'Medium', low: 'Low' }
      }
    }

    let markdown = headers[language].title
    markdown += headers[language].table + "\n"

    tasks.forEach(task => {
      const priorityEmoji = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'
      const statusEmoji = task.completed ? '✅' : '⏳'
      const priorityText = headers[language].priority[task.priority]
      
      markdown += `| ${task.title} | ${task.description || '-'} | ${priorityEmoji} ${priorityText} | ${task.category || '-'} | ${task.deadline || '-'} | ${statusEmoji} |\n`
    })

    try {
      await navigator.clipboard.writeText(markdown)
      setCopySuccessMessage(t.copyTableSuccess)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 3000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }, [tasks, language, t.copyTableSuccess])

  // 缓存输入处理函数
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])

  const handleSendClick = useCallback(() => {
    sendMessage()
  }, [sendMessage])

  const handleBackToHome = useCallback(() => {
    router.push('/')
  }, [router])

  // 缓存复制按钮样式
  const copyButtonStyle = useMemo(() => ({
    className: "flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
  }), [])

  return (
    <div className="h-dvh bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col overflow-hidden">
      {/* Header - 移动端优化 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center space-x-1 sm:space-x-2 text-slate-600 hover:text-slate-900 p-2 h-auto min-h-[44px] touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t.backToHome}</span>
              </Button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>
            <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {/* 移动端标签切换 */}
        <div className="md:hidden mb-4 flex-shrink-0">
          <MobileTabSwitcher
            activeTab={activeTab}
            tabs={[
              { id: 'chat', label: t.chatTab, icon: <MessageCircle className="w-4 h-4" /> },
              { id: 'tasks', label: t.tasksTab, icon: <ListTodo className="w-4 h-4" /> }
            ]}
            onTabChange={(tab) => setActiveTab(tab as 'chat' | 'tasks')}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 flex-1 w-full min-h-0">
          {/* Chat Panel - 桌面端左侧，移动端根据标签显示 */}
          <div className={`
            flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm 
            ${activeTab === 'chat' ? 'flex' : 'hidden'} md:flex md:w-2/5 h-full max-h-full
          `}>
            <div className="flex-shrink-0 p-3 sm:p-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <span className="text-base sm:text-lg font-semibold text-slate-900">{t.chatTitle}</span>
              </div>
            </div>
            
            {/* Chat Messages - 可滚动区域 */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 min-h-0 pb-4">
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  language={language}
                  onExtractTasks={extractTasks}
                  onExtractSingleTask={extractSingleTask}
                />
              ))}
              
              {/* 修改 isLoading 显示逻辑：只有在没有流式消息时才显示 */}
              {isLoading && !chatMessages.some(msg => msg.role === 'assistant' && msg.isStreaming) && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.thinking}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input - 固定底部 */}
            <div className="border-t p-2 sm:p-3 flex-shrink-0 bg-white">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Textarea
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 min-h-[50px] sm:min-h-[60px] resize-none text-sm sm:text-base"
                  disabled={isLoading}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  onClick={handleSendClick}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 h-auto min-h-[44px] touch-manipulation flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'zh' ? '发送' : 'Send'}</span>
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center sm:text-left">
                {language === 'zh' ? '按 Cmd + Enter 发送' : 'Press Cmd + Enter to send'}
              </div>
            </div>
          </div>

          {/* Tasks Panel - 桌面端右侧，移动端根据标签显示 */}
          <div className={`
            flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm 
            ${activeTab === 'tasks' ? 'flex' : 'hidden'} md:flex md:w-3/5 h-full max-h-full
          `}>
            <div className="flex-shrink-0 p-3 sm:p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  <span className="text-base sm:text-lg font-semibold text-slate-900">{t.tasksTitle}</span>
                  {tasks.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {tasks.length}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addManualTask}
                  className="flex items-center space-x-1 text-sm h-8 px-2 sm:px-3 py-1 touch-manipulation"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{language === 'zh' ? '新建' : 'Add Task'}</span>
                </Button>
              </div>
            </div>
            
            {/* Tasks List - 可滚动区域 */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 min-h-0 pb-4">
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <CheckCircle2 className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">{language === 'zh' ? '暂无任务' : 'No tasks yet'}</p>
                  <p className="text-sm text-gray-400">{t.noTasksFound}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={deleteTask}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Fixed Copy Buttons - 固定底部，只在有任务时显示 */}
            {tasks.length > 0 && (
              <div className="border-t p-2 sm:p-3 flex-shrink-0 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToMarkdownText}
                    className="h-auto min-h-[44px] px-2 py-2 touch-manipulation text-xs flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="truncate">{language === 'zh' ? '复制为文本' : 'Copy as Text'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToMarkdownTable}
                    className="h-auto min-h-[44px] px-2 py-2 touch-manipulation text-xs flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="truncate">{language === 'zh' ? '复制为表格' : 'Copy as Table'}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Copy Success Modal */}
      {showCopySuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {language === 'zh' ? '复制成功' : 'Copy Successful'}
              </h3>
            </div>
            <p className="text-slate-600 mb-4">
              {copySuccessMessage}
            </p>
            <Button
              onClick={() => setShowCopySuccess(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {language === 'zh' ? '确定' : 'OK'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-slate-600">加载中...</span>
        </div>
      </div>
    }>
      <PlanningPageContent />
    </Suspense>
  )
} 