# 清流待办 (Clearflow To-Do)

> AI 驱动的智能任务管理应用

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ 项目简介

清流待办是一款基于 AI 技术的智能任务管理应用，帮助用户从复杂的想法和文字内容中自动提取可执行的待办任务，让任务管理变得更加高效和智能。

### 🎯 核心功能

- **🤖 AI 智能任务提取**: 输入大段文字，AI 自动识别并提取可执行的待办任务
- **📝 智能分析建议**: AI 分析任务复杂度，提供分解建议和优先级排序
- **📊 进度可视化**: 清晰的任务统计和完成进度，让工作状态一目了然
- **🌐 多语言支持**: 支持中文和英文界面切换
- **📱 响应式设计**: 完美适配桌面端和移动端

### 🛠️ 技术栈

#### 前端框架
- **Next.js 15** - 基于 App Router 的现代化 React 框架
- **React 19** - 最新版本的 React 库
- **TypeScript** - 类型安全的 JavaScript 超集

#### UI 组件库
- **Shadcn UI** - 高质量的 React 组件库
- **Radix UI** - 无障碍访问的底层组件
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 美观的 SVG 图标库

#### 功能库
- **React Hook Form** - 高性能的表单处理
- **Zod** - TypeScript 优先的模式验证
- **Next Themes** - 主题系统支持
- **Sonner** - 优雅的通知组件

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐) 或 npm >= 9.0.0

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

## ☁️ 部署

本项目推荐使用 [Vercel](https://vercel.com/) 进行部署。通过 `vercel.json` 配置，项目可以实现自动化构建和部署。

### Vercel 部署步骤

1. **创建 Vercel 账号**: 如果您还没有 Vercel 账号，请访问 [vercel.com](https://vercel.com/) 注册。
2. **连接 Git 仓库**: 在 Vercel 控制台连接您的 GitHub/GitLab/Bitbucket 仓库。
3. **自动部署**: 每次向 `main` 或 `dev` 分支推送代码时，Vercel 都会自动构建并部署最新版本。

## 📁 项目结构

```
clearflow-todo/
├── app/                    # Next.js App Router 页面目录
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 主页 (产品介绍)
│   ├── globals.css        # 全局样式
│   └── workspace/         # 工作台页面
│       └── page.tsx       # 工作台主页面
├── components/            # React 组件
│   └── ui/               # Shadcn UI 组件库
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数和配置
├── public/               # 静态资源
├── styles/               # 样式文件
├── components.json       # Shadcn UI 配置
├── next.config.mjs       # Next.js 配置
├── tailwind.config.ts    # Tailwind CSS 配置
└── tsconfig.json         # TypeScript 配置
```

## 🎨 设计系统

### 颜色主题
- **主色调**: 蓝色到紫色的渐变 (`from-blue-500 to-purple-600`)
- **背景**: 浅灰色渐变 (`from-slate-50 via-white to-blue-50/30`)
- **文字**: 深灰色系 (`text-slate-900`, `text-slate-600`)

### 设计特色
- **现代化 UI**: 采用毛玻璃效果 (`backdrop-blur`)
- **流畅动画**: 丰富的过渡动画效果
- **阴影设计**: 多层次的阴影系统
- **响应式布局**: 移动端优先的设计理念

## 🌐 功能页面

### 主页 (`/`)
- 产品功能介绍
- 核心特性展示
- 工作流程说明
- 多语言切换

### 工作台 (`/workspace`)
- **AI 智能分析**: 文本输入和 AI 任务提取
- **任务管理**: 今日待办事项管理
- **统计面板**: 任务完成进度和统计

## 📝 开发说明

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用函数式组件和 React Hooks
- 采用声明式编程风格

### 组件开发
- 优先使用 Shadcn UI 组件
- 自定义组件放在 `components/` 目录
- 遵循组件复用和模块化原则

### 样式开发
- 使用 Tailwind CSS 实用类
- 响应式设计优先
- 保持设计系统一致性

## 🔧 可用脚本

```bash
# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Shadcn UI](https://ui.shadcn.com/) - React 组件库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 底层组件库
- [Lucide](https://lucide.dev/) - 图标库

---

<div align="center">
  <p>如果这个项目对您有帮助，请给它一个 ⭐</p>
  <p>Made with ❤️ by AI & Human</p>
</div> 