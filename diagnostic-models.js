const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './frontend/.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Checking API Key:", apiKey ? "PRESENT" : "MISSING");
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // There isn't a direct listModels in the standard SDK easily, but we can try to guess or use the REST API
    // Actually, let's just try gemini-pro which is the most compatible name
    console.log("Attempting to generate content with 'gemini-pro'...");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Test");
    console.log("gemini-pro success!");
  } catch (err) {
    console.error("gemini-pro failed:", err.message);
    
    try {
      console.log("Attempting with 'gemini-1.5-flash'...");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Test");
      console.log("gemini-1.5-flash success!");
    } catch (err2) {
      console.error("gemini-1.5-flash failed:", err2.message);
    }
  }
}

listModels();
