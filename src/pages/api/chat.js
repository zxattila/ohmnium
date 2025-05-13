import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
// Ensure you have the OPENAI_API_KEY in your .env file

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST({ request }) {
  try {
    const { prompt } = await request.json();

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return new Response(
      JSON.stringify({ response: completion.choices[0].message.content }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
