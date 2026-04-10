import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = "Senior Frontend Engineer" } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Generate exactly 10 advanced multiple-choice questions for a technical Sentinel certification exam.
The topic/role is: ${topic}
Ensure questions are difficult and designed to test deep understanding, not just trivia.
The output MUST be a JSON array.

Schema of the array elements:
{
  "id": "q1",
  "question": "question text",
  "options": ["option 1", "option 2", "option 3", "option 4"],
  "correct": 1, // integer index of correct option (0-3)
  "timeLimit": 60 // integer seconds between 45 and 90
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ success: true, questions: JSON.parse(text) });

  } catch (error) {
    console.error("Exam Generate Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to generate exam questions' }, { status: 500 });
  }
}
