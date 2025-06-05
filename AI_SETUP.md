# AI 智能分析配置说明

## 概述

本项目集成了 DeepSeek-R1 模型，通过 OpenRouter 提供智能任务分析和提取功能。DeepSeek-R1 是一个推理模型，能够展示完整的思考过程，非常适合任务分解和分析。

## 配置步骤

### 1. 获取 OpenRouter API 密钥

1. 访问 [OpenRouter](https://openrouter.ai/keys)
2. 注册账户并登录
3. 生成新的 API 密钥
4. 复制 API 密钥备用

### 2. 配置环境变量

创建 `.env.local` 文件在项目根目录：

```bash
# OpenRouter API Key for DeepSeek-R1 integration
OPENROUTER_API_KEY=your_api_key_here

# Optional: Site information for OpenRouter rankings
SITE_URL=http://localhost:3000
SITE_NAME=Clearflow Todo

# Development
NEXT_PUBLIC_APP_ENV=development
```

### 3. 重启开发服务器

```bash
pnpm dev
```

## 功能特性

### AI 推理过程展示

- ✨ **实时打字机效果**：逐字符显示 AI 的推理过程
- 🧠 **完整思考轨迹**：展示 DeepSeek-R1 的完整推理步骤
- 📝 **结构化输出**：自动提取并结构化任务列表

### 任务提取功能

- 🎯 **智能识别**：从复杂文本中识别可执行任务
- 📊 **优先级分析**：AI 自动分析任务优先级
- 🏷️ **分类标签**：自动为任务添加类别标签
- ⏰ **截止日期识别**：智能识别时间相关信息

### 推理过程处理

程序会实时处理 DeepSeek-R1 的输出：

1. **流式接收**：实时接收 AI 推理过程
2. **内容解析**：解析推理文本和结构化数据
3. **任务提取**：从推理结果中提取任务列表
4. **交互确认**：用户可选择采纳或忽略 AI 建议

## API 调用示例

```typescript
// API 路由: /api/analyze
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ inputText }),
});

// 流式读取响应
const reader = response.body?.getReader();
// ... 处理流式数据
```

## 使用提示

### 最佳输入格式

为了获得最佳的任务提取效果，建议输入包含：

- 📋 **明确的动作词**："完成"、"准备"、"联系"、"更新"
- 📅 **时间信息**："下周一前"、"今天"、"本月底"
- 👥 **责任人信息**："联系张三"、"与团队讨论"
- 📄 **具体内容**："准备方案文档"、"更新项目报告"

### 示例输入

```
今天开会讨论了新项目启动事项：
1. 需要准备详细的项目方案文档，包含需求分析和技术方案
2. 联系设计师李小美确认UI设计稿，重点关注用户界面交互
3. 下周一前完成原型开发，使用 Figma 进行设计
4. 安排与客户的需求确认会议，发邮件给王总确认时间
5. 更新项目时间轴，确保各个节点按时完成
```

### 预期输出

AI 会分析并提取如下结构化任务：

- ✅ 准备项目方案文档（高优先级，开发类）
- ✅ 联系设计师确认UI稿（中优先级，设计类）
- ✅ 完成原型开发（高优先级，开发类，截止：下周一）
- ✅ 安排客户需求会议（中优先级，沟通类）
- ✅ 更新项目时间轴（低优先级，管理类）

## 故障排除

### 常见问题

1. **API 密钥错误**
   - 检查 `.env.local` 文件是否正确配置
   - 确认 API 密钥有效且有足够额度

2. **网络连接问题**
   - 检查网络连接
   - 确认 OpenRouter 服务状态

3. **推理结果解析失败**
   - AI 模型可能返回非标准格式
   - 程序会自动降级处理，提取可识别的任务

### 调试信息

开启浏览器开发者工具，查看 Console 面板获取详细错误信息。

## 费用说明

- DeepSeek-R1 在 OpenRouter 上提供免费额度
- 具体费用请查看 [OpenRouter 定价页面](https://openrouter.ai/models)
- 建议监控 API 使用量，避免超额

## 技术实现

- **后端**: Next.js API Routes
- **AI 模型**: DeepSeek-R1 (deepseek/deepseek-r1-0528:free)
- **流式处理**: Server-Sent Events (SSE)
- **前端**: React + TypeScript
- **状态管理**: Custom Hooks + localStorage

## 支持的功能

- [x] 实时 AI 推理过程展示
- [x] 结构化任务提取
- [x] 任务优先级分析
- [x] 任务分类标签
- [x] 本地数据持久化
- [x] 多语言界面支持
- [x] 响应式设计

---

**注意**: 请妥善保管您的 API 密钥，不要将其提交到代码仓库中。 