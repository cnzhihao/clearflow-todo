/**
 * 任务数据迁移工具
 * 处理localStorage中的任务数据升级
 */

import {
  Task,
  TaskV1,
  TaskStorage,
  MigrationResult,
  CURRENT_TASK_VERSION,
  migrateTasks,
  detectTaskVersion,
  validateTask,
} from '@/lib/types/task';

// localStorage键名
const STORAGE_KEY = 'clearflow-tasks';
const STORAGE_VERSION_KEY = 'clearflow-tasks-version';
const MIGRATION_LOG_KEY = 'clearflow-migration-log';

/**
 * 迁移日志条目
 */
interface MigrationLogEntry {
  timestamp: string;
  fromVersion: number;
  toVersion: number;
  taskCount: number;
  success: boolean;
  errors: string[];
}

/**
 * 获取存储的数据版本
 */
export function getStoredDataVersion(): number {
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    return version ? parseInt(version, 10) : 1;
  } catch (error) {
    console.warn('Failed to get stored data version:', error);
    return 1;
  }
}

/**
 * 设置存储的数据版本
 */
export function setStoredDataVersion(version: number): void {
  try {
    localStorage.setItem(STORAGE_VERSION_KEY, version.toString());
  } catch (error) {
    console.error('Failed to set stored data version:', error);
  }
}

/**
 * 获取迁移日志
 */
export function getMigrationLog(): MigrationLogEntry[] {
  try {
    const log = localStorage.getItem(MIGRATION_LOG_KEY);
    return log ? JSON.parse(log) : [];
  } catch (error) {
    console.warn('Failed to get migration log:', error);
    return [];
  }
}

/**
 * 添加迁移日志条目
 */
export function addMigrationLogEntry(entry: MigrationLogEntry): void {
  try {
    const log = getMigrationLog();
    log.push(entry);
    // 只保留最近10条记录
    const recentLog = log.slice(-10);
    localStorage.setItem(MIGRATION_LOG_KEY, JSON.stringify(recentLog));
  } catch (error) {
    console.error('Failed to add migration log entry:', error);
  }
}

/**
 * 从localStorage加载任务数据
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const tasksData = localStorage.getItem(STORAGE_KEY);
    if (!tasksData) {
      return [];
    }

    const parsedData = JSON.parse(tasksData);
    
    // 如果是数组，说明是旧格式
    if (Array.isArray(parsedData)) {
      return parsedData.filter(validateTask);
    }
    
    // 如果是对象，检查是否有tasks字段
    if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.tasks)) {
      return parsedData.tasks.filter(validateTask);
    }
    
    return [];
  } catch (error) {
    console.error('Failed to load tasks from storage:', error);
    return [];
  }
}

/**
 * 保存任务数据到localStorage
 */
export function saveTasksToStorage(tasks: Task[]): void {
  try {
    const storage: TaskStorage = {
      version: CURRENT_TASK_VERSION,
      tasks: tasks,
      lastMigration: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    setStoredDataVersion(CURRENT_TASK_VERSION);
  } catch (error) {
    console.error('Failed to save tasks to storage:', error);
  }
}

/**
 * 检查是否需要数据迁移
 */
export function needsMigration(): boolean {
  const currentVersion = getStoredDataVersion();
  return currentVersion < CURRENT_TASK_VERSION;
}

/**
 * 执行数据迁移
 */
export async function performMigration(): Promise<MigrationResult> {
  const startTime = Date.now();
  const fromVersion = getStoredDataVersion();
  
  console.log(`Starting migration from version ${fromVersion} to ${CURRENT_TASK_VERSION}`);
  
  try {
    // 加载现有数据
    const existingTasks = loadTasksFromStorage();
    
    if (existingTasks.length === 0) {
      // 没有数据需要迁移
      setStoredDataVersion(CURRENT_TASK_VERSION);
      return {
        success: true,
        migratedCount: 0,
        errors: [],
        fromVersion,
        toVersion: CURRENT_TASK_VERSION,
      };
    }
    
    // 执行迁移
    const migrationResult = migrateTasks(existingTasks);
    
    if (migrationResult.success) {
      // 保存迁移后的数据
      saveTasksToStorage(existingTasks);
      
      // 记录迁移日志
      const logEntry: MigrationLogEntry = {
        timestamp: new Date().toISOString(),
        fromVersion,
        toVersion: CURRENT_TASK_VERSION,
        taskCount: existingTasks.length,
        success: true,
        errors: migrationResult.errors,
      };
      
      addMigrationLogEntry(logEntry);
      
      console.log(`Migration completed successfully in ${Date.now() - startTime}ms`);
      console.log(`Migrated ${migrationResult.migratedCount} tasks`);
      
      if (migrationResult.errors.length > 0) {
        console.warn('Migration completed with warnings:', migrationResult.errors);
      }
    }
    
    return migrationResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const logEntry: MigrationLogEntry = {
      timestamp: new Date().toISOString(),
      fromVersion,
      toVersion: CURRENT_TASK_VERSION,
      taskCount: 0,
      success: false,
      errors: [errorMessage],
    };
    
    addMigrationLogEntry(logEntry);
    
    console.error('Migration failed:', error);
    
    return {
      success: false,
      migratedCount: 0,
      errors: [errorMessage],
      fromVersion,
      toVersion: CURRENT_TASK_VERSION,
    };
  }
}

/**
 * 备份当前数据
 */
export function backupCurrentData(): string | null {
  try {
    const tasksData = localStorage.getItem(STORAGE_KEY);
    if (!tasksData) {
      return null;
    }
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: getStoredDataVersion(),
      data: tasksData,
    };
    
    return JSON.stringify(backup);
  } catch (error) {
    console.error('Failed to backup current data:', error);
    return null;
  }
}

/**
 * 从备份恢复数据
 */
export function restoreFromBackup(backupData: string): boolean {
  try {
    const backup = JSON.parse(backupData);
    
    if (!backup.data || !backup.version) {
      throw new Error('Invalid backup format');
    }
    
    localStorage.setItem(STORAGE_KEY, backup.data);
    setStoredDataVersion(backup.version);
    
    console.log(`Restored data from backup (version ${backup.version})`);
    return true;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
}

/**
 * 清理存储数据
 */
export function clearStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
    localStorage.removeItem(MIGRATION_LOG_KEY);
    console.log('Storage data cleared');
  } catch (error) {
    console.error('Failed to clear storage data:', error);
  }
}

/**
 * 获取存储统计信息
 */
export function getStorageStats(): {
  version: number;
  taskCount: number;
  storageSize: number;
  lastMigration?: string;
} {
  try {
    const version = getStoredDataVersion();
    const tasks = loadTasksFromStorage();
    const tasksData = localStorage.getItem(STORAGE_KEY);
    const storageSize = tasksData ? new Blob([tasksData]).size : 0;
    
    let lastMigration: string | undefined;
    try {
      const storage = JSON.parse(tasksData || '{}');
      lastMigration = storage.lastMigration;
    } catch {
      // 忽略解析错误
    }
    
    return {
      version,
      taskCount: tasks.length,
      storageSize,
      lastMigration,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      version: 1,
      taskCount: 0,
      storageSize: 0,
    };
  }
}

/**
 * 自动迁移检查和执行
 * 在应用启动时调用
 */
export async function autoMigrate(): Promise<void> {
  if (needsMigration()) {
    console.log('Auto-migration needed, starting migration...');
    
    // 创建备份
    const backup = backupCurrentData();
    if (backup) {
      console.log('Backup created before migration');
    }
    
    try {
      const result = await performMigration();
      
      if (!result.success) {
        console.error('Auto-migration failed:', result.errors);
        
        // 如果有备份，询问是否恢复
        if (backup && confirm('数据迁移失败，是否恢复到迁移前的状态？')) {
          restoreFromBackup(backup);
        }
      } else {
        console.log('Auto-migration completed successfully');
      }
    } catch (error) {
      console.error('Auto-migration error:', error);
      
      // 如果有备份，询问是否恢复
      if (backup && confirm('数据迁移出错，是否恢复到迁移前的状态？')) {
        restoreFromBackup(backup);
      }
    }
  }
}

/**
 * 验证迁移后的数据
 */
export function validateMigratedData(tasks: Task[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const task of tasks) {
    // 检查必需字段
    if (!task.id) {
      errors.push(`Task missing id: ${JSON.stringify(task)}`);
    }
    
    if (!task.title) {
      errors.push(`Task ${task.id} missing title`);
    }
    
    if (!task.createdAt) {
      errors.push(`Task ${task.id} missing createdAt`);
    }
    
    // 检查版本
    if (!task.version || task.version < CURRENT_TASK_VERSION) {
      errors.push(`Task ${task.id} has invalid version: ${task.version}`);
    }
    
    // 检查状态一致性
    if (task.completed && task.status && task.status !== 'completed') {
      errors.push(`Task ${task.id} has inconsistent completion status`);
    }
    
    // 检查日期格式
    if (task.startDate && isNaN(Date.parse(task.startDate))) {
      errors.push(`Task ${task.id} has invalid startDate: ${task.startDate}`);
    }
    
    if (task.dueDate && isNaN(Date.parse(task.dueDate))) {
      errors.push(`Task ${task.id} has invalid dueDate: ${task.dueDate}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 获取迁移状态信息
 */
export function getMigrationStatus(): {
  currentVersion: number;
  targetVersion: number;
  needsMigration: boolean;
  lastMigration?: MigrationLogEntry;
} {
  const log = getMigrationLog();
  const lastMigration = log[log.length - 1];
  
  return {
    currentVersion: getStoredDataVersion(),
    targetVersion: CURRENT_TASK_VERSION,
    needsMigration: needsMigration(),
    lastMigration,
  };
} 