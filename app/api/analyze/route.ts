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

export async function POST(req: NextRequest) {
  try {
    const { inputText } = await req.json();

    if (!inputText) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    // Create the prompt for task extraction
    const systemPrompt = `你是一个专业的任务分析助手。请分析用户提供的文本内容，从中提取出具体的、可执行的待办任务。

请按照以下要求：
1. 仔细思考和推理每个可能的任务
2. 展示你的分析思路和推理过程
3. 最后以JSON格式输出结构化的任务列表

输出格式要求：
- 推理过程：详细展示你是如何从文本中识别和提取任务的
- 最终结果：JSON格式的任务数组，每个任务包含：
  - id: 唯一标识符
  - title: 任务标题（简洁明确）
  - description: 任务描述（可选）
  - priority: 优先级（high/medium/low）
  - deadline: 截止时间（如果文本中提到）
  - category: 任务分类

请开始分析：`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: inputText
        }
      ],
      stream: true,
      temperature: 0.7,
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
              const data = `data: ${JSON.stringify({ content, type: 'content' })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          
          // Send completion signal
          const endData = `data: ${JSON.stringify({ type: 'done' })}\n\n`;
          controller.enqueue(encoder.encode(endData));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({ 
            type: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
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
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
} 