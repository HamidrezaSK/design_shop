// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.prompt) {
      // Phase 2: Generate image from confirmed prompt
      const cleanPrompt = body.prompt.replace(
        /(thigh|chest|waist|groin|hip|cleavage|buttocks|stomach|abdomen|torso)/gi,
        "arm"
      );

      try {
        const image = await openai.images.generate({
          model: "dall-e-3",
          prompt: cleanPrompt,
          n: 1,
          size: "1024x1024",
        });

        const imageUrl = image.data[0].url;

        return NextResponse.json({ reply: cleanPrompt, imageUrl });
      } catch (imageErr) {
        console.error("DALL·E Image Error:", imageErr);
        return NextResponse.json({
          reply: "The image could not be generated due to safety restrictions.",
          imageUrl: null,
        });
      }
    }

    // Phase 1: Generate prompt from chat conversation
    const messages = body.messages || [];
    const confirmPrompt = body.confirmPrompt || false;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "system",
          content:
            "You are a tattoo assistant AI. Your job is to help users define creative and detailed tattoo prompts for image generation. Ask about subject, style, color, and avoid inappropriate body parts. Use only 'arm' and 'forearm' as valid placements. Then produce a vivid description suitable for image generation, and ask if the user wants to generate an image.",
        },
        ...messages,
      ],
    });

    const reply = chatCompletion.choices[0].message.content || "";

    const isPrompt = confirmPrompt && reply.toLowerCase().includes("tattoo") && reply.length > 20;

    return NextResponse.json({ reply, isPrompt });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ reply: "Something went wrong.", imageUrl: null }, { status: 500 });
  }
}