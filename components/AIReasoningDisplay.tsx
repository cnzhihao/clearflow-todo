"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Plus, X } from "lucide-react"

interface AIReasoningDisplayProps {
  reasoning: string
  isLoading: boolean
  language: "zh" | "en"
  onExtractTasks: () => void
  onTaskAdopt: (task: any) => void
  suggestions: any[]
}

export function AIReasoningDisplay({
  reasoning,
  isLoading,
  language,
  onExtractTasks,
  onTaskAdopt,
  suggestions
}: AIReasoningDisplayProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [showTaskExtraction, setShowTaskExtraction] = useState(false)

  const t = {
    zh: {
      title: "AI 推理过程",
      analyzing: "AI 正在分析中...",
      extractTasks: "提取任务",
      tasksFound: "发现的任务",
      adopt: "采纳",
      ignore: "忽略",
      noTasks: "未发现明确的任务",
    },
    en: {
      title: "AI Reasoning Process",
      analyzing: "AI is analyzing...",
      extractTasks: "Extract Tasks",
      tasksFound: "Tasks Found",
      adopt: "Adopt",
      ignore: "Ignore",
      noTasks: "No clear tasks found",
    },
  }[language]

  // 打字机效果显示推理过程
  useEffect(() => {
    if (!reasoning) {
      setDisplayedText("")
      return
    }

    let index = 0
    const timer = setInterval(() => {
      if (index < reasoning.length) {
        setDisplayedText(reasoning.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        // 推理完成后自动尝试提取任务
        setTimeout(() => {
          setShowTaskExtraction(true)
        }, 1000)
      }
    }, 20) // 调整速度

    return () => clearInterval(timer)
  }, [reasoning])

  const handleExtractTasks = () => {
    onExtractTasks()
    setShowTaskExtraction(false)
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-purple-600" />
          {t.title}
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && !displayedText && (
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            {t.analyzing}
          </div>
        )}

        {displayedText && (
          <div className="space-y-4">
            {/* 推理过程显示 */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed">
                {displayedText}
              </pre>
            </div>

            {/* 任务提取按钮 */}
            {showTaskExtraction && !isLoading && (
              <div className="flex justify-center">
                <Button
                  onClick={handleExtractTasks}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t.extractTasks}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 提取的任务列表 */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {t.tasksFound}: {suggestions.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {suggestions.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {task.priority && (
                        <Badge
                          variant="outline"
                          className={
                            task.priority === "high"
                              ? "border-red-200 text-red-700"
                              : task.priority === "medium"
                              ? "border-yellow-200 text-yellow-700"
                              : "border-green-200 text-green-700"
                          }
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.category && (
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {task.category}
                        </Badge>
                      )}
                      {task.deadline && (
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          {task.deadline}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => onTaskAdopt(task)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {t.adopt}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !reasoning && suggestions.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>{language === "zh" ? "等待 AI 分析..." : "Waiting for AI analysis..."}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 