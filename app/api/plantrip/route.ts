import { NextRequest } from "next/server";
import { geminiModel } from "@/lib/api/geminisdk";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    const prompt = `
      You are a travel planner AI.
      Create a JSON response for a detailed day-by-day itinerary.
      Include: day, title, description, activities (time, activity, cost, image if possible).
      Make it visually rich and structured.
      Input: ${text}
    `;
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), { status: 200 });
  } catch (err: any) {
    console.error("Plan trip error", err);
    return new Response("Error", { status: 500 });
  }
}
