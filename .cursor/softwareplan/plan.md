# 软件开发计划

## 目标: 基于冗余代码检测报告，清理项目中未使用的代码和依赖，优化项目结构和性能

**创建时间**: 2025/6/10 11:27:04
**最后更新**: 2025/6/10 11:33:49

### 进度概览

- **任务进度**: 9/14 (64%)
- **复杂度进度**: 24/49 (49%)

### 任务列表

1. ⏳ **# 项目代码清理和优化计划** (复杂度: 5)
   - # 项目代码清理和优化计划
   - 创建时间: 2025/6/10 11:27:13
   - 更新时间: 2025/6/10 11:27:13

2. ⏳ **## 目标** (复杂度: 5)
   - ## 目标
基于冗余代码检测报告，清理项目中未使用的代码和依赖，优化项目结构和性能。
   - 创建时间: 2025/6/10 11:27:13
   - 更新时间: 2025/6/10 11:27:13

3. ⏳ **## 背景分析** (复杂度: 5)
   - ## 背景分析
通过代码分析发现项目中存在大量未使用的代码：
- Workspace页面系统 (~23KB)
- Wiki页面系统 (~50KB) 
- 未使用的组件和hooks
- 冗余的NPM依赖包
- 大量未使用的UI组件
   - 创建时间: 2025/6/10 11:27:13
   - 更新时间: 2025/6/10 11:27:13

4. ⏳ **## 清理策略** (复杂度: 5)
   - ## 清理策略
按照优先级分阶段进行清理：
1. **高优先级**: 完全未使用的页面和功能
2. **中优先级**: 依赖于高优先级代码的组件
3. **低优先级**: 可选的UI组件优化
   - 创建时间: 2025/6/10 11:27:13
   - 更新时间: 2025/6/10 11:27:13

5. ⏳ **## 预期收益** (复杂度: 5)
   - ## 预期收益
- 减少代码库大小 ~100KB
- 减少node_modules体积 50-100MB
- 提升构建性能 20-30%
- 简化项目维护复杂度
   - 创建时间: 2025/6/10 11:27:13
   - 更新时间: 2025/6/10 11:27:13

6. ✅ **删除Workspace页面系统** (复杂度: 2)
   - 删除完整的workspace页面及其相关文件。包括删除app/workspace/page.tsx文件，这是一个23KB的大文件，包含555行代码的传统任务管理界面。此页面完全未被项目中的其他部分引用，可以安全删除。
   - 代码示例:
```
// 需要删除的文件:
// app/workspace/page.tsx (23KB, 555行)
```
   - 创建时间: 2025/6/10 11:27:18
   - 更新时间: 2025/6/10 11:28:49

7. ✅ **删除Wiki页面系统** (复杂度: 3)
   - 删除完整的wiki页面系统，包括所有相关文件。这是项目中最大的冗余部分，总计约50KB代码。包括主页面、内容组件和附加内容组件，完全未被项目引用。
   - 代码示例:
```
// 需要删除的文件:
// app/wiki/page.tsx (9.7KB, 272行)
// app/wiki/content.tsx (19KB, 427行)  
// app/wiki/additional-content.tsx (22KB, 535行)
```
   - 创建时间: 2025/6/10 11:27:26
   - 更新时间: 2025/6/10 11:29:11

8. ✅ **删除未使用的NPM依赖包** (复杂度: 4)
   - 删除package.json中未被实际使用的NPM依赖包，包括React Hook Form相关包、Zod验证库、Date-fns和React-scan等。这将显著减少node_modules大小和构建时间。
   - 代码示例:
```
// 需要从package.json删除的依赖:
{
  "@hookform/resolvers": "^3.9.1",
  "react-hook-form": "^7.54.1", 
  "zod": "^3.24.1",
  "date-fns": "4.1.0",
  "react-scan": "^0.3.4"
}
```
   - 创建时间: 2025/6/10 11:27:32
   - 更新时间: 2025/6/10 11:30:10

9. ✅ **删除Theme Provider组件** (复杂度: 1)
   - 删除未被使用的theme-provider.tsx组件。这个组件虽然小（292B），但完全未被项目使用，删除可以简化项目结构。
   - 代码示例:
```
// 需要删除的文件:
// components/theme-provider.tsx (292B, 12行)
```
   - 创建时间: 2025/6/10 11:27:38
   - 更新时间: 2025/6/10 11:28:30

10. ✅ **删除AIReasoningDisplay组件** (复杂度: 2)
   - 删除AIReasoningDisplay组件，该组件仅被workspace页面使用。在删除workspace页面后，此组件变为冗余代码。这是一个6.9KB的组件，包含200行代码。
   - 代码示例:
```
// 需要删除的文件:
// components/AIReasoningDisplay.tsx (6.9KB, 200行)
// 此组件仅被workspace页面引用
```
   - 创建时间: 2025/6/10 11:27:44
   - 更新时间: 2025/6/10 11:30:20

11. ✅ **删除useTasks Hook** (复杂度: 3)
   - 删除useTasks.ts hook文件，该hook仅被workspace页面使用。这是一个12KB的文件，包含416行完整的任务管理逻辑。删除workspace页面后此hook变为冗余。
   - 代码示例:
```
// 需要删除的文件:
// hooks/useTasks.ts (12KB, 416行)
// 包含完整的任务管理逻辑，仅被workspace使用
```
   - 创建时间: 2025/6/10 11:27:49
   - 更新时间: 2025/6/10 11:30:29

12. ✅ **删除Task Migration工具** (复杂度: 2)
   - 删除task-migration.ts工具文件，该工具仅被useTasks hook使用。这是一个11KB的文件，包含420行任务数据迁移逻辑。删除useTasks后此工具变为冗余。
   - 代码示例:
```
// 需要删除的文件:
// lib/utils/task-migration.ts (11KB, 420行)
// 任务数据迁移工具，仅被useTasks使用
```
   - 创建时间: 2025/6/10 11:27:54
   - 更新时间: 2025/6/10 11:30:38

13. ✅ **清理Task Types定义** (复杂度: 4)
   - 清理lib/types/task.ts中与workspace相关的类型定义。保留可能在其他地方使用的基础类型，删除仅用于workspace功能的复杂类型定义。
   - 代码示例:
```
// 需要检查和清理的文件:
// lib/types/task.ts (11KB, 441行)
// 保留基础类型，删除workspace专用类型
```
   - 创建时间: 2025/6/10 11:27:59
   - 更新时间: 2025/6/10 11:31:07

14. ✅ **验证和测试清理结果** (复杂度: 3)
   - 在完成所有删除操作后，验证项目的完整性。检查是否有遗漏的引用、确保构建成功、测试核心功能正常工作。运行npm install清理node_modules。
   - 代码示例:
```
// 验证步骤:
// 1. npm run build - 检查构建
// 2. npm run dev - 测试开发服务器
// 3. 测试核心功能 (首页 -> planning页面)
// 4. npm install - 清理依赖
```
   - 创建时间: 2025/6/10 11:28:06
   - 更新时间: 2025/6/10 11:33:49

## 目标: 实现清流待办应用的移动端响应式设计，确保在手机端完美运行

**创建时间**: 2025/6/10 19:08:11
**最后更新**: 2025/6/10 20:21:39

### 进度概览

- **任务进度**: 8/8 (100%)
- **复杂度进度**: 48/48 (100%)

### 任务列表

1. ✅ **分析当前应用在移动端的问题** (复杂度: 3)
   - 使用浏览器开发工具分析现有页面在不同移动设备尺寸下的显示问题。重点检查：
1. 文本是否过小难以阅读
2. 按钮是否太小难以点击
3. 布局是否重叠或溢出
4. 导航是否在移动端友好
5. 输入框是否适合触摸操作
6. 间距是否合适

测试设备：iPhone SE、iPhone 12、Android 中等尺寸设备
   - 代码示例:
```
// 使用浏览器DevTools测试以下断点：
// 320px (iPhone SE)
// 375px (iPhone 12 mini) 
// 390px (iPhone 12)
// 414px (iPhone 12 Pro Max)
// 768px (iPad竖屏)
```
   - 创建时间: 2025/6/10 19:08:26
   - 更新时间: 2025/6/10 19:09:56

2. ✅ **优化主页面的移动端响应式设计** (复杂度: 6)
   - 采用移动优先策略重构 app/page.tsx，实现以下响应式改进：
1. 标题文字大小自适应（移动端较小，桌面端较大）
2. 文本输入框在移动端占据合适高度
3. 按钮大小适合触摸操作
4. 页面边距和间距优化
5. 示例卡片在移动端堆叠显示
6. header在移动端简化显示
   - 代码示例:
```
// 主要变更示例:
// 标题响应式
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">

// 按钮触摸友好
<Button className="h-12 sm:h-auto px-6 py-3 text-base sm:text-lg">

// 网格响应式
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
```
   - 创建时间: 2025/6/10 19:08:33
   - 更新时间: 2025/6/10 19:13:05

3. ✅ **优化规划页面的移动端布局** (复杂度: 8)
   - 重构 app/planning/page.tsx 以适配移动端，重点改进：
1. 将双栏布局（聊天+任务）改为移动端的单栏可切换布局
2. 优化聊天消息的显示和间距
3. 任务卡片在移动端更好的排列
4. 底部输入栏固定并优化
5. 按钮和交互元素适合触摸
6. 添加移动端导航切换功能
   - 代码示例:
```
// 移动端布局切换示例:
const [activeTab, setActiveTab] = useState<'chat' | 'tasks'>('chat')

// 响应式布局
<div className="flex flex-col md:flex-row">
  {/* 移动端标签切换 */}
  <div className="md:hidden">
    <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
  </div>
  
  {/* 聊天区域 */}
  <div className={`${activeTab === 'chat' ? 'block' : 'hidden'} md:block`}>
    {/* 聊天内容 */}
  </div>
</div>
```
   - 创建时间: 2025/6/10 19:08:42
   - 更新时间: 2025/6/10 19:21:03

4. ✅ **创建移动端优化的UI组件** (复杂度: 5)
   - 创建专门针对移动端优化的公共UI组件：
1. MobileTabSwitcher - 移动端标签切换组件
2. TouchFriendlyButton - 触摸友好的按钮组件
3. MobileDrawer - 移动端抽屉菜单
4. ResponsiveDialog - 适配移动端的对话框
5. MobileInput - 移动端优化的输入组件

这些组件将提高移动端的用户体验和交互便利性。
   - 代码示例:
```
// MobileTabSwitcher 示例:
interface MobileTabSwitcherProps {
  activeTab: string
  tabs: Array<{id: string, label: string, icon?: React.ReactNode}>
  onTabChange: (tab: string) => void
}

// TouchFriendlyButton 示例:
<Button className="min-h-[44px] min-w-[44px] touch-manipulation">
  {/* 44px 是 iOS 推荐的最小触摸目标尺寸 */}
</Button>
```
   - 创建时间: 2025/6/10 19:08:50
   - 更新时间: 2025/6/10 19:13:14

5. ✅ **优化全局样式和Tailwind配置** (复杂度: 4)
   - 优化项目的响应式配置和全局样式：
1. 检查并优化 tailwind.config.ts 中的断点设置
2. 在 globals.css 中添加移动端优化的基础样式
3. 添加触摸设备优化的CSS
4. 设置合适的字体大小和行高
5. 优化滚动行为和触摸反馈
6. 添加安全区域适配（iOS刘海屏等）
   - 代码示例:
```
// tailwind.config.ts 优化
module.exports = {
  theme: {
    screens: {
      'xs': '475px',  // 添加更小的断点
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}

// globals.css 移动端优化
@media (max-width: 768px) {
  body {
    font-size: 16px; /* 防止iOS缩放 */
    -webkit-text-size-adjust: 100%;
  }
}
```
   - 创建时间: 2025/6/10 19:09:01
   - 更新时间: 2025/6/10 19:13:10

6. ✅ **使用Playwright进行移动端功能测试** (复杂度: 6)
   - 使用Playwright MCP工具进行移动端响应式设计的功能验证：
1. 测试不同移动设备尺寸下的页面布局
2. 验证触摸交互功能是否正常
3. 检查移动端导航切换是否流畅
4. 测试输入框在移动端的可用性
5. 验证按钮大小是否适合触摸操作
6. 检查页面滚动和缩放行为
   - 代码示例:
```
// 使用Playwright测试移动端
await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
await page.goto('http://localhost:3000');
await page.click('[data-testid="mobile-menu-button"]');
await page.screenshot({ path: 'mobile-homepage.png' });

// 测试触摸交互
await page.tap('[data-testid="generate-button"]');
await page.waitForSelector('[data-testid="planning-page"]');
```
   - 创建时间: 2025/6/10 19:09:08
   - 更新时间: 2025/6/10 19:21:07

7. ✅ **移动端UI/UX精细化优化** (复杂度: 9)
   - 解决移动端的关键可用性问题：1)修复无法滚动的问题，重构为聊天界面布局模式；2)统一按钮样式，解决不同状态下的显示不一致；3)固定对话输入框和复制按钮在底部；4)优化整体布局协调性和视觉效果；5)确保触摸友好的交互体验
   - 代码示例:
```
// 聊天界面布局模式
<div className="h-screen flex flex-col">
  <Header className="flex-shrink-0" />
  <Messages className="flex-1 overflow-y-auto overscroll-contain" />
  <Input className="flex-shrink-0" />
</div>
```
   - 创建时间: 2025/6/10 19:33:03
   - 更新时间: 2025/6/10 19:38:06

8. ✅ **修复移动端AI对话和任务页面的底部边距问题** (复杂度: 7)
   - 解决以下移动端布局问题：1) AI对话页面按钮超出页面高度问题；2) 任务提取页面按钮超出页面高度问题；3) 提取任务框高度过高的问题；4) 编辑删除按钮位置优化问题
   - 创建时间: 2025/6/10 20:17:36
   - 更新时间: 2025/6/10 20:21:39

## 目标: 为clearflow-todo项目的核心输入框增加语音输入功能，实现语音转文字的功能，包括浏览器兼容性检测、权限管理、UI状态管理和错误处理

**创建时间**: 2025/6/12 09:56:11
**最后更新**: 2025/6/12 12:06:45

### 进度概览

- **任务进度**: 13/13 (100%)
- **复杂度进度**: 56/56 (100%)

### 任务列表

1. ✅ **创建语音输入Hook组件** (复杂度: 7)
   - 创建一个自定义React Hook (useSpeechRecognition) 来封装Web Speech API的功能，包括浏览器兼容性检测、状态管理、事件处理和错误处理。支持中英文语言切换。
   - 代码示例:
```
```typescript
interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn
```
```
   - 创建时间: 2025/6/12 09:57:29
   - 更新时间: 2025/6/12 10:03:36

2. ✅ **创建语音输入按钮组件** (复杂度: 5)
   - 创建一个VoiceInputButton组件，包含麦克风图标和动画效果。在监听状态下显示脉冲动画，支持点击开始/停止语音识别。使用Lucide React图标库。
   - 代码示例:
```
```typescript
interface VoiceInputButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  className?: string;
}

export function VoiceInputButton({ isListening, isSupported, onToggle, className }: VoiceInputButtonProps)
```
```
   - 创建时间: 2025/6/12 09:57:37
   - 更新时间: 2025/6/12 10:03:40

3. ✅ **集成语音输入到主页面Textarea** (复杂度: 6)
   - 将语音输入功能集成到app/page.tsx的主要Textarea组件中。在输入框右侧添加语音输入按钮，处理语音识别结果并更新inputText状态。支持中英文语言切换。
   - 代码示例:
```
```typescript
// 在Textarea容器中添加语音输入按钮
<div className="relative">
  <Textarea
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    // ... 其他props
  />
  <VoiceInputButton
    isListening={isListening}
    isSupported={isSupported}
    onToggle={handleVoiceToggle}
    className="absolute right-3 top-3"
  />
</div>
```
```
   - 创建时间: 2025/6/12 09:57:46
   - 更新时间: 2025/6/12 10:03:43

4. ✅ **添加CSS动画和样式** (复杂度: 3)
   - 在globals.css中添加脉冲动画效果，用于语音监听状态的视觉反馈。创建平滑的动画过渡效果，确保在移动端和桌面端都有良好的视觉体验。
   - 代码示例:
```
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.voice-listening {
  animation: pulse 1.5s infinite;
  color: #4285F4;
}
```
```
   - 创建时间: 2025/6/12 09:57:54
   - 更新时间: 2025/6/12 10:03:46

5. ✅ **添加多语言支持和错误处理** (复杂度: 4)
   - 为语音输入功能添加中英文提示信息，包括权限请求提示、错误消息、使用说明等。在translations对象中添加相关文本，确保用户体验的一致性。
   - 代码示例:
```
```typescript
const translations = {
  zh: {
    // ... 现有翻译
    voiceInput: {
      tooltip: "点击开始语音输入",
      listening: "正在聆听...",
      notSupported: "您的浏览器不支持语音识别",
      permissionDenied: "请允许使用麦克风权限",
      networkError: "网络错误，请检查网络连接"
    }
  },
  en: {
    // ... 现有翻译
    voiceInput: {
      tooltip: "Click to start voice input",
      listening: "Listening...",
      notSupported: "Speech recognition not supported",
      permissionDenied: "Microphone permission denied",
      networkError: "Network error, please check connection"
    }
  }
}
```
```
   - 创建时间: 2025/6/12 09:58:04
   - 更新时间: 2025/6/12 10:03:50

6. ✅ **使用Playwright进行功能测试** (复杂度: 5)
   - 使用Playwright MCP创建自动化测试，验证语音输入功能的UI交互。测试包括：按钮显示/隐藏、点击交互、动画效果、错误状态处理等。由于语音识别需要真实音频输入，主要测试UI层面的功能。
   - 代码示例:
```
```typescript
// 测试场景：
// 1. 检查语音输入按钮是否正确显示
// 2. 点击按钮后状态变化
// 3. 不支持的浏览器中按钮隐藏
// 4. 动画效果是否正确应用
// 5. 错误提示是否正确显示
```
```
   - 创建时间: 2025/6/12 09:58:13
   - 更新时间: 2025/6/12 10:04:59

7. ✅ **优化麦克风按钮位置并在planning页面添加语音输入** (复杂度: 6)
   - 1. 将主页面的麦克风按钮从右上角移动到左下角，提升用户体验；2. 在planning页面的AI对话框中添加语音输入功能，复用现有的语音识别组件；3. 确保不写重复代码，保持代码的可维护性
   - 创建时间: 2025/6/12 10:14:43
   - 更新时间: 2025/6/12 10:16:05

8. ✅ **修复主页面布局问题** (复杂度: 3)
   - 1. 将语音输入按钮和字符计数div的位置互换（语音按钮到右下角，字符计数到左下角）；2. 解决textarea左边大片空白的问题（将pl-12改为pr-12）；3. 确保布局协调美观
   - 创建时间: 2025/6/12 10:58:10
   - 更新时间: 2025/6/12 10:58:14

9. ✅ **修复Planning页面语音按钮位置偏移问题** (复杂度: 2)
   - 解决Planning页面的语音输入按钮在被激活后向下平移的问题，将定位方式从top-1/2 -translate-y-1/2改为bottom-2 right-2的固定位置，并为textarea添加右侧padding避免文字被按钮遮挡
   - 创建时间: 2025/6/12 11:31:17
   - 更新时间: 2025/6/12 11:31:21

10. ✅ **优化输入框布局和语音输入功能** (复杂度: 7)
   - 1. 将主页面的字符计数和语音按钮移到输入框外部的底部控制栏中，避免悬浮元素遮挡文字；2. 修复语音输入覆盖已有内容的问题，改为追加模式；3. 使用Context7查找Web Speech API最佳实践；4. 确保两个页面的语音输入功能一致性
   - 创建时间: 2025/6/12 11:43:41
   - 更新时间: 2025/6/12 11:43:46

11. ✅ **优化主页面输入框focus效果** (复杂度: 3)
   - 根据Context7的Tailwind CSS最佳实践，优化输入框的focus效果：1. 将边框从border-2改为border，避免过粗边框；2. 将焦点环从ring-2改为ring-1，创建更精细的效果；3. 添加focus:outline-none确保没有默认轮廓；4. 使用focus-within在容器级别应用焦点效果，创建更优雅的用户界面
   - 创建时间: 2025/6/12 11:53:54
   - 更新时间: 2025/6/12 11:53:58

12. ✅ **修复输入框黑色外框问题** (复杂度: 2)
   - 移除输入框被激活时显示的黑色outline外框，通过添加outline-none类和style={{ outline: 'none' }}来强制移除浏览器默认样式
   - 创建时间: 2025/6/12 11:58:30
   - 更新时间: 2025/6/12 12:06:36

13. ✅ **根据专家建议优化输入框focus样式** (复杂度: 3)
   - 按照专家建议，添加focus-visible:outline-none、focus-visible:ring-0、focus-visible:ring-offset-0等样式，彻底解决父子元素focus样式冲突问题，移除内联样式，优化代码结构
   - 创建时间: 2025/6/12 12:06:41
   - 更新时间: 2025/6/12 12:06:45

