import { NextResponse } from 'next/server';
import { candidates } from '@/lib/mockData';
import { generateContentWithResilience } from '@/lib/aiHandler';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemPrompt = `You are Aegis Intelligence, an AI Recruiter assistant. 
Analytical, precise, and professional. 
Available talent pool (JSON):
${JSON.stringify(candidates)}

Analyze the data to answer: ${prompt}
Return ONLY valid JSON:
{
  "reply": "Conversational answer here.",
  "filterString": "Skill prefix or name for filtering, or empty string."
}`;

    const result = await generateContentWithResilience(systemPrompt, {
      responseMimeType: "application/json",
      temperature: 0.1
    });

    let text = result.text;
    
    // Advanced cleaning for potential markdown artifacts
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ success: true, ai: parsed, modelInfo: result.modelUsed });
    } catch (parseErr) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ 
        success: false, 
        error: "AI returned an invalid response format. Please try again." 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Recruiter AI Route Error:", error);
    
    // Check for Rate Limit (429) pass-through
    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json({ 
        success: false, 
        error: 'Global AI Quota reached. Please wait a few moments.' 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI processing encountered an unexpected error.' 
    }, { status: 500 });
  }
}
