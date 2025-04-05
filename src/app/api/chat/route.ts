import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "system",
          content:
            "You are a tattoo assistant AI. Your job is to help users define creative and detailed tattoo prompts for image generation. Ask about subject, style, color, and body part. Then produce a vivid description suitable for image generation.",
        },
        ...messages,
      ],
    });

    const finalPrompt = chatCompletion.choices[0].message.content;

    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: finalPrompt!,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = image.data[0].url;

    return NextResponse.json({
      reply: finalPrompt,
      imageUrl,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { reply: "Something went wrong.", imageUrl: null },
      { status: 500 }
    );
  }
}
