# API 设置说明

## OpenRouter API 配置

清流待办应用使用 OpenRouter API 来提供 AI 任务分析功能。

### 1. 获取 API 密钥

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账户并登录
3. 前往 [API Keys 页面](https://openrouter.ai/keys)
4. 创建新的 API 密钥

### 2. 配置环境变量

1. 复制 `.env.example` 文件为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，添加你的 API 密钥：
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

3. 重启开发服务器：
   ```bash
   npm run dev
   ```

### 3. 测试 AI 功能

1. 在应用中输入一些文本（如会议记录、项目描述等）
2. 点击"生成任务规划"按钮
3. 查看 AI 分析结果和提取的任务

### 4. 开发模式

如果没有配置 API 密钥，应用会自动使用模拟响应，显示示例任务，方便开发和测试。

### 5. 故障排除

如果遇到问题，请检查：

1. **控制台日志**：打开浏览器开发者工具查看详细的调试信息
2. **API 密钥**：确保密钥正确且有效
3. **网络连接**：确保能够访问 OpenRouter API
4. **环境变量**：确保 `.env.local` 文件在项目根目录

### 6. 支持的模型

当前使用的模型：`deepseek/deepseek-r1-0528:free`

这是一个免费的模型，适合开发和测试使用。如需更高质量的分析结果，可以在 `app/api/analyze/route.ts` 中更换为其他模型。 