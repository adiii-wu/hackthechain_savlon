import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    if (!apiKey) {
      console.error("Exam Route Error: GEMINI_API_KEY is missing from environment.");
      return NextResponse.json({ 
        success: false, 
        error: 'API Key Missing. Please add it to .env.local and RESTART your dev server.' 
      }, { status: 500 });
    }

    const body = await req.json();
    const { topic = "Senior Frontend Engineer" } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const prompt = `Generate exactly 10 advanced multiple-choice questions for the topic: ${topic}.
The output MUST be a strict JSON array of objects.
Element Schema:
{
  "id": "unique_string",
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correct": number (0-3),
  "timeLimit": number (seconds)
}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const questions = JSON.parse(text);
      return NextResponse.json({ success: true, questions });
    } catch (err) {
      console.error("Exam Parse Error:", text);
      return NextResponse.json({ success: false, error: 'AI returned invalid JSON' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Exam Generate Error:", error);

    // Check for Rate Limit (429)
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI Rate limit reached. Please wait a minute before generating another exam.' 
      }, { status: 429 });
    }

    return NextResponse.json({ success: false, error: error.message || 'Failed to generate exam' }, { status: 500 });
  }
}
