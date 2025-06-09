import { useState, useEffect, useCallback } from 'react';
import { 
  Task, 
  TaskV1,
  AIAnalysisResult,
  createDefaultTask,
  TaskStatus,
  TaskPriority,
  TaskSource,
  CURRENT_TASK_VERSION,
  getTaskDisplayStatus,
  isTodayTask,
  getSubtasks,
  getParentTask,
  TaskStatusType,
  TaskPriorityType,
  TaskSourceType,
} from '@/lib/types/task';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  autoMigrate,
  needsMigration,
  performMigration,
} from '@/lib/utils/task-migration';

// 保持向后兼容的旧接口
export interface LegacyTask {
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

export type { Task, AIAnalysisResult };

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Omit<Task, 'id' | 'completed' | 'createdAt' | 'source' | 'version'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'migrating' | 'completed' | 'failed'>('pending');

  // 初始化和数据迁移
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        // 检查是否需要迁移
        if (needsMigration()) {
          setMigrationStatus('migrating');
          await autoMigrate();
        }
        
        // 加载任务数据
        const loadedTasks = loadTasksFromStorage();
        setTasks(loadedTasks);
        setMigrationStatus('completed');
      } catch (error) {
        console.error('Failed to initialize tasks:', error);
        setMigrationStatus('failed');
        
        // 尝试加载原始数据作为降级方案
        try {
          const fallbackData = localStorage.getItem('clearflow-tasks');
          if (fallbackData) {
            const parsed = JSON.parse(fallbackData);
            if (Array.isArray(parsed)) {
              setTasks(parsed);
            }
          }
        } catch (fallbackError) {
          console.error('Fallback data loading failed:', fallbackError);
        }
      }
    };

    initializeTasks();
  }, []);

  // 保存任务到localStorage
  useEffect(() => {
    if (migrationStatus === 'completed' && tasks.length >= 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, migrationStatus]);

  // 生成唯一ID
  const generateId = useCallback(() => {
    return crypto.randomUUID();
  }, []);

  // 添加新任务
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...createDefaultTask(),
      ...taskData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      version: CURRENT_TASK_VERSION,
    };
    
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [generateId]);

  // 切换任务完成状态
  const toggleTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        const newStatus = newCompleted ? TaskStatus.COMPLETED : TaskStatus.TODO;
        
        return {
          ...task,
          completed: newCompleted,
          status: newStatus as TaskStatusType,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, []);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      // 同时删除所有子任务
      const taskToDelete = prev.find(t => t.id === taskId);
      if (taskToDelete && taskToDelete.subtasks) {
        return prev.filter(task => 
          task.id !== taskId && 
          !taskToDelete.subtasks!.includes(task.id)
        );
      }
      
      return prev.filter(task => task.id !== taskId);
    });
  }, []);

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString(),
          version: CURRENT_TASK_VERSION,
        };
      }
      return task;
    }));
  }, []);

  // 更新任务状态
  const updateTaskStatus = useCallback((taskId: string, status: TaskStatusType) => {
    const completed = status === TaskStatus.COMPLETED;
    updateTask(taskId, { status, completed });
  }, [updateTask]);

  // 添加子任务
  const addSubtask = useCallback((parentTaskId: string, subtaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'parentTaskId'>) => {
    const subtask = addTask({
      ...subtaskData,
      parentTaskId,
    });
    
    // 更新父任务的subtasks数组
    setTasks(prev => prev.map(task => {
      if (task.id === parentTaskId) {
        const currentSubtasks = task.subtasks || [];
        return {
          ...task,
          subtasks: [...currentSubtasks, subtask.id],
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
    
    return subtask;
  }, [addTask]);

  // 移除子任务
  const removeSubtask = useCallback((parentTaskId: string, subtaskId: string) => {
    // 删除子任务
    deleteTask(subtaskId);
    
    // 从父任务的subtasks数组中移除
    setTasks(prev => prev.map(task => {
      if (task.id === parentTaskId && task.subtasks) {
        return {
          ...task,
          subtasks: task.subtasks.filter(id => id !== subtaskId),
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    }));
  }, [deleteTask]);

  // 采用AI建议
  const adoptAISuggestion = useCallback((suggestion: Omit<Task, 'id' | 'completed' | 'createdAt' | 'source' | 'version'>) => {
    addTask({
      ...suggestion,
      completed: false,
      source: TaskSource.AI as TaskSourceType,
    });
  }, [addTask]);

  // AI分析功能
  const analyzeText = useCallback(async (inputText: string) => {
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
  }, []);

  // 从分析结果提取任务
  const extractTasksFromAnalysis = useCallback((analysis: string) => {
    try {
      const jsonMatch = analysis.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const tasksData = JSON.parse(jsonMatch[0]);
        const extractedTasks = tasksData.map((task: any) => ({
          title: task.title || task.task || '',
          description: task.description || '',
          priority: (task.priority || 'medium') as TaskPriorityType,
          category: task.category || 'general',
          dueDate: task.deadline || task.dueDate || undefined,
          tags: task.tags || [],
        }));
        setAiSuggestions(extractedTasks);
        return extractedTasks;
      }
    } catch (error) {
      console.error('Error extracting tasks from analysis:', error);
    }

    // 降级方案：基于文本创建简单任务
    const lines = analysis.split('\n').filter(line => 
      line.trim() && !line.startsWith('#') && !line.startsWith('*')
    );
    
    const simpleTasks = lines.slice(0, 5).map((line) => ({
      title: line.trim().replace(/^\d+\.?\s*/, '').substring(0, 100),
      description: '',
      priority: TaskPriority.MEDIUM as TaskPriorityType,
      category: 'general',
      tags: [],
    }));

    setAiSuggestions(simpleTasks);
    return simpleTasks;
  }, []);

  // 获取今日任务
  const getTodayTasks = useCallback(() => {
    return tasks.filter(isTodayTask);
  }, [tasks]);

  // 获取任务的子任务
  const getTaskSubtasks = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? getSubtasks(task, tasks) : [];
  }, [tasks]);

  // 获取任务的父任务
  const getTaskParent = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? getParentTask(task, tasks) : null;
  }, [tasks]);

  // 按分类分组任务
  const getTasksByCategory = useCallback(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const category = task.category || 'uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(task);
    });
    
    return grouped;
  }, [tasks]);

  // 按状态分组任务
  const getTasksByStatus = useCallback(() => {
    const grouped: Record<string, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.COMPLETED]: [],
      [TaskStatus.CANCELLED]: [],
    };
    
    tasks.forEach(task => {
      const status = task.status || (task.completed ? TaskStatus.COMPLETED : TaskStatus.TODO);
      if (grouped[status]) {
        grouped[status].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  // 统计信息
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed || task.status === TaskStatus.COMPLETED).length,
    pending: tasks.filter(task => !task.completed && task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED).length,
    inProgress: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length,
    cancelled: tasks.filter(task => task.status === TaskStatus.CANCELLED).length,
    aiSuggested: tasks.filter(task => task.source === TaskSource.AI).length,
    todayTasks: getTodayTasks().length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed || task.status === TaskStatus.COMPLETED).length / tasks.length) * 100) : 0,
  };

  return {
    // 数据
    tasks,
    aiSuggestions,
    isLoading,
    analysisResult,
    migrationStatus,
    stats,
    
    // 基础操作
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    updateTaskStatus,
    
    // 子任务操作
    addSubtask,
    removeSubtask,
    getTaskSubtasks,
    getTaskParent,
    
    // AI功能
    adoptAISuggestion,
    analyzeText,
    extractTasksFromAnalysis,
    
    // 查询功能
    getTodayTasks,
    getTasksByCategory,
    getTasksByStatus,
    
    // 工具函数
    getTaskDisplayStatus: (task: Task) => getTaskDisplayStatus(task),
    isTodayTask: (task: Task) => isTodayTask(task),
  };
} 