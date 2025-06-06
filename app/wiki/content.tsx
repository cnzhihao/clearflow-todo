import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  ArrowRight,
  Database,
  Server,
  Layout,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function IntroductionContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">清流待办 - AI驱动的智能任务管理</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          清流待办是一款基于人工智能技术的现代化任务管理应用，旨在帮助用户从复杂的想法和文字内容中自动提取可执行的待办任务，让任务管理变得更加高效和智能。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Brain className="w-5 h-5" />
              AI智能核心
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-600">
              集成OpenRouter AI服务，使用DeepSeek R1模型进行智能文本分析，自动识别和提取可执行的任务项目。
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Target className="w-5 h-5" />
              任务管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-600">
              提供完整的任务生命周期管理，包括创建、编辑、标记完成、删除等功能，支持优先级和分类管理。
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Globe className="w-5 h-5" />
              多语言支持
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-600">
              完整的中英文双语界面，支持语言切换，为不同语言用户提供本地化体验。
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Smartphone className="w-5 h-5" />
              响应式设计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-emerald-600">
              采用移动端优先的设计理念，完美适配各种设备尺寸，提供一致的用户体验。
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-emerald-800">技术亮点</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Next.js 15</Badge>
              <span className="text-emerald-600">App Router</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">React 19</Badge>
              <span className="text-emerald-600">Server Components</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">TypeScript</Badge>
              <span className="text-emerald-600">类型安全</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Tailwind CSS</Badge>
              <span className="text-emerald-600">原子化CSS</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Shadcn UI</Badge>
              <span className="text-emerald-600">组件库</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">OpenAI</Badge>
              <span className="text-emerald-600">AI集成</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function FeaturesContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">核心功能特性</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          清流待办提供了一套完整的AI驱动任务管理解决方案，涵盖从智能分析到任务执行的全流程。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              AI智能任务提取
            </CardTitle>
            <CardDescription className="text-emerald-600">
              使用先进的AI技术自动分析文本内容，识别并提取可执行的待办任务
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-700">支持的输入格式</h4>
                <ul className="text-emerald-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    会议记录和纪要
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    项目计划文档
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    邮件和消息内容
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    自由文本和想法记录
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-700">AI分析能力</h4>
                <ul className="text-emerald-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    自动识别动作词汇
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    提取时间和截止日期
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    判断任务优先级
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    任务分类和标签
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              智能任务管理
            </CardTitle>
            <CardDescription className="text-emerald-600">
              完整的任务生命周期管理，从创建到完成的全流程跟踪
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">智能创建</h4>
                <p className="text-sm text-emerald-600">AI辅助任务创建和优化</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <Settings className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">灵活管理</h4>
                <p className="text-sm text-emerald-600">支持编辑、分类、优先级设置</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-700">进度跟踪</h4>
                <p className="text-sm text-emerald-600">实时统计和完成率监控</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              用户体验特性
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-emerald-700 mb-3">界面设计</h4>
                <ul className="space-y-2 text-emerald-600">
                  <li>• 现代化毛玻璃效果</li>
                  <li>• 流畅的动画过渡</li>
                  <li>• 多层次阴影系统</li>
                  <li>• 绿色稳重主题色</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 mb-3">交互体验</h4>
                <ul className="space-y-2 text-emerald-600">
                  <li>• 实时AI推理显示</li>
                  <li>• 打字机效果文本展示</li>
                  <li>• 拖拽排序支持</li>
                  <li>• 快捷键操作</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ArchitectureContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-4">技术架构</h1>
        <p className="text-xl text-emerald-700 leading-relaxed">
          清流待办采用现代化的技术栈构建，确保高性能、可扩展性和良好的开发体验。
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-emerald-800">
              <Layers className="w-6 h-6" />
              架构层次
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">UI</div>
                <div>
                  <h4 className="font-semibold text-emerald-800">用户界面层</h4>
                  <p className="text-emerald-600">React 19 + Shadcn UI + Tailwind CSS</p>
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-emerald-400 mx-auto" />
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">API</div>
                <div>
                  <h4 className="font-semibold text-blue-800">API服务层</h4>
                  <p className="text-blue-600">Next.js App Router API Routes</p>
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-emerald-400 mx-auto" />
              
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                <div>
                  <h4 className="font-semibold text-purple-800">AI服务层</h4>
                  <p className="text-purple-600">OpenRouter + DeepSeek R1 模型</p>
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-emerald-400 mx-auto" />
              
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">DB</div>
                <div>
                  <h4 className="font-semibold text-orange-800">数据存储层</h4>
                  <p className="text-orange-600">LocalStorage (客户端存储)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Monitor className="w-5 h-5" />
                前端技术栈
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">Next.js</span>
                <Badge className="bg-emerald-100 text-emerald-700">v15.2.4</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">React</span>
                <Badge className="bg-emerald-100 text-emerald-700">v19</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">TypeScript</span>
                <Badge className="bg-emerald-100 text-emerald-700">v5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">Tailwind CSS</span>
                <Badge className="bg-emerald-100 text-emerald-700">v3.4</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Server className="w-5 h-5" />
                后端服务
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">API Routes</span>
                <Badge className="bg-emerald-100 text-emerald-700">Next.js</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">AI服务</span>
                <Badge className="bg-emerald-100 text-emerald-700">OpenRouter</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">模型</span>
                <Badge className="bg-emerald-100 text-emerald-700">DeepSeek R1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600">存储</span>
                <Badge className="bg-emerald-100 text-emerald-700">LocalStorage</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Code className="w-5 h-5" />
              项目结构
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto">
              <pre>{`clearflow-todo/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面 (产品介绍)
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── workspace/         # 工作台
│   │   └── page.tsx       # 任务管理界面
│   ├── wiki/              # 文档中心
│   │   ├── page.tsx       # Wiki主页面
│   │   └── content.tsx    # Wiki内容组件
│   │   └── layout.tsx    # Wiki布局
│   └── api/               # API路由
│       └── analyze/       # AI分析接口
│           └── route.ts
├── components/            # React组件
│   ├── ui/               # Shadcn UI组件库
│   ├── AIReasoningDisplay.tsx
│   ├── LanguageSwitcher.tsx
│   └── theme-provider.tsx
├── hooks/                # 自定义Hooks
│   ├── useTasks.ts       # 任务管理逻辑
│   ├── use-mobile.tsx    # 移动端检测
│   └── use-toast.ts      # 通知系统
├── lib/                  # 工具函数
├── public/               # 静态资源
└── styles/               # 样式文件`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 