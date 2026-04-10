import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { candidates } from '@/lib/mockData';

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `You are Aegis Intelligence, an AI Recruiter assistant.
Here is the JSON list of available talent on the Aegis Protocol platform:
${JSON.stringify(candidates)}

Analyze the candidate data to answer the recruiter's query.
You must return your output ONLY as a strict JSON object with this shape:
{
  "reply": "Conversational answer discussing the best candidates for the query.",
  "filterString": "A single exact phrase (e.g. 'React', 'Python', 'Arjun') that the UI should place in the search bar to show the referenced candidates. Leave empty string if no specific filter is needed."
}

Recruiter's query: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    let text = result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    return NextResponse.json({ success: true, ai: JSON.parse(text) });

  } catch (error) {
    console.error("Recruiter AI Error:", error);
    return NextResponse.json({ success: false, error: 'AI processing failed' }, { status: 500 });
  }
}
