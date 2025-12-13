// lib/ai.ts
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const MODEL = "gemini-2.0-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const cache = new Map<string, string>();

async function callGeminiAPI(prompt: string): Promise<string> {
  if (cache.has(prompt)) {
    console.log("[Gemini] Cache hit");
    return cache.get(prompt)!;
  }

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512, 
        },
      }),
    });

    
    if (!response.ok) {
      const err = await response.text();
      console.error("[Gemini API Error]", err);

      return "✨ This memory holds emotions too deep for words right now.";
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return "✨ A meaningful moment worth preserving forever.";
    }

    const finalText = text.trim();
    cache.set(prompt, finalText);
    return finalText;

  } catch (err) {
    console.error("[Gemini Fatal]", err);
    return "✨ A beautiful memory that deserves to be remembered.";
  }
}

export const generateCaption = (d: string) =>
  callGeminiAPI(`Generate a short emotional caption under 100 chars:\n${d}`);

export const summarizeText = (t: string) =>
  callGeminiAPI(`Summarize this memory in under 30 words:\n${t}`);

export const enhanceDescription = (d: string) =>
  callGeminiAPI(`Rewrite this vividly and emotionally (max 120 words):\n${d}`);

export const suggestMemoryIdeas = (theme: string) =>
  callGeminiAPI(
    `Give exactly 5 heartfelt memory ideas for theme "${theme}", one per line, starting with "-"`
  );
