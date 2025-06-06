# 清流待办项目一周迭代开发计划

## 项目概述
基于现有的AI驱动任务管理应用，实现用户体验升级和功能扩展。主要目标是将首页改为直接输入体验，升级任务管理为任务板，并新增今日事功能。

## 开发时间安排
**总开发时间：7天**
**团队规模：1-2名开发者**

## 核心功能优先级

### 高优先级（MVP核心功能）
1. **首页改版** - 直接输入体验，类似bolt.new
2. **任务规划页面** - AI分析结果展示和任务确认
3. **任务板基础功能** - 替代现有任务管理
4. **今日事功能** - 日程管理核心需求
5. **数据模型升级** - 支持新功能的数据结构

### 中优先级（增强功能）
6. **任务板多视图** - 列表、网格、时间线视图
7. **任务分解功能** - 子任务管理
8. **导航重构** - 统一的用户体验

### 低优先级（优化功能）
9. **移动端优化** - 响应式设计改进
10. **性能优化** - 错误处理和性能提升

## 详细任务清单

### 任务1：首页改版 - 移除营销内容并添加直接输入体验
**复杂度：6/10**
**预计时间：1.5天**

**描述：**
将当前的首页营销内容替换为类似bolt.new的直接输入体验。移除"开始使用"按钮和功能介绍，添加大型输入框让用户直接输入想法。输入后立即调用AI分析API并跳转到任务规划页面。需要保持良好的移动端适配。

**实现要点：**
```typescript
// 新的首页组件结构
export default function HomePage() {
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      // 调用AI分析API
      const result = await analyzeText(inputText)
      // 跳转到任务规划页面并传递结果
      router.push(`/planning?data=${encodeURIComponent(JSON.stringify(result))}`)
    } catch (error) {
      // 错误处理
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <h1>描述你的想法，让AI为你规划任务</h1>
        <Textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例如：今天开会讨论了新项目，需要准备方案文档，联系设计师确认UI稿，下周一前完成原型开发..."
          className="min-h-[200px]"
        />
        <Button onClick={handleAnalyze} disabled={!inputText.trim() || isAnalyzing}>
          {isAnalyzing ? "AI正在分析..." : "生成任务规划"}
        </Button>
      </div>
    </div>
  )
}
```

### 任务2：创建任务规划页面
**复杂度：7/10**
**预计时间：1天**

**描述：**
创建新的任务规划页面(/planning)，展示AI分析结果和提取的任务列表。用户可以编辑、确认或删除AI建议的任务，然后一键添加到任务板。这个页面是首页输入后的承接页面，需要提供良好的任务编辑体验。

**实现要点：**
```typescript
// app/planning/page.tsx
export default function PlanningPage() {
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [analysisResult, setAnalysisResult] = useState("")
  
  useEffect(() => {
    // 从URL参数获取AI分析结果
    const data = searchParams.get('data')
    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data))
      setAnalysisResult(parsed.reasoning)
      setTasks(parsed.tasks)
    }
  }, [])
  
  const handleTaskEdit = (index: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, ...updates } : task
    ))
  }
  
  const handleConfirmAll = () => {
    // 添加所有任务到任务板
    tasks.forEach(task => addTaskToBoard(task))
    router.push('/board')
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1>AI为你规划的任务</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2>分析过程</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {analysisResult}
          </div>
        </div>
        <div>
          <h2>提取的任务</h2>
          {tasks.map((task, index) => (
            <TaskEditCard 
              key={index}
              task={task}
              onEdit={(updates) => handleTaskEdit(index, updates)}
              onDelete={() => setTasks(prev => prev.filter((_, i) => i !== index))}
            />
          ))}
          <Button onClick={handleConfirmAll}>确认并添加到任务板</Button>
        </div>
      </div>
    </div>
  )
}
```

### 任务3：升级任务数据模型
**复杂度：5/10**
**预计时间：0.5天**

**描述：**
扩展当前的Task接口，添加支持任务板和今日事功能所需的字段。包括开始日期、截止日期、标签、父任务ID（用于任务分解）、估计时长等。同时实现数据迁移逻辑，确保现有用户数据不丢失。

**实现要点：**
```typescript
// 新的Task接口定义
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category?: string;
  tags: string[];
  
  // 新增字段
  startDate?: string; // ISO日期字符串
  dueDate?: string;   // ISO日期字符串
  estimatedHours?: number;
  parentTaskId?: string; // 用于任务分解
  subtasks: string[]; // 子任务ID数组
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  
  createdAt: string;
  updatedAt: string;
  source: 'manual' | 'ai';
}

// 数据迁移函数
function migrateTaskData(oldTasks: OldTask[]): Task[] {
  return oldTasks.map(oldTask => ({
    ...oldTask,
    tags: [],
    subtasks: [],
    status: oldTask.completed ? 'completed' : 'todo',
    updatedAt: oldTask.createdAt,
    // 其他新字段使用默认值
  }))
}
```

### 任务4：创建任务板页面基础架构
**复杂度：8/10**
**预计时间：1.5天**

**描述：**
创建新的任务板页面(/board)替代当前的workspace页面。实现基础的任务显示、添加、编辑、删除功能。包括任务卡片组件、筛选器、搜索功能。为后续的多视图切换预留架构。

### 任务5：实现任务板多视图切换
**复杂度：7/10**
**预计时间：1天**

**描述：**
为任务板添加列表视图、网格视图和时间线视图。列表视图显示详细信息，网格视图适合快速浏览，时间线视图按时间轴排列任务。每种视图都要支持拖拽排序和基础操作。

### 任务6：实现任务分解和编辑功能
**复杂度：6/10**
**预计时间：1天**

**描述：**
在任务板中添加任务分解功能，允许用户将复杂任务拆分为子任务。实现任务编辑对话框，支持修改任务的所有属性（标题、描述、优先级、日期、标签等）。子任务可以在父任务卡片中展示和管理。

### 任务7：创建今日事功能页面
**复杂度：7/10**
**预计时间：1天**

**描述：**
创建今日事页面(/today)，自动筛选出开始日期为今天的任务。提供专注的今日任务视图，支持任务状态快速切换、批量操作。添加任务调度功能，可以将任务移动到明天或其他日期。

### 任务8：重构导航和路由结构
**复杂度：4/10**
**预计时间：0.5天**

**描述：**
更新应用的导航结构，添加新的页面路由。创建统一的导航栏组件，支持在首页、任务板、今日事之间切换。移除或重构原有的workspace页面，确保用户体验的连贯性。

### 任务9：优化移动端体验和响应式设计
**复杂度：5/10**
**预计时间：0.5天**

**描述：**
确保所有新页面和组件在移动设备上都有良好的体验。优化触摸交互、手势操作，调整布局适配小屏幕。特别关注首页输入框、任务板视图切换、今日事的移动端操作体验。

### 任务10：性能优化和错误处理
**复杂度：4/10**
**预计时间：0.5天**

**描述：**
优化应用性能，包括任务列表的虚拟滚动、图片懒加载、组件懒加载等。完善错误边界和错误处理机制，添加加载状态和空状态的友好提示。确保AI分析失败时有合适的降级方案。

## 技术架构决策

### 保持现有技术栈
- Next.js 15 + React 19
- TypeScript + Tailwind CSS
- Shadcn UI + Radix UI
- 本地存储（localStorage）

### 新增技术考虑
- 数据迁移策略
- 路由结构重构
- 状态管理优化

## 风险控制

### 主要风险
1. 数据结构变更可能导致现有数据丢失
2. 一周时间可能不够完成所有功能
3. AI分析功能的稳定性问题

### 应对策略
1. 实现数据版本控制和自动迁移
2. 优先完成核心功能，次要功能可简化
3. 加强错误边界和降级方案

## 开发时间线

### 第1-2天：核心用户体验
- ✅ 首页改版（1.5天）
- ✅ 任务规划页面（0.5天）

### 第3天：数据基础
- ✅ 数据模型升级（0.5天）
- ✅ 任务板基础架构（开始，0.5天）

### 第4天：任务板完善
- ✅ 任务板基础架构（完成，1天）

### 第5天：高级功能
- ✅ 任务板多视图（1天）

### 第6天：任务管理增强
- ✅ 任务分解和编辑功能（0.5天） 
- ✅ 今日事功能（0.5天）

### 第7天：完善和优化
- ✅ 导航重构（0.5天）
- ✅ 移动端优化（0.25天）
- ✅ 性能优化（0.25天）

## 成功指标
- ✅ 用户能够通过首页直接生成任务
- ✅ 任务板基础功能可用且体验良好
- ✅ 今日事功能能够正常筛选和管理当日任务
- ✅ 整体用户体验流畅，无重大bug
- ✅ 移动端基本可用

## 后续迭代规划
延后到下个迭代的功能：
- 任务档案和工作报告生成
- AI今日总结功能
- 复杂的思维网视图
- 高级任务分解和依赖管理

这个计划在一周内是可行的，同时为未来迭代留下了清晰的发展路径。

## 备注
- 本文档最后更新：2025-06-06
- 计划制定者：AI Assistant
- 项目代号：clearflow-todo-v2 