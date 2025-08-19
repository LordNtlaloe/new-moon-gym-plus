import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com',
});

export async function POST(request: Request) {
    const { messages, postureData } = await request.json();

    // Compose system prompt to guide AI's advice
    const systemPrompt = `
You are a helpful fitness coach chatbot specialized in posture correction.
User's posture data:
- Exercise: ${postureData.exercise}
- Score: ${postureData.score}%
- Issues: ${postureData.issues.join(', ') || 'None'}

Give clear, friendly advice on how to improve posture and encouragement.
  `;

    const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages,
    ];

    const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: chatMessages,
    });

    return NextResponse.json({ reply: completion.choices[0].message });
}
