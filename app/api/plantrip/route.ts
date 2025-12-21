import { NextRequest } from "next/server";
import { geminiModel } from "@/lib/api/geminisdk";

export async function POST(req: NextRequest) {
  try {
const { text, previousMessages } = await req.json();

const conversationContext = previousMessages
  .map((msg:any) => `${msg.role.toUpperCase()}: ${typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}`)
  .join("\n");

const prompt = `
You are an expert travel planner AI. Continue the planning conversation naturally based on the previous chat context and the new user request. 

If the user asks to modify the plan (e.g., "make it 5 days", "add Paris", "change hotels"), you must **update or extend** the previous itinerary accordingly — not start from scratch.

Use the following JSON structure for your reply (always valid JSON, no explanations or markdown):

{
  "place": "string",
  "country": "string",
  "from": "string (optional)",
  "departureDate": "YYYY-MM-DD",
  "overview": "short summary",
  "howToGetThere": "transportation details",
  "cheapestStay": "1–2 realistic affordable stay options",
  "photoRefQuery": "keyword for images",
  "days": [
    {
      "day": "1",
      "title": "string",
      "overview": "string",
      "howToGetThere": "string",
      "cheapestStay": "string",
      "photoRefQuery": "string",
      "thingsToDo": {
        "morning": "string",
        "afternoon": "string",
        "evening": "string",
        "totalCost": "string"
      }
    }
  ]
}

Previous conversation:
${conversationContext}

New user message:
USER: ${text}

Now generate the updated or new travel plan accordingly.
`;


    const result = await geminiModel.generateContent(prompt);
    const rawText = result.response.text();

const cleanJSON = rawText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return new Response(
  JSON.stringify({ reply: JSON.parse(cleanJSON) }),
  { status: 200 }
);

 
  } catch (err: any) {
    console.error("Plan trip error", err);
    return new Response("Error", { status: 500 });
  }
}
