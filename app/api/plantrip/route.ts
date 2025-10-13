import { NextRequest } from "next/server";
import { geminiModel } from "@/lib/api/geminisdk";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

const prompt = `
You are an expert travel planner AI. Create a **detailed, day-by-day itinerary** for a traveler based on the user's input. 
The response must be a **JSON object** in this format:

{
"place": "Barcelona", 
  "country": "Spain",
  "overview": "Barcelona is a vibrant city known for its stunning architecture...",
  "howToGetThere": "Arrive at Barcelona-El Prat Airport (BCN)...",
  "cheapestStay": "Stay at Slowly Apartments...",
  "photoRefQuery": "Barcelona city view Spain", 
  "days": [
    {
      "day": "1",
      "title": "Arrival & Exploring the City",
      "overview": "Explore the neighborhood...",
      "howToGetThere": "Take a taxi or metro...",
      "cheapestStay": "Budget hostel near center...",
      "photoRefQuery": "Barcelona Gothic Quarter",
      "thingsToDo": {
        "morning": "🛬 Arrive at the airport...",
        "afternoon": "⛪ Explore the Gothic Quarter...",
        "evening": "📷 Stroll along La Rambla..."
      },
      "totalCost": "$52 per person"
    }
  ]
}

**Additional Instructions:**
1. Add a "photoRefQuery" field at the trip level and for each day.
   - This should be a **short, descriptive phrase** suitable for fetching a photo via Google Places API or Google Images.
   - Example: "Eiffel Tower Paris France"
2. Include overview, howToGetThere, cheapestStay, and total cost as before.
3. Make all text human-friendly and realistic.
4. Output **valid JSON only** — no markdown, no explanations.

User Input: ${text}
`;


    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), { status: 200 });
  } catch (err: any) {
    console.error("Plan trip error", err);
    return new Response("Error", { status: 500 });
  }
}
