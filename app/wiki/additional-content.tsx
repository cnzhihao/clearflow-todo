import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Target, 
  Code, 
  Palette, 
  Globe, 
  Smartphone, 
  Monitor,
  Settings,
  Sparkles,
  CheckCircle2,
  Database,
  Server
} from "lucide-react"

export function GettingStartedContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">快速上手指南</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          跟随本指南，您可以在几分钟内开始使用清流待办管理您的任务。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">第一步：访问工作台</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-emerald-600">
              点击导航栏中的"进入工作台"按钮，或直接访问 /workspace 页面开始使用。
            </p>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-emerald-700 font-medium">💡 提示</p>
              <p className="text-emerald-600 mt-1">工作台是您管理所有任务的中心，包含AI分析和任务管理两个主要功能。</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">第二步：使用AI智能分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-emerald-600">
              <li>在"AI智能分析"标签页中，找到文本输入框</li>
              <li>输入您的想法、会议记录或任何包含任务的文本内容</li>
              <li>点击"AI智能提取"按钮，等待AI分析</li>
              <li>查看AI推理过程和提取的任务建议</li>
              <li>选择您需要的任务，点击"采纳"添加到今日待办</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">第三步：管理您的任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">手动添加任务</h4>
                <ul className="text-emerald-600 space-y-1">
                  <li>• 在"今日待办"区域输入任务标题</li>
                  <li>• 点击"添加"按钮创建新任务</li>
                  <li>• 使用复选框标记任务完成</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">任务操作</h4>
                <ul className="text-emerald-600 space-y-1">
                  <li>• 点击复选框标记完成/未完成</li>
                  <li>• 使用删除按钮移除不需要的任务</li>
                  <li>• 查看任务统计和完成进度</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AIAnalysisContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">AI智能分析详解</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          了解清流待办的AI分析引擎如何工作，以及如何最大化利用AI功能。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <Brain className="w-6 h-6" />
              AI分析原理
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-emerald-600">
              清流待办使用OpenRouter平台的DeepSeek R1模型进行智能文本分析。该模型经过专门训练，能够理解中文和英文内容，识别其中的可执行任务。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Brain className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">语义理解</h4>
                <p className="text-sm text-emerald-600">深度理解文本语义和上下文关系</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Target className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">任务识别</h4>
                <p className="text-sm text-emerald-600">自动识别动作词汇和可执行项目</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Settings className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">结构化输出</h4>
                <p className="text-sm text-emerald-600">生成结构化的任务数据</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">使用技巧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2">✅ 最佳实践</h4>
                <ul className="text-green-600 space-y-1">
                  <li>• 提供清晰的上下文信息</li>
                  <li>• 使用具体的动作词汇（如"完成"、"准备"、"联系"）</li>
                  <li>• 包含时间信息和截止日期</li>
                  <li>• 一次输入相关联的内容</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">❌ 避免的情况</h4>
                <ul className="text-red-600 space-y-1">
                  <li>• 过于简短或模糊的描述</li>
                  <li>• 纯粹的思考或观点表达</li>
                  <li>• 没有明确行动指向的内容</li>
                  <li>• 过于复杂的嵌套逻辑</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">示例场景</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-emerald-700 mb-3">📝 会议记录分析</h4>
                <div className="bg-slate-100 p-4 rounded-lg mb-3">
                  <p className="text-slate-700 italic">
                    "今天的项目会议确定了几个关键行动项：张三负责在下周五前完成用户界面设计稿，李四需要准备数据库架构文档，我要联系客户确认最终需求，另外还要安排下次评审会议。"
                  </p>
                </div>
                <p className="text-emerald-600 text-sm">
                  AI将自动识别出4个具体任务，包括负责人、截止时间和优先级。
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-emerald-700 mb-3">💼 项目规划分析</h4>
                <div className="bg-slate-100 p-4 rounded-lg mb-3">
                  <p className="text-slate-700 italic">
                    "新产品发布前需要完成市场调研报告，准备产品宣传材料，培训销售团队，建立客户支持流程，测试所有功能模块。"
                  </p>
                </div>
                <p className="text-emerald-600 text-sm">
                  AI将提取出5个并行任务，并根据逻辑关系建议优先级。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function TaskManagementContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">任务管理系统</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          深入了解清流待办的任务管理功能，掌握高效的任务组织和跟踪方法。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">任务数据结构</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto">
              <pre>{`interface Task {
  id: string              // 唯一标识符
  title: string           // 任务标题
  description?: string    // 任务描述（可选）
  completed: boolean      // 完成状态
  priority: 'high' | 'medium' | 'low'  // 优先级
  category?: string       // 任务分类
  deadline?: string       // 截止时间
  createdAt: string      // 创建时间
  source: 'manual' | 'ai' // 来源类型
}`}</pre>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800">任务操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-medium text-emerald-700">标记完成</h4>
                  <p className="text-sm text-emerald-600">点击复选框切换完成状态</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-medium text-emerald-700">手动创建</h4>
                  <p className="text-sm text-emerald-600">输入标题快速添加新任务</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <Brain className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-medium text-emerald-700">AI生成</h4>
                  <p className="text-sm text-emerald-600">从AI建议中采纳任务</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-emerald-800">数据持久化</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-700">本地存储</h4>
                  <p className="text-sm text-blue-600">使用LocalStorage保存数据</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Monitor className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-700">自动同步</h4>
                  <p className="text-sm text-blue-600">实时保存所有更改</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-700">状态管理</h4>
                  <p className="text-sm text-blue-600">React Hook统一管理</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-emerald-800">统计功能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">总数</div>
                <div className="text-sm text-emerald-500">全部任务</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">已完成</div>
                <div className="text-sm text-green-500">完成任务</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">待处理</div>
                <div className="text-sm text-orange-500">未完成任务</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">完成率</div>
                <div className="text-sm text-purple-500">百分比统计</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 占位符组件，需要时可以进一步扩展
export function AIEngineContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">AI分析引擎</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          深入了解清流待办AI分析引擎的技术实现和工作原理。
        </p>
      </div>
      
      <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-emerald-800">技术栈</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-700 mb-2">OpenRouter平台</h4>
              <p className="text-emerald-600 text-sm">统一的AI模型访问接口</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-700 mb-2">DeepSeek R1模型</h4>
              <p className="text-emerald-600 text-sm">强大的中英文理解能力</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="p-8 text-center text-emerald-600">
        <Brain className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>详细技术文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function TaskSystemContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">任务系统架构</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          了解任务系统的设计理念和技术实现细节。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Target className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>任务系统架构文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function UIComponentsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">UI组件库</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          探索清流待办使用的UI组件库和设计系统。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Palette className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>UI组件库详细文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function InternationalizationContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">国际化实现</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          了解清流待办的多语言支持实现方案。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Globe className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>国际化实现文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function FrontendContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">前端架构</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          深入了解前端技术架构和开发模式。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Monitor className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>前端架构文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function APIContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">API接口文档</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          详细的API接口说明和使用指南。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Server className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>API接口文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function ComponentsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">组件库详解</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          组件库的使用方法和最佳实践。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Code className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>组件库详细文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function DeploymentContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">部署配置</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          项目部署和配置的完整指南。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Settings className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>部署配置文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function ColorsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">色彩体系</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          清流待办的色彩设计理念和使用规范。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Palette className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>色彩体系文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function TypographyContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">字体排版</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          字体选择和排版设计的指导原则。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Code className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>字体排版文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
}

export function ResponsiveContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">响应式设计</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          移动端适配和响应式设计的实现方案。
        </p>
      </div>
      
      <div className="p-8 text-center text-emerald-600">
        <Smartphone className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
        <p>响应式设计文档正在完善中，敬请期待...</p>
      </div>
    </div>
  )
} 