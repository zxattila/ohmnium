// src/pages/api/chat.js
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export async function POST({ request }) {
  try {
    // 1. Extract user input from frontend
    const { prompt } = await request.json();

    // 2. Prepare request to Flowise API
    const flowiseResponse = await fetch(process.env.FLOWISE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization using API key (if enabled in Flowise settings)
        Authorization: `Bearer ${process.env.FLOWISE_API_KEY || ""}`,
      },
      body: JSON.stringify({
        question: prompt,
        // Optional: Add conversation history if needed
        // history: [],
        // Optional: Override Flowise variables
        // vars: { businessName: "Sparky Electric" }
      }),
    });

    // 3. Handle Flowise errors
    if (!flowiseResponse.ok) {
      const error = await flowiseResponse.json();
      throw new Error(error.message || "Flowise API error");
    }

    // 4. Extract and format the response
    const data = await flowiseResponse.json();

    // 5. Return clean response to frontend
    return new Response(
      JSON.stringify({
        response: data.text, // Main AI response
        // Optional: Include metadata for frontend logic
        metadata: {
          isEstimate: data.isEstimate || false,
          requiresContact: data.requiresContact || false,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    // 6. Error handling with user-friendly messages
    console.error("Chat API Error:", error);

    return new Response(
      JSON.stringify({
        error: "Our electrician assistant is currently unavailable.",
        // Debug info (only show in development)
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
        }),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
