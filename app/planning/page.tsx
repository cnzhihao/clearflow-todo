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
  thinking?: string
  thinkingStartTime?: number
  thinkingEndTime?: number
  thinkingDuration?: number
  isThinkingComplete?: boolean
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
  onExtractTasks, 
  getPriorityColor, 
  getPriorityIcon 
}: { 
  message: ChatMessage; 
  language: "zh" | "en";
  onExtractTasks: (tasks: ExtractableTask[]) => void;
  getPriorityColor: (priority: string) => string;
  getPriorityIcon: (priority: string) => React.ReactNode;
}) {
  const isUser = message.role === 'user'
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(false)
  
  // 缓存单个任务提取函数
  const handleExtractSingleTask = useCallback((task: ExtractableTask) => {
    onExtractTasks([task])
  }, [onExtractTasks])

  // 缓存全部任务提取函数
  const handleExtractAllTasks = useCallback(() => {
    if (message.extractedTasks) {
      onExtractTasks(message.extractedTasks)
    }
  }, [message.extractedTasks, onExtractTasks])

  // 缓存时间格式化
  const formattedTime = useMemo(() => {
    return new Date(message.timestamp).toLocaleTimeString()
  }, [message.timestamp])

  // 缓存思考时间格式化
  const formattedThinkingDuration = useMemo(() => {
    if (message.thinkingDuration) {
      const seconds = (message.thinkingDuration / 1000).toFixed(1)
      return language === 'zh' ? `${seconds}秒` : `${seconds}s`
    }
    return ''
  }, [message.thinkingDuration, language])

  // 切换思考过程展开状态
  const toggleThinkingExpanded = useCallback(() => {
    setIsThinkingExpanded(prev => !prev)
  }, [])
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`p-3 rounded-lg ${
          isUser 
            ? 'bg-emerald-500 text-white ml-auto' 
            : 'bg-white border border-slate-200'
        }`}>
          {isUser ? (
            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div>
              {/* Thinking Process - 显示在内容上方 */}
              {(message.thinking || (!message.isThinkingComplete && message.role === 'assistant')) && (
                <div className="mb-3">
                  <Collapsible open={isThinkingExpanded} onOpenChange={setIsThinkingExpanded}>
                    <CollapsibleTrigger 
                      onClick={toggleThinkingExpanded}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors w-full text-left"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${isThinkingExpanded ? 'rotate-90' : ''}`} />
                      <Brain className="w-4 h-4" />
                      <span>
                        {message.isThinkingComplete 
                          ? (language === 'zh' ? `AI思考过程 (${formattedThinkingDuration})` : `AI Thinking Process (${formattedThinkingDuration})`)
                          : (language === 'zh' ? 'AI正在思考...' : 'AI is thinking...')
                        }
                      </span>
                      {!message.isThinkingComplete && (
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-600 ml-1" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-3 bg-emerald-50 rounded border border-emerald-200 text-sm">
                      <div className="whitespace-pre-wrap text-emerald-800">
                        {message.thinking || (language === 'zh' ? '思考中...' : 'Thinking...')}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
              
              {/* Final Content */}
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              
              {/* JSON Processing Status */}
              {message.isProcessingJson && (
                <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">{language === 'zh' ? '任务解析中...' : 'Extracting tasks...'}</span>
                  </div>
                </div>
              )}
              
              {/* Individual Task Cards */}
              {message.extractedTasks && message.extractedTasks.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-gray-800 mb-2">
                    {language === 'zh' ? `发现 ${message.extractedTasks.length} 个任务：` : `Found ${message.extractedTasks.length} tasks:`}
                  </div>
                  {message.extractedTasks.map((task, index) => (
                    <ExtractableTaskCard
                      key={index}
                      task={task}
                      language={language}
                      getPriorityColor={getPriorityColor}
                      getPriorityIcon={getPriorityIcon}
                      onExtract={handleExtractSingleTask}
                    />
                  ))}
                  <Button
                    onClick={handleExtractAllTasks}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'zh' ? '提取全部任务' : 'Extract All Tasks'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formattedTime}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  )
})

// 单独的可提取任务卡片组件
const ExtractableTaskCard = React.memo(function ExtractableTaskCard({
  task,
  language,
  getPriorityColor,
  getPriorityIcon,
  onExtract
}: {
  task: ExtractableTask
  language: "zh" | "en"
  getPriorityColor: (priority: string) => string
  getPriorityIcon: (priority: string) => React.ReactNode
  onExtract: (task: ExtractableTask) => void
}) {
  const handleExtract = useCallback(() => {
    onExtract(task)
  }, [task, onExtract])

  const priorityText = useMemo(() => {
    return task.priority === 'high' 
      ? (language === 'zh' ? '高' : 'High') 
      : task.priority === 'medium' 
      ? (language === 'zh' ? '中' : 'Medium') 
      : (language === 'zh' ? '低' : 'Low')
  }, [task.priority, language])

  return (
    <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-emerald-900">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-emerald-700 mt-1">{task.description}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1">{priorityText}</span>
            </Badge>
            {task.category && (
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
            )}
            {task.deadline && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {task.deadline}
              </Badge>
            )}
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleExtract}
          className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2"
        >
          <Download className="w-3 h-3 mr-1" />
          {language === 'zh' ? '提取' : 'Extract'}
        </Button>
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

  // 优化流式响应处理，减少更新频率
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
          language: language // 确保传递当前语言
        }),
      })

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      // 处理流式响应
      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      let aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        thinking: '',
        thinkingStartTime: Date.now(),
        isThinkingComplete: false,
        hasJson: false,
        jsonTasks: []
      }

      setChatMessages(prev => [...prev, aiMessage])

      let isInThinking = false
      let thinkingContent = ''
      let finalContent = ''
      let updateCounter = 0
      let lastUpdateTime = Date.now()
      let thinkingStartTime = Date.now()

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

              // 检查是否进入thinking模式 (支持多种格式)
              if (content.includes('<think>') || content.includes('<thinking>') || content.includes('思考过程：')) {
                if (!isInThinking) {
                  isInThinking = true
                  thinkingStartTime = Date.now()
                }
                let thinkStart = 0
                if (content.includes('<think>')) {
                  thinkStart = content.indexOf('<think>') + 7
                } else if (content.includes('<thinking>')) {
                  thinkStart = content.indexOf('<thinking>') + 10
                } else if (content.includes('思考过程：')) {
                  thinkStart = content.indexOf('思考过程：') + 5
                }
                thinkingContent += content.slice(thinkStart)
                continue
              }

              // 检查是否退出thinking模式 (支持多种格式)
              if (content.includes('</think>') || content.includes('</thinking>') || content.includes('分析结果：')) {
                if (isInThinking) {
                  isInThinking = false
                  const thinkingEndTime = Date.now()
                  const thinkingDuration = thinkingEndTime - thinkingStartTime
                  
                  let thinkEnd = 0
                  let endTagLength = 0
                  if (content.includes('</think>')) {
                    thinkEnd = content.indexOf('</think>')
                    endTagLength = 8
                  } else if (content.includes('</thinking>')) {
                    thinkEnd = content.indexOf('</thinking>')
                    endTagLength = 11
                  } else if (content.includes('分析结果：')) {
                    thinkEnd = content.indexOf('分析结果：')
                    endTagLength = 5
                  }
                  
                  thinkingContent += content.slice(0, thinkEnd)
                  finalContent += content.slice(thinkEnd + endTagLength)
                  
                  // 更新thinking完成状态
                  setChatMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { 
                          ...msg, 
                          thinking: thinkingContent,
                          thinkingEndTime,
                          thinkingDuration,
                          isThinkingComplete: true
                        }
                      : msg
                  ))
                  continue
                }
              }

              if (isInThinking) {
                thinkingContent += content
                // 大幅减少thinking阶段的更新频率 - 每10次或每500ms更新一次
                updateCounter++
                const now = Date.now()
                if (updateCounter % 10 === 0 || now - lastUpdateTime > 500) {
                  setChatMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { ...msg, thinking: thinkingContent }
                      : msg
                  ))
                  lastUpdateTime = now
                }
              } else {
                finalContent += content
                
                // 检查JSON处理状态
                let displayContent = finalContent
                let isProcessingJson = false
                let extractedTasks: ExtractableTask[] = []
                let hasJson = false

                // 检查是否包含完整的JSON代码块
                const jsonMatch = finalContent.match(/```json\s*([\s\S]*?)\s*```/)
                
                if (jsonMatch) {
                  // JSON处理完成 - 解析并隐藏JSON代码块
                  try {
                    extractedTasks = JSON.parse(jsonMatch[1])
                    hasJson = true
                    isProcessingJson = false
                    
                    // 完全隐藏JSON代码块，只显示前后的内容
                    const jsonStartIndex = finalContent.indexOf('```json')
                    const jsonEndIndex = finalContent.indexOf('```', jsonStartIndex + 7) + 3
                    displayContent = finalContent.substring(0, jsonStartIndex).trim() + 
                                   (finalContent.substring(jsonEndIndex).trim() ? '\n\n' + finalContent.substring(jsonEndIndex).trim() : '')
                  } catch (e) {
                    console.error('JSON解析失败:', e)
                    isProcessingJson = false
                    // 如果JSON解析失败，显示原始内容
                    displayContent = finalContent
                  }
                } else if (finalContent.includes('```json')) {
                  // JSON开始但未完成 - 显示"任务解析中..."状态
                  const jsonStartIndex = finalContent.indexOf('```json')
                  displayContent = finalContent.substring(0, jsonStartIndex).trim()
                  isProcessingJson = true
                }

                // 大幅减少内容更新的频率 - 每15个字符或每300ms更新一次，或在关键节点强制更新
                updateCounter++
                const now = Date.now()
                if (updateCounter % 15 === 0 || now - lastUpdateTime > 300 || hasJson || isProcessingJson) {
                  setChatMessages(prev => prev.map(msg => 
                    msg.id === aiMessage.id 
                      ? { 
                          ...msg, 
                          content: displayContent,
                          hasJson,
                          jsonTasks: extractedTasks,
                          isProcessingJson,
                          extractedTasks
                        }
                      : msg
                  ))
                  lastUpdateTime = now
                }
              }
            } catch (e) {
              console.error('解析响应数据失败:', e)
            }
          }
        }
      }

      // 确保最终状态被更新，并应用JSON隐藏逻辑
      let finalDisplayContent = finalContent
      let finalExtractedTasks: ExtractableTask[] = []
      let finalHasJson = false

      // 检查是否包含完整的JSON代码块
      const finalJsonMatch = finalContent.match(/```json\s*([\s\S]*?)\s*```/)
      
      if (finalJsonMatch) {
        // JSON处理完成 - 解析并隐藏JSON代码块
        try {
          finalExtractedTasks = JSON.parse(finalJsonMatch[1])
          finalHasJson = true
          
          // 完全隐藏JSON代码块，只显示前后的内容
          const jsonStartIndex = finalContent.indexOf('```json')
          const jsonEndIndex = finalContent.indexOf('```', jsonStartIndex + 7) + 3
          finalDisplayContent = finalContent.substring(0, jsonStartIndex).trim() + 
                               (finalContent.substring(jsonEndIndex).trim() ? '\n\n' + finalContent.substring(jsonEndIndex).trim() : '')
        } catch (e) {
          console.error('最终JSON解析失败:', e)
          // 如果JSON解析失败，显示原始内容
          finalDisplayContent = finalContent
        }
      }

      // 确保思考过程完成状态
      const finalThinkingDuration = isInThinking ? 0 : (Date.now() - thinkingStartTime)

      setChatMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { 
              ...msg, 
              content: finalDisplayContent,
              thinking: thinkingContent,
              isProcessingJson: false,
              hasJson: finalHasJson,
              extractedTasks: finalExtractedTasks,
              isThinkingComplete: true,
              thinkingDuration: finalThinkingDuration || msg.thinkingDuration
            }
          : msg
      ))

    } catch (error) {
      console.error('发送消息失败:', error)
      const errorMessage = language === 'zh' 
        ? '抱歉，处理您的请求时出现了问题，请稍后重试。'
        : 'Sorry, there was an issue processing your request. Please try again later.'
      
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, isLoading, chatMessages, tasks, language]) // 添加 language 依赖

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
                    getPriorityColor={getPriorityColor}
                    getPriorityIcon={getPriorityIcon}
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