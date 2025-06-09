import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": process.env.SITE_NAME || "Clearflow Todo",
  },
});

// 中文提示词
const getChineseSystemPrompt = (currentDateChinese: string, currentDateStr: string) => `你是一个专业的任务分析助手。请分析用户提供的文本内容，从中提取出具体的、可执行的待办任务。

当前日期信息：
- 今天是：${currentDateChinese}
- 日期格式：${currentDateStr}

输出格式要求：
1. 首先用100字以内总结今天的计划
2. 然后输出JSON格式的任务数组
3. 输出JSON格式时，需要使用\`\`\`json开头，\`\`\`结尾

JSON格式要求：
每个任务包含：
- id: 唯一标识符（使用时间戳）
- title: 任务标题（简洁明确）
- description: 任务描述
- priority: 优先级（high/medium/low）
- deadline: 截止时间（如果文本中提到，格式：YYYY-MM-DD，"今天"指${currentDateStr}）
- category: 任务分类
- completed: false

示例输出：
今天的计划主要围绕产品开发，包括UI设计完成、后端开发协调、测试环境搭建和用户反馈收集四个关键任务。

\`\`\`json
[
  {
    "id": "1234567890",
    "title": "完成UI设计",
    "description": "完成所有页面的UI设计稿",
    "priority": "high",
    "deadline": "${currentDateStr}",
    "category": "设计",
    "completed": false
  }
]
\`\`\`

请开始分析：`;

// 英文提示词
const getEnglishSystemPrompt = (currentDateEnglish: string, currentDateStr: string) => `You are a professional task analysis assistant. Please analyze the text content provided by the user and extract specific, actionable todo tasks from it.

Current date information:
- Today is: ${currentDateEnglish}
- Date format: ${currentDateStr}

Output format requirements:
1. First, summarize today's plan in 100 words or less
2. Then output a JSON array of tasks

JSON format requirements:
Each task should include:
- id: unique identifier (use timestamp)
- title: task title (concise and clear)
- description: task description
- priority: priority level (high/medium/low)
- deadline: deadline (if mentioned in text, format: YYYY-MM-DD, "today" means ${currentDateStr})
- category: task category
- completed: false

Example output:
Today's plan focuses on product development, including four key tasks: completing UI design, coordinating backend development, setting up testing environment, and collecting user feedback.

\`\`\`json
[
  {
    "id": "1234567890",
    "title": "Complete UI Design",
    "description": "Complete UI design drafts for all pages",
    "priority": "high",
    "deadline": "${currentDateStr}",
    "category": "Design",
    "completed": false
  }
]
\`\`\`

Please start analyzing:`;

export async function POST(req: NextRequest) {
  console.log('🚀 开始AI分析');
  
  try {
    const { inputText, conversationHistory, existingTasks, language = 'en' } = await req.json();

    if (!inputText) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.trim() === '') {
      return NextResponse.json({ error: 'OpenRouter API key is not configured' }, { status: 500 });
    }

    console.log('📡 流式生成中...', `语言: ${language}`);

    // Get current date for context
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentDateChinese = currentDate.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
    const currentDateEnglish = currentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });

    // Choose system prompt based on language
    const systemPrompt = language === 'zh' 
      ? getChineseSystemPrompt(currentDateChinese, currentDateStr)
      : getEnglishSystemPrompt(currentDateEnglish, currentDateStr);

    // Build messages array
    let messages: any[] = [{ role: "system", content: systemPrompt }];
    
    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      messages = [...messages, ...conversationHistory];
    } else {
      messages.push({ role: "user", content: inputText });
    }

    // Add existing tasks context if provided
    if (existingTasks && existingTasks.length > 0) {
      const tasksContext = language === 'zh' 
        ? `\n\n当前已有任务：\n${existingTasks.map((task: any) => `- ${task.title} (${task.priority})`).join('\n')}`
        : `\n\nExisting tasks:\n${existingTasks.map((task: any) => `- ${task.title} (${task.priority})`).join('\n')}`;
      messages[messages.length - 1].content += tasksContext;
    }
    
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages,
      stream: true,
      temperature: 0.7,
      top_p: 0.9,
    });

    // Create a readable stream for Server-Sent Events
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            
            if (content) {
              // Send each chunk as Server-Sent Event
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          
          // Send completion signal
          const endData = `data: [DONE]\n\n`;
          controller.enqueue(encoder.encode(endData));
          controller.close();
        } catch (error) {
          console.error('❌ 流式生成错误:', error);
          
          const errorMessage = language === 'zh' 
            ? '抱歉，AI分析遇到了问题，请稍后重试。'
            : 'Sorry, AI analysis encountered an issue, please try again later.';
          
          const errorData = `data: ${JSON.stringify({ 
            content: errorMessage
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ API错误:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze text', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 