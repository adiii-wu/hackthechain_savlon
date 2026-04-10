import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { candidates } from '@/lib/mockData';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    if (!apiKey) {
      console.error("AI Route Error: GEMINI_API_KEY is missing from environment.");
      return NextResponse.json({ 
        success: false, 
        error: 'API Key Missing. Please restart your dev server after adding it to .env.local' 
      }, { status: 500 });
    }

    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.2 
      }
    });

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

    const result = await model.generateContent(systemPrompt);
    let text = result.response.text();
    
    // Advanced cleaning for potential markdown artifacts
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json({ success: true, ai: parsed });
    } catch (parseErr) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ 
        success: false, 
        error: "AI returned an invalid response format. Please try again." 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Recruiter AI Route Error:", error);
    
    // Check for Rate Limit (429)
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please wait 60 seconds and try again.' 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'AI processing encountered an unexpected error.' 
    }, { status: 500 });
  }
}
