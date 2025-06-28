import { OpenAI } from "openai";
import dotenv from "dotenv";
import { getUserPromt, systemPrompt } from "./prompts";
import { getPlaces } from "./places";
import { City } from "./city";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askGPT({
  city,
  days,
}: {
  city: City;
  days: number;
}): Promise<string> {
  const places = await getPlaces(city.id);
  const userPrompt = getUserPromt({ city, days, places });

  console.log("🔍 Asking GPT");
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // or "gpt-3.5-turbo"
    temperature: 0.8,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  console.log("✅ GPT success");

  const text = response.choices[0]?.message?.content?.trim();
  console.log(text);
  if (!text) throw new Error("GPT did not return any content");

  return text;
}
