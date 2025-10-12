import { NextRequest } from "next/server";
import { geminiModel } from "@/lib/api/geminisdk";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
 const prompt = `
You are an expert travel planner AI. Create a **detailed, day-by-day itinerary** for a traveler based on the user's input. The response must be a **JSON object** in this format:

{
  "itinerary": [
    {
      "day": "1",
      "title": "Arrival & Exploring the City",
      "overview": "Barcelona is a vibrant city known for its stunning architecture, including the iconic Sagrada Familia and Park Güell. Enjoy the lively atmosphere of Las Ramblas, indulge in delicious tapas, and soak up the sun on the beautiful beaches. Explore the rich history and culture of this Catalan capital.",
      "howToGetThere": "Arrive at Barcelona-El Prat Airport (BCN). You can take a taxi, airport shuttle, or metro to the city center.",
      "cheapestStay": "Stay at Slowly Apartments or a budget hostel near the city center for convenience and affordability.",
      "thingsToDo": {
        "morning": "🛬 Arrive at the airport and take a taxi or shuttle to your accommodation (~30 mins, $25). Freshen up and have breakfast at a local café, trying churros con chocolate (~$4).",
        "afternoon": "⛪ Explore the Gothic Quarter, wander through narrow streets, visit Barcelona Cathedral, and shop for souvenirs. Have lunch at La Boqueria Market, trying tapas like patatas bravas and jamón ibérico (~$10).",
        "evening": "📷 Stroll along La Rambla and enjoy street performances. Have dinner at a local restaurant trying paella or fideuà (~$15)."
      },
      "totalCost": "$52 per person"
    }
  ]
}

**Requirements:**
1. Include **overview, howToGetThere, cheapestStay** for each day.
2. Include **thingsToDo** grouped by morning, afternoon, evening, 3–4 sentences max each.
3. Include **total cost per day**.
4. Include **transport, food, sightseeing, tickets** costs in-line.
5. Make all text **human-friendly and descriptive**.
6. Output **JSON only**, no extra text or markdown.

User Input: ${text}
`

    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), { status: 200 });
  } catch (err: any) {
    console.error("Plan trip error", err);
    return new Response("Error", { status: 500 });
  }
}
