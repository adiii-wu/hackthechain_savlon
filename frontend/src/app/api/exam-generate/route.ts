import { NextResponse } from 'next/server';
import { generateContentWithResilience } from '@/lib/aiHandler';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic = "Senior Frontend Engineer" } = body;

    const prompt = `Generate a high-level technical assessment for the topic: ${topic}.
The output MUST be a strict JSON array containing exactly 10 advanced multiple-choice questions.

Rules:
1. No introductory text, no markdown code blocks. Just the array.
2. 'correct' must be an integer between 0 and 3 corresponding to 'options'.
3. 'timeLimit' must be between 30 and 120 seconds.
4. Topics must be highly specific to ${topic}.

Schema:
[
  {
    "id": "q1",
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correct": number,
    "timeLimit": number
  }
]`;

    const result = await generateContentWithResilience(prompt, {
      responseMimeType: "application/json",
      temperature: 0.2
    });

    let text = result.text;
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
      const questions = JSON.parse(text);
      return NextResponse.json({ success: true, questions, modelInfo: result.modelUsed });
    } catch (err) {
      console.error("Exam Parse Error:", text);
      return NextResponse.json({ success: false, error: 'AI returned invalid JSON' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Exam Generate Error:", error);

    // Check for Rate Limit (429) pass-through
    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI Rate limit reached. Retrying automatically...' 
      }, { status: 429 });
    }

    return NextResponse.json({ success: false, error: error.message || 'Failed to generate exam' }, { status: 500 });
  }
}
