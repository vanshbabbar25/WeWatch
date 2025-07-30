import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Hardcoded API Key – not secure for production
const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;  // Replace with your real key

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAIRecommendation(prompt) {
  try {
    console.log(API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    return "Failed to get response.";
  }
}
