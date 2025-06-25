import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateSEOWithGemini = async (title, content, category) => {

  const prompt = `
  You are an expert SEO assistant.
  
  Generate the following metadata for the given page content:
  - meta_title
  - meta_description
  - keywords (3 to 6 SEO keywords)
  
  Return the result in strict JSON format like:
  {
    "meta_title": "...",
    "meta_description": "...",
    "keywords": ["...", "..."]
  }
  
  Page Details:
  Title: ${title}
  Category: ${category || "General"}
  Content: ${content}
    `;
  try {
    const result = await model.generateContent(prompt);

    const raw = await result.response.text();

    const cleaned = raw.replace(/^```json\s*|```$/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini response not JSON:", response);
    throw new Error("Failed to parse Gemini output");
  }
};

