import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const analyzeLegalDocument = async (text) => {
  if (!text || text.trim() === "") {
    throw new Error("No text provided for analysis.");
  }

  const prompt = `
You are an AI legal assistant.

Analyze the following legal document and provide:

1. Summary
2. Risky Clauses
3. Important Points
4. Simplified Explanation in simple English

Legal Document:
${text}
`;

  let response;

  try {
    response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
  } catch (err) {
    console.error("OpenRouter API call failed:", err?.message || err);
    throw new Error("Failed to contact AI service. Check your API key and network.");
  }

  // Guard: validate the response shape before accessing
  if (!response || !response.choices || response.choices.length === 0) {
    console.error("Unexpected API response:", JSON.stringify(response, null, 2));
    throw new Error("AI service returned an empty or invalid response.");
  }

  return response.choices[0].message.content;
};