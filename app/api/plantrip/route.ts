import { NextRequest } from "next/server";
import { geminiModel } from "@/lib/api/geminisdk";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

   const prompt = `
You are an expert travel planner AI. Create a **detailed, day-by-day itinerary** for a traveler based on the user's input. 

Your primary goal: return a **valid JSON** following this structure exactly, and ensure the "from" key is always filled if the user specifies an origin (e.g., "from Delhi").

If no origin is mentioned, omit the "from" key.

### Example output:
{
  "place": "Goa",
  "country": "India",
  "from": "Delhi",
  "departureDate": "2025-11-10",
  "overview": "Goa is known for its beaches and nightlife...",
  "howToGetThere": "Fly from Delhi (DEL) to Goa (GOI)...",
  "cheapestStay": "Stay near Baga Beach at budget hostels...",
  "photoRefQuery": "Goa beach India",
  "days": [
    {
      "day": "1",
      "title": "Arrival and beach day",
      "overview": "Relax at the beach...",
      "howToGetThere": "Take a taxi from airport...",
      "cheapestStay": "Budget hostel near Baga Beach",
      "photoRefQuery": "Goa Baga Beach",
      "thingsToDo": {
        "morning": "🛬 Arrive at Dabolim Airport (GOI)",
        "afternoon": "🏖️ Relax at Baga Beach",
        "evening": "🍽️ Dinner at beach shack",
        "totalCost": "₹2500 per person"
      }
    }
  ]
}

### Important:
1. Parse the user input carefully to extract both **destination** and **origin** (e.g., “Plan a trip to Bali from Delhi” → place = Bali, from = Delhi).
2. Always output **valid JSON only** (no explanations, no markdown).
3. Keep the output realistic with actual locations, costs, and travel details.

User Input: ${text}
`;

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    console.log("Plan trip response:", responseText);

    return new Response(JSON.stringify({ reply: responseText }), { status: 200 });
  } catch (err: any) {
    console.error("Plan trip error", err);
    return new Response("Error", { status: 500 });
  }
}
