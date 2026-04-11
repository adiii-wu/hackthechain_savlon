const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './frontend/.env.local' });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? "FOUND" : "NOT FOUND");
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent("Hello, are you working?");
    console.log("Response:", result.response.text());
  } catch (err) {
    console.error("API Error:", err.message);
  }
}

test();
