// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { input } = await request.json();
  
  try {
    const backendRes = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    
    const data = await backendRes.json();
    return NextResponse.json({ answer: data.answer });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}