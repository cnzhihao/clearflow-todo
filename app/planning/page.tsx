"use client"

import React, { useState, useEffect, Suspense, useCallback, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sparkles,
  Brain,
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
  ChevronDown,
  ChevronRight,
  Download,
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

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
  
  // 思考过程相关 - 优化后的字段
  thinking?: string
  thinkingStartTime?: number
  thinkingEndTime?: number
  thinkingDuration?: number
  isThinkingActive?: boolean // 当前是否正在思考
  isThinkingComplete?: boolean
  
  // JSON解析相关（仅针对正式内容）
  hasJson?: boolean
  jsonTasks?: ExtractableTask[]
  isProcessingJson?: boolean
  extractedTasks?: ExtractableTask[]
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

// 新增：流式解析状态接口
interface StreamParsingState {
  isInThinking: boolean
  thinkingBuffer: string
  contentBuffer: string
  thinkingStartTime: number
  hasDetectedThinkingStart: boolean
  hasDetectedThinkingEnd: boolean
}

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
    setIsEditing(false)
  }, [])

  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleDelete = useCallback(() => {
    onDelete(task.id)
  }, [task.id, onDelete])

  // 缓存输入变更处理函数
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(prev => ({ ...prev, title: e.target.value }))
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTask(prev => ({ ...prev, description: e.target.value }))
  }, [])

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedTask(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))
  }, [])

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(prev => ({ ...prev, category: e.target.value }))
  }, [])

  const handleDeadlineChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTask(prev => ({ ...prev, deadline: e.target.value }))
  }, [])

  // 当 task 改变时更新 editedTask
  useEffect(() => {
    setEditedTask(task)
  }, [task])

  if (isEditing) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-4">
          <Input
            value={editedTask.title}
            onChange={handleTitleChange}
            placeholder={t.taskTitle}
            className="font-medium"
          />
          <Textarea
            value={editedTask.description || ""}
            onChange={handleDescriptionChange}
            placeholder={t.taskDescription}
            className="min-h-[80px]"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.priority}</label>
              <select
                value={editedTask.priority}
                onChange={handlePriorityChange}
                className="w-full mt-1 p-2 border border-slate-200 rounded-md"
              >
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">{t.category}</label>
              <Input
                value={editedTask.category || ""}
                onChange={handleCategoryChange}
                placeholder={t.category}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">{t.deadline}</label>
            <Input
              type="date"
              value={editedTask.deadline || ""}
              onChange={handleDeadlineChange}
              placeholder={t.deadlinePlaceholder}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              {t.save}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              {t.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-slate-900 flex-1">{task.title}</h3>
          <div className="flex gap-1 ml-2">
            <Button
              onClick={handleStartEdit}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-slate-600 mb-3">{task.description}</p>
        )}
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={PRIORITY_COLORS[task.priority]}>
            {t[task.priority]}
          </Badge>
          {task.category && (
            <Badge variant="outline" className="text-slate-600">
              {task.category}
            </Badge>
          )}
          {task.deadline && (
            <Badge variant="outline" className="text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.deadline}
            </Badge>
          )}
          <Badge variant="outline" className={task.source === 'ai' ? 'text-blue-600' : 'text-slate-600'}>
            {task.source === 'ai' ? 'AI' : '手动'}
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
  onExtractTasks
}: { 
  message: ChatMessage; 
  language: "zh" | "en";
  onExtractTasks: (tasks: ExtractableTask[]) => void;
}) {
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false)
  const isUser = message.role === 'user'

  // 思考时间格式化
  const formattedThinkingDuration = useMemo(() => {
    if (!message.thinkingDuration) return ''
    const seconds = message.thinkingDuration / 1000
    if (seconds < 1) return `${Math.round(message.thinkingDuration)}ms`
    return `${seconds.toFixed(1)}s`
  }, [message.thinkingDuration])

  // 缓存的事件处理函数
  const toggleThinkingExpanded = useCallback(() => {
    setIsThinkingExpanded(prev => !prev)
  }, [])

  // 获取思考状态显示文本
  const getThinkingStatusText = () => {
    if (message.isThinkingActive) {
      return language === 'zh' ? 'AI正在思考...' : 'AI is thinking...'
    }
    if (message.isThinkingComplete && message.thinkingDuration) {
      return language === 'zh' 
        ? `AI思考过程 (耗时 ${formattedThinkingDuration})` 
        : `AI Thinking Process (${formattedThinkingDuration})`
    }
    return language === 'zh' ? 'AI思考过程' : 'AI Thinking Process'
  }

  const handleExtractTasks = useCallback(() => {
    if (message.extractedTasks && message.extractedTasks.length > 0) {
      onExtractTasks(message.extractedTasks)
    }
  }, [message.extractedTasks, onExtractTasks])

  if (isUser) {
    return (
      <div className="flex items-start space-x-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
          <p className="text-gray-800">{message.content}</p>
        </div>
      </div>
    )
  }

  // AI 消息显示
  const shouldShowThinking = message.thinking || message.isThinkingActive
  const shouldShowContent = message.content && !message.isThinkingActive

  return (
    <div className="flex items-start space-x-2 mb-4">
      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-emerald-600" />
      </div>
      <div className="flex-1 space-y-2">
        
        {/* 思考过程区域 */}
        {shouldShowThinking && (
          <div className="bg-emerald-50 rounded-lg border border-emerald-200">
            <button
              onClick={toggleThinkingExpanded}
              className="w-full p-3 text-left flex items-center justify-between hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Brain className={`w-4 h-4 text-emerald-600 ${message.isThinkingActive ? 'animate-pulse' : ''}`} />
                <span className="font-medium text-emerald-800">
                  {getThinkingStatusText()}
                </span>
                {message.isThinkingActive && (
                  <div className="w-4 h-4">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  </div>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${isThinkingExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isThinkingExpanded && message.thinking && (
              <div className="px-3 pb-3 border-t border-emerald-200 bg-emerald-25">
                <div className="pt-2 text-sm text-emerald-700 whitespace-pre-wrap font-mono">
                  {message.thinking}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 正式输出内容 */}
        {shouldShowContent && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>

            {/* 任务提取按钮 */}
            {message.extractedTasks && message.extractedTasks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={handleExtractTasks}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {language === 'zh' 
                      ? `添加 ${message.extractedTasks.length} 个任务` 
                      : `Add ${message.extractedTasks.length} tasks`}
                  </span>
                </button>
              </div>
            )}

            {/* JSON处理状态 */}
            {message.isProcessingJson && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-yellow-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {language === 'zh' ? '正在解析任务...' : 'Parsing tasks...'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
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

  // 初始化语言设置 - 优先级：URL参数 > localStorage > 默认英文
  useEffect(() => {
    const langParam = searchParams.get('lang')
    if (langParam) {
      const currentLang = (langParam === "en" ? "en" : "zh") as "zh" | "en"
      setLanguage(currentLang)
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-language', currentLang)
      }
    } else {
      // 从 localStorage 读取用户偏好，默认英文
      if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('preferred-language') as "zh" | "en" | null
        const currentLang = savedLang || "en"
        setLanguage(currentLang)
      }
    }
  }, [searchParams])

  // 语言变化时保存到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language)
    }
  }, [language])

  const t = translations[language]

  // 使用 useCallback 缓存所有回调函数，避免子组件不必要的重新渲染
  const extractTasks = useCallback((jsonTasks: ExtractableTask[]) => {
    const newTasks: Task[] = jsonTasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      source: 'ai' as const
    }))
    setTasks(prev => [...prev, ...newTasks])
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

  // 优化流式响应处理，实现真正的实时展示
  const sendMessage = useCallback(async (message?: string) => {
    const messageText = message || inputMessage.trim()
    if (!messageText || isLoading) return

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

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      // 立即创建AI消息并进入thinking状态
      let aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        thinking: '',
        isThinkingActive: true, // 立即进入thinking状态
        isThinkingComplete: false,
        hasJson: false,
        jsonTasks: [],
        thinkingStartTime: Date.now()
      }

      setChatMessages(prev => [...prev, aiMessage])

      // 初始化解析状态
      let parseState: StreamParsingState = {
        isInThinking: false,
        thinkingBuffer: '',
        contentBuffer: '',
        thinkingStartTime: Date.now(),
        hasDetectedThinkingStart: false,
        hasDetectedThinkingEnd: false
      }

      // 支持的思考标签模式
      const thinkStartPatterns = ['<think>', '<thinking>', '思考过程：']
      const thinkEndPatterns = ['</think>', '</thinking>', '分析结果：']

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

              // 检查思考开始
              let foundThinkStart = false
              for (const pattern of thinkStartPatterns) {
                if (content.includes(pattern) && !parseState.isInThinking) {
                  parseState.isInThinking = true
                  parseState.hasDetectedThinkingStart = true
                  foundThinkStart = true
                  
                  // 提取思考开始后的内容
                  const startIndex = content.indexOf(pattern) + pattern.length
                  parseState.thinkingBuffer += content.slice(startIndex)
                  
                  // 立即更新思考内容
                  setChatMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { 
                          ...msg, 
                          thinking: parseState.thinkingBuffer,
                          isThinkingActive: true
                        }
                      : msg
                  ))
                  break
                }
              }

              if (foundThinkStart) continue

              // 检查思考结束
              let foundThinkEnd = false
              for (const pattern of thinkEndPatterns) {
                if (content.includes(pattern) && parseState.isInThinking) {
                  const endIndex = content.indexOf(pattern)
                  parseState.thinkingBuffer += content.slice(0, endIndex)
                  parseState.isInThinking = false
                  parseState.hasDetectedThinkingEnd = true
                  foundThinkEnd = true
                  
                  const thinkingEndTime = Date.now()
                  const thinkingDuration = thinkingEndTime - parseState.thinkingStartTime
                  
                  // 更新思考完成状态
                  setChatMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { 
                          ...msg, 
                          thinking: parseState.thinkingBuffer,
                          isThinkingActive: false,
                          isThinkingComplete: true,
                          thinkingEndTime,
                          thinkingDuration
                        }
                      : msg
                  ))
                  
                  // 思考结束后的内容作为正式输出
                  const formalContentStart = content.slice(endIndex + pattern.length)
                  if (formalContentStart.trim()) {
                    parseState.contentBuffer += formalContentStart
                    
                    // 立即更新正式内容
                    setChatMessages(prev => prev.map(msg => 
                      msg.id === aiMessage.id 
                        ? { 
                            ...msg, 
                            content: parseState.contentBuffer
                          }
                        : msg
                    ))
                  }
                  break
                }
              }

              if (foundThinkEnd) continue

              // 根据当前状态分配内容并实时更新
              if (parseState.isInThinking) {
                // 思考阶段：实时更新思考内容
                parseState.thinkingBuffer += content
                
                // 实时更新思考内容（每次都更新）
                setChatMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { 
                        ...msg, 
                        thinking: parseState.thinkingBuffer,
                        isThinkingActive: true
                      }
                    : msg
                ))
              } else if (!parseState.hasDetectedThinkingStart && parseState.contentBuffer === '') {
                // 如果还没检测到思考开始，且还没有正式内容，把初始内容当作思考
                parseState.thinkingBuffer += content
                
                setChatMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { 
                        ...msg, 
                        thinking: parseState.thinkingBuffer,
                        isThinkingActive: true
                      }
                    : msg
                ))
              } else {
                // 正式输出阶段：实时更新正式内容
                parseState.contentBuffer += content
                
                let displayContent = parseState.contentBuffer
                let isProcessingJson = false
                let extractedTasks: ExtractableTask[] = []
                let hasJson = false

                // 检查和处理JSON
                const jsonMatch = parseState.contentBuffer.match(/```json\s*([\s\S]*?)\s*```/)
                if (jsonMatch) {
                  hasJson = true
                  const jsonStr = jsonMatch[1].trim()
                  
                  try {
                    const parsedTasks = JSON.parse(jsonStr)
                    if (Array.isArray(parsedTasks)) {
                      extractedTasks = parsedTasks.map((task: any) => ({
                        ...task,
                        id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        completed: false,
                        source: 'ai' as const
                      }))
                      isProcessingJson = false
                    }
                  } catch (e) {
                    isProcessingJson = true
                  }
                } else if (parseState.contentBuffer.includes('```json')) {
                  isProcessingJson = true
                  hasJson = true
                }

                // 实时更新正式内容（每次都更新）
                setChatMessages(prev => prev.map(msg => 
                  msg.id === aiMessage.id 
                    ? { 
                        ...msg, 
                        content: displayContent,
                        hasJson,
                        isProcessingJson,
                        extractedTasks,
                        // 如果开始输出正式内容，标记思考完成
                        isThinkingActive: false,
                        isThinkingComplete: parseState.thinkingBuffer ? true : false
                      }
                    : msg
                ))
              }

            } catch (error) {
              console.error('解析流式数据失败:', error)
            }
          }
        }
      }

      // 最终更新：确保所有状态正确
      const finalContent = parseState.contentBuffer
      const finalThinking = parseState.thinkingBuffer
      
      // 如果没有检测到思考结束标签，手动结束思考状态
      if (!parseState.hasDetectedThinkingEnd && parseState.thinkingBuffer) {
        const thinkingEndTime = Date.now()
        const thinkingDuration = thinkingEndTime - parseState.thinkingStartTime
        
        setChatMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { 
                ...msg, 
                thinking: finalThinking,
                isThinkingActive: false,
                isThinkingComplete: true,
                thinkingEndTime,
                thinkingDuration
              }
            : msg
        ))
      }
      
      // 最终JSON处理
      let finalHasJson = false
      let finalExtractedTasks: ExtractableTask[] = []
      
      if (finalContent) {
        const jsonMatch = finalContent.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          finalHasJson = true
          try {
            const parsedTasks = JSON.parse(jsonMatch[1].trim())
            if (Array.isArray(parsedTasks)) {
              finalExtractedTasks = parsedTasks.map((task: any) => ({
                ...task,
                id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                completed: false,
                source: 'ai' as const
              }))
            }
          } catch (e) {
            console.error('最终JSON解析失败:', e)
          }
        }
      }

      // 最终状态确认
      setChatMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { 
              ...msg, 
              content: finalContent,
              thinking: finalThinking,
              isProcessingJson: false,
              hasJson: finalHasJson,
              extractedTasks: finalExtractedTasks,
              isThinkingActive: false,
              isThinkingComplete: true
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

  // 初始化数据 - 使用 ref 来避免重复调用
  const hasInitialized = useRef(false)
  
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam && chatMessages.length === 0 && !hasInitialized.current) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam))
        if (data.inputText) {
          hasInitialized.current = true
          // 自动发送初始消息
          sendMessage(data.inputText)
        }
      } catch (error) {
        console.error('解析初始数据失败:', error)
      }
    }
  }, [searchParams, chatMessages.length, sendMessage])

  const handleCopyToMarkdownText = useCallback(async () => {
    if (tasks.length === 0) return

    const priorityGroups = {
      high: tasks.filter(task => task.priority === 'high'),
      medium: tasks.filter(task => task.priority === 'medium'),
      low: tasks.filter(task => task.priority === 'low')
    }

    const priorityLabels = {
      zh: { high: "�� 高优先级", medium: "🟡 中优先级", low: "🟢 低优先级" },
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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col overflow-hidden">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 flex-shrink-0 z-50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToHome}</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>
            <LanguageSwitcher currentLanguage={language} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="flex gap-6 h-full w-full">
          {/* Left Panel - Chat */}
          <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm w-2/5">
            <div className="flex-shrink-0 p-6 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <span className="text-lg font-semibold text-slate-900">{t.chatTitle}</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    language={language}
                    onExtractTasks={extractTasks}
                  />
                ))}
                
                {isLoading && (
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
              
              {/* Chat Input */}
              <div className="border-t p-4 flex-shrink-0">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={handleInputChange}
                    placeholder={t.chatPlaceholder}
                    className="flex-1 min-h-[60px] resize-none"
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    onClick={handleSendClick}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {language === 'zh' ? '按 Cmd + Enter 发送' : 'Press Cmd + Enter to send'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Tasks */}
          <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm w-3/5">
            <div className="flex-shrink-0 p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-lg font-semibold text-slate-900">{t.tasksTitle}</span>
                  {tasks.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {tasks.length}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addManualTask}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.createManualTask}</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-4">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">{language === 'zh' ? '暂无任务' : 'No tasks yet'}</p>
                    <p className="text-sm text-gray-400">{t.noTasksFound}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
              
              {/* Fixed Copy Buttons - Only show when there are tasks */}
              {tasks.length > 0 && (
                <div className="border-t p-4 flex-shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToMarkdownText}
                      className={copyButtonStyle.className}
                    >
                      <Copy className="w-4 h-4" />
                      <span>{t.copyTextFormat}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToMarkdownTable}
                      className={copyButtonStyle.className}
                    >
                      <Copy className="w-4 h-4" />
                      <span>{t.copyTableFormat}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
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