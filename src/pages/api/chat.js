import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
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
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
