"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
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

const translations = {
  zh: {
    title: "AI任务规划",
    backToHome: "返回首页",
    analysisProcess: "AI分析过程",
    analyzing: "AI正在分析中...",
    extractedTasks: "提取的任务",
    noTasksFound: "未发现明确的任务",
    addToBoard: "添加到任务板",
    confirmAll: "确认所有任务",
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
    analysisError: "AI分析失败，但您可以手动创建任务",
    createManualTask: "手动创建任务",
    originalText: "原始文本",
  },
  en: {
    title: "AI Task Planning",
    backToHome: "Back to Home",
    analysisProcess: "AI Analysis Process",
    analyzing: "AI is analyzing...",
    extractedTasks: "Extracted Tasks",
    noTasksFound: "No clear tasks found",
    addToBoard: "Add to Board",
    confirmAll: "Confirm All Tasks",
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
    analysisError: "AI analysis failed, but you can create tasks manually",
    createManualTask: "Create Manual Task",
    originalText: "Original Text",
  },
}

function TaskCard({ task, onEdit, onDelete, language }: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  language: "zh" | "en"
}) {
  const t = translations[language]
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleSave = () => {
    onEdit(editedTask)
    setIsEditing(false)
  }

  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  }

  if (isEditing) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-4 space-y-4">
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder={t.taskTitle}
            className="font-medium"
          />
          <Textarea
            value={editedTask.description || ""}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            placeholder={t.taskDescription}
            className="min-h-[80px]"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">{t.priority}</label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
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
                onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                placeholder={t.category}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="bg-emerald-500 hover:bg-emerald-600">
              {t.save}
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
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
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(task.id)}
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
          <Badge className={priorityColors[task.priority]}>
            {t[task.priority]}
          </Badge>
          {task.category && (
            <Badge variant="outline" className="text-slate-600">
              {task.category}
            </Badge>
          )}
          {task.source === 'ai' && (
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Brain className="w-3 h-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PlanningPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<"zh" | "en">("zh")
  const t = translations[language]
  
  const [inputText, setInputText] = useState("")
  const [analysisResult, setAnalysisResult] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam))
        setInputText(data.inputText || "")
        setHasError(data.error || false)
        
        if (!data.error) {
          // 开始AI分析
          startAnalysis(data.inputText)
        }
      } catch (error) {
        console.error('Error parsing URL data:', error)
        setHasError(true)
      }
    }
  }, [searchParams])

  const startAnalysis = async (text: string) => {
    setIsAnalyzing(true)
    setAnalysisResult("")
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText: text }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze text')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (!reader) {
        throw new Error('No response stream')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'content') {
                setAnalysisResult(prev => prev + data.content)
              } else if (data.type === 'done') {
                // 分析完成，提取任务
                extractTasksFromAnalysis(analysisResult + data.content)
                break
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing text:', error)
      setHasError(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractTasksFromAnalysis = (analysis: string) => {
    try {
      // 尝试从分析结果中提取JSON格式的任务列表
      const jsonMatch = analysis.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const tasksData = JSON.parse(jsonMatch[0])
        const extractedTasks = tasksData.map((task: any, index: number) => ({
          id: `ai-task-${Date.now()}-${index}`,
          title: task.title || task.task || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          category: task.category || 'general',
          deadline: task.deadline || undefined,
          completed: false,
          source: 'ai' as const,
        }))
        setTasks(extractedTasks)
        return
      }
    } catch (error) {
      console.error('Error extracting tasks from analysis:', error)
    }

    // 如果无法提取JSON，则基于分析文本创建简单的任务建议
    const lines = analysis.split('\n').filter(line => 
      line.trim() && 
      !line.startsWith('#') && 
      !line.startsWith('*') &&
      line.length > 10
    )
    
    const simpleTasks = lines.slice(0, 5).map((line, index) => ({
      id: `ai-task-${Date.now()}-${index}`,
      title: line.trim().replace(/^\d+\.?\s*/, '').substring(0, 100),
      description: '',
      priority: 'medium' as const,
      category: 'general',
      completed: false,
      source: 'ai' as const,
    }))

    setTasks(simpleTasks)
  }

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleCreateManualTask = () => {
    const newTask: Task = {
      id: `manual-task-${Date.now()}`,
      title: "新任务",
      description: "",
      priority: 'medium',
      category: 'general',
      completed: false,
      source: 'manual',
    }
    setTasks(prev => [...prev, newTask])
    setShowCreateTask(false)
  }

  const handleConfirmAllTasks = () => {
    // 这里应该将任务保存到本地存储或发送到后端
    // 然后跳转到任务板页面
    if (tasks.length > 0) {
      // 保存任务到localStorage（临时方案）
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
      const allTasks = [...existingTasks, ...tasks]
      localStorage.setItem('tasks', JSON.stringify(allTasks))
      
      // 跳转到任务板（暂时跳转到workspace）
      router.push('/workspace')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToHome}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
              </div>
            </div>

            <LanguageSwitcher currentLanguage={language} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis Process */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  {t.analysisProcess}
                  {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">{t.analysisError}</p>
                  </div>
                ) : isAnalyzing && !analysisResult ? (
                  <div className="flex items-center justify-center py-8 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    {t.analyzing}
                  </div>
                ) : analysisResult ? (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                      {analysisResult}
                    </pre>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Original Text */}
            {inputText && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">{t.originalText}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">{inputText}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Extracted Tasks */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    {t.extractedTasks}
                  </div>
                  <Button
                    onClick={() => setShowCreateTask(true)}
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t.createManualTask}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>{t.noTasksFound}</p>
                    <Button
                      onClick={handleCreateManualTask}
                      variant="outline"
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.createManualTask}
                    </Button>
                  </div>
                ) : (
                  <>
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        language={language}
                      />
                    ))}
                    
                    <div className="pt-4 border-t border-slate-200">
                      <Button
                        onClick={handleConfirmAllTasks}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        size="lg"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        {t.confirmAll} ({tasks.length})
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PlanningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <PlanningPageContent />
    </Suspense>
  )
} 