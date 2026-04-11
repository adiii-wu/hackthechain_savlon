import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS_WATERFALL = [
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
];

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // ms

interface ResilienceOptions {
  responseMimeType?: string;
  temperature?: number;
}

export async function generateContentWithResilience(
  prompt: string,
  options: ResilienceOptions = {}
) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any = null;

  // Try each model in the waterfall
  for (const modelName of MODELS_WATERFALL) {
    let retries = 0;

    while (retries <= MAX_RETRIES) {
      try {
        console.log(`[AI Resilience] Attempting with model: ${modelName} (Retry: ${retries})`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: options.responseMimeType,
            temperature: options.temperature ?? 0.1,
          },
        });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) throw new Error("AI returned empty response");

        return {
          text,
          modelUsed: modelName,
          success: true
        };

      } catch (error: any) {
        lastError = error;
        const status = error.status || 0;
        const message = error.message || "";

        // If it's a 429 (Rate Limit), we retry after a delay
        if (status === 429 || message.includes("429")) {
          console.warn(`[AI Resilience] 429 Quota hit for ${modelName}. Retrying...`);
          retries++;
          if (retries <= MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
            continue; // Retry same model
          }
        }

        // If we reach here, it means this model failed completely after retries or hit a non-retryable error
        console.error(`[AI Resilience] Model ${modelName} failed. Escalating to next model.`);
        break; // Break the while loop to move to the next model in MODELS_WATERFALL
      }
    }
  }

  // If we exhausted all models and retries
  console.error("[AI Resilience] Critical Failure: All models and retries exhausted.");
  throw lastError || new Error("All AI models failed to respond.");
}
