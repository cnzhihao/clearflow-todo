/**
 * 任务数据模型类型定义
 * 支持版本控制和数据迁移
 */

// 当前数据版本
export const CURRENT_TASK_VERSION = 2;

// 原始Task接口（V1）- 保持向后兼容
export interface TaskV1 {
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

// 升级后的Task接口（V2）
export interface TaskV2 {
  // 保持现有字段
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  createdAt: string;
  source: 'manual' | 'ai';
  
  // 新增字段（都是可选的，保证向后兼容）
  tags?: string[];
  startDate?: string; // ISO日期字符串
  dueDate?: string;   // 替换deadline字段
  estimatedHours?: number;
  parentTaskId?: string; // 用于任务分解
  subtasks?: string[]; // 子任务ID数组
  status?: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  updatedAt?: string;
  
  // 版本控制
  version?: number;
}

// 当前使用的Task类型（指向最新版本）
export type Task = TaskV2;

// 任务状态枚举
export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus];

// 任务优先级枚举
export const TaskPriority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export type TaskPriorityType = typeof TaskPriority[keyof typeof TaskPriority];

// 任务来源枚举
export const TaskSource = {
  MANUAL: 'manual',
  AI: 'ai',
} as const;

export type TaskSourceType = typeof TaskSource[keyof typeof TaskSource];

// AI分析结果接口
export interface AIAnalysisResult {
  reasoning: string;
  tasks: Omit<Task, 'id' | 'completed' | 'createdAt' | 'source' | 'version'>[];
}

// 可提取的任务接口（用于AI分析结果）
export interface ExtractableTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  category: string;
  completed: boolean;
}

// 数据存储结构
export interface TaskStorage {
  version: number;
  tasks: Task[];
  lastMigration?: string;
}

// 迁移结果
export interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  fromVersion: number;
  toVersion: number;
}

/**
 * 检测任务数据版本
 */
export function detectTaskVersion(task: any): number {
  if (task.version) {
    return task.version;
  }
  
  // 如果有新字段，可能是V2但没有版本号
  if (task.tags || task.startDate || task.dueDate || task.status || task.parentTaskId) {
    return 2;
  }
  
  // 默认为V1
  return 1;
}

/**
 * 将V1任务迁移到V2
 */
export function migrateTaskV1ToV2(taskV1: TaskV1): TaskV2 {
  const taskV2: TaskV2 = {
    ...taskV1,
    // 新增字段的默认值
    tags: [],
    dueDate: taskV1.deadline, // 将deadline迁移到dueDate
    subtasks: [],
    status: taskV1.completed ? (TaskStatus.COMPLETED as TaskStatusType) : (TaskStatus.TODO as TaskStatusType),
    updatedAt: taskV1.createdAt,
    version: 2,
  };
  
  // 移除旧的deadline字段
  delete (taskV2 as any).deadline;
  
  return taskV2;
}

/**
 * 批量迁移任务数据
 */
export function migrateTasks(tasks: any[]): MigrationResult {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    errors: [],
    fromVersion: 1,
    toVersion: CURRENT_TASK_VERSION,
  };
  
  const migratedTasks: Task[] = [];
  
  for (const task of tasks) {
    try {
      const version = detectTaskVersion(task);
      
      if (version === 1) {
        const migratedTask = migrateTaskV1ToV2(task as TaskV1);
        migratedTasks.push(migratedTask);
        result.migratedCount++;
      } else if (version === 2) {
        // 确保V2任务有版本号
        migratedTasks.push({
          ...task,
          version: 2,
        });
      } else {
        // 未知版本，尝试作为V1处理
        const migratedTask = migrateTaskV1ToV2(task as TaskV1);
        migratedTasks.push(migratedTask);
        result.migratedCount++;
        result.errors.push(`Unknown version for task ${task.id}, treated as V1`);
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to migrate task ${task.id}: ${error}`);
    }
  }
  
  return result;
}

/**
 * 验证任务数据完整性
 */
export function validateTask(task: any): task is Task {
  return (
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.completed === 'boolean' &&
    ['high', 'medium', 'low'].includes(task.priority) &&
    typeof task.createdAt === 'string' &&
    ['manual', 'ai'].includes(task.source)
  );
}

/**
 * 创建新任务的默认值
 */
export function createDefaultTask(overrides: Partial<Task> = {}): Omit<Task, 'id' | 'createdAt'> {
  return {
    title: '',
    completed: false,
    priority: TaskPriority.MEDIUM as TaskPriorityType,
    source: TaskSource.MANUAL as TaskSourceType,
    tags: [],
    subtasks: [],
    status: TaskStatus.TODO as TaskStatusType,
    version: CURRENT_TASK_VERSION,
    ...overrides,
  };
}

/**
 * 获取任务的显示状态
 */
export function getTaskDisplayStatus(task: Task): string {
  if (task.status) {
    switch (task.status) {
      case TaskStatus.TODO:
        return '待办';
      case TaskStatus.IN_PROGRESS:
        return '进行中';
      case TaskStatus.COMPLETED:
        return '已完成';
      case TaskStatus.CANCELLED:
        return '已取消';
      default:
        return '未知';
    }
  }
  
  // 向后兼容：基于completed字段
  return task.completed ? '已完成' : '待办';
}

/**
 * 检查任务是否为今日任务
 */
export function isTodayTask(task: Task): boolean {
  const today = new Date().toISOString().split('T')[0];
  
  // 检查开始日期
  if (task.startDate === today) {
    return true;
  }
  
  // 检查截止日期（如果任务未完成）
  if (task.dueDate === today && task.status !== TaskStatus.COMPLETED) {
    return true;
  }
  
  return false;
}

/**
 * 获取任务的子任务
 */
export function getSubtasks(task: Task, allTasks: Task[]): Task[] {
  if (!task.subtasks || task.subtasks.length === 0) {
    return [];
  }
  
  return allTasks.filter(t => task.subtasks!.includes(t.id));
}

/**
 * 获取任务的父任务
 */
export function getParentTask(task: Task, allTasks: Task[]): Task | null {
  if (!task.parentTaskId) {
    return null;
  }
  
  return allTasks.find(t => t.id === task.parentTaskId) || null;
}

/**
 * 任务统计信息
 */
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  aiSuggested: number;
  completionRate: number;
  byPriority: Record<TaskPriority, number>;
  byCategory: Record<string, number>;
}

/**
 * 计算任务统计信息
 */
export function calculateTaskStats(tasks: Task[]): TaskStats {
  const stats: TaskStats = {
    total: tasks.length,
    completed: 0,
    pending: 0,
    inProgress: 0,
    cancelled: 0,
    aiSuggested: 0,
    completionRate: 0,
    byPriority: {
      [TaskPriority.HIGH]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.LOW]: 0,
    },
    byCategory: {},
  };

  for (const task of tasks) {
    // 状态统计
    if (task.completed || task.status === TaskStatus.COMPLETED) {
      stats.completed++;
    } else if (task.status === TaskStatus.IN_PROGRESS) {
      stats.inProgress++;
    } else if (task.status === TaskStatus.CANCELLED) {
      stats.cancelled++;
    } else {
      stats.pending++;
    }

    // 来源统计
    if (task.source === TaskSource.AI) {
      stats.aiSuggested++;
    }

    // 优先级统计
    stats.byPriority[task.priority]++;

    // 分类统计
    const category = task.category || 'uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  }

  // 计算完成率
  stats.completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return stats;
}

/**
 * 任务过滤器
 */
export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  category?: string[];
  source?: TaskSource[];
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

/**
 * 过滤任务
 */
export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter(task => {
    // 状态过滤
    if (filter.status && filter.status.length > 0) {
      const taskStatus = task.status || (task.completed ? TaskStatus.COMPLETED : TaskStatus.TODO);
      if (!filter.status.includes(taskStatus as TaskStatus)) {
        return false;
      }
    }

    // 优先级过滤
    if (filter.priority && filter.priority.length > 0) {
      if (!filter.priority.includes(task.priority as TaskPriority)) {
        return false;
      }
    }

    // 分类过滤
    if (filter.category && filter.category.length > 0) {
      if (!task.category || !filter.category.includes(task.category)) {
        return false;
      }
    }

    // 来源过滤
    if (filter.source && filter.source.length > 0) {
      if (!filter.source.includes(task.source as TaskSource)) {
        return false;
      }
    }

    // 标签过滤
    if (filter.tags && filter.tags.length > 0) {
      if (!task.tags || !filter.tags.some(tag => task.tags!.includes(tag))) {
        return false;
      }
    }

    // 日期范围过滤
    if (filter.dateRange) {
      const taskDate = task.startDate || task.dueDate || task.createdAt;
      if (taskDate) {
        if (filter.dateRange.start && taskDate < filter.dateRange.start) {
          return false;
        }
        if (filter.dateRange.end && taskDate > filter.dateRange.end) {
          return false;
        }
      }
    }

    // 搜索过滤
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description?.toLowerCase().includes(searchLower);
      const categoryMatch = task.category?.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !descriptionMatch && !categoryMatch) {
        return false;
      }
    }

    return true;
  });
} 