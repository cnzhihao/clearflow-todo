import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  deadline?: string;
  createdAt: string;
  source: 'manual' | 'ai';
}

export interface AIAnalysisResult {
  reasoning: string;
  tasks: Omit<Task, 'id' | 'completed' | 'createdAt' | 'source'>[];
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Omit<Task, 'id' | 'completed' | 'createdAt' | 'source'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('clearflow-tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('clearflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Toggle task completion
  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Update a task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // Add AI suggestion to tasks
  const adoptAISuggestion = (suggestion: Omit<Task, 'id' | 'completed' | 'createdAt' | 'source'>) => {
    addTask({
      ...suggestion,
      completed: false,
      source: 'ai'
    });
  };

  // AI analysis function
  const analyzeText = async (inputText: string) => {
    setIsLoading(true);
    setAnalysisResult('');
    setAiSuggestions([]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('No response stream');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'content') {
                setAnalysisResult(prev => prev + data.content);
              } else if (data.type === 'done') {
                // 处理分析完成
                break;
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Extract tasks from analysis result
  const extractTasksFromAnalysis = (analysis: string) => {
    try {
      // 尝试从分析结果中提取JSON格式的任务列表
      const jsonMatch = analysis.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const tasksData = JSON.parse(jsonMatch[0]);
        const extractedTasks = tasksData.map((task: any) => ({
          title: task.title || task.task || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          category: task.category || 'general',
          deadline: task.deadline || undefined,
        }));
        setAiSuggestions(extractedTasks);
        return extractedTasks;
      }
    } catch (error) {
      console.error('Error extracting tasks from analysis:', error);
    }

    // 如果无法提取JSON，则基于分析文本创建简单的任务建议
    const lines = analysis.split('\n').filter(line => 
      line.trim() && !line.startsWith('#') && !line.startsWith('*')
    );
    
    const simpleTasks = lines.slice(0, 5).map((line, index) => ({
      title: line.trim().replace(/^\d+\.?\s*/, '').substring(0, 100),
      description: '',
      priority: 'medium' as const,
      category: 'general',
    }));

    setAiSuggestions(simpleTasks);
    return simpleTasks;
  };

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    aiSuggested: tasks.filter(task => task.source === 'ai').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0,
  };

  return {
    tasks,
    aiSuggestions,
    isLoading,
    analysisResult,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    adoptAISuggestion,
    analyzeText,
    extractTasksFromAnalysis,
    setAiSuggestions,
  };
} 