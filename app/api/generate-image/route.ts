// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Generate pharmacy-related image with DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A professional, accurate pharmacy-related image showing: ${prompt}. 
               The image should be clear, medically appropriate, and suitable for a healthcare setting.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}