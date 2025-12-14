import { geminiModel } from "@/lib/api/geminisdk";
import { NextResponse, NextRequest } from "next/server";

function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}


async function analyzeDestination(slug: string) {
  const prompt = `
You are a travel analyst.

Analyze the destination "${slug}" and return ONLY JSON.

JSON format:
{
  "place": "",
  "country": "",
  "destinationType": "beach | hill | city | cultural | mixed",
  "idealTripStyle": "relaxed | adventure | cultural | party",
  "commonConstraints": []
}
`;

  const res = await geminiModel.generateContent(prompt);
  return extractJSON(res.response.text());
}
async function generateTravelGuide(slug: string, analysis: any) {
  const prompt = `
You are a travel data API.

Destination Analysis:
- Place: ${analysis.place}
- Country: ${analysis.country}
- Type: ${analysis.destinationType}
- Ideal Style: ${analysis.idealTripStyle}
- Constraints: ${analysis.commonConstraints.join(", ")}

Use this analysis BEFORE generating content.

STRICT RULES:
- Return ONLY valid JSON
- No markdown, no explanations
- Short descriptions (2–3 sentences max)
- Rating as number (ex: 4.5)
- Include number of reviews
- Trend rank like "#1 Beach Destination"

JSON FORMAT (EXACT):

{
  "overview": {
    "place": "",
    "country": "",
    "rating": "",
    "numberOfReviews": "",
    "trendRank": "",
    "shortDescription": ""
  },
  "attractions": [
    {
      "name": "",
      "description": "",
      "type": "",
      "recommendedDuration": ""
    }
  ],
  "bestTimeToVisit": {
    "months": "",
    "reason": ""
  },
  "localCuisine": {
    "dishes": [
      { "name": "", "description": "" }
    ],
    "recommendedPlaces": []
  },
  "travelTips": {
    "transportation": [],
    "accommodation": [],
    "safety": [],
    "general": []
  },
  "budget": {
    "range": "",
    "notes": ""
  }
}

IMPORTANT:
- attractions ≥ 5
- dishes ≥ 4
- general tips ≥ 5
`;

  const res = await geminiModel.generateContent(prompt);
  return extractJSON(res.response.text());
}
async function validateGuide(data: any) {
  const prompt = `
You are a travel data validator.

Check the following JSON for:
- Missing fields
- Unrealistic ratings
- Weak descriptions

If issues exist, FIX them.
If not, return as-is.

Return ONLY JSON.

DATA:
${JSON.stringify(data)}
`;

  const res = await geminiModel.generateContent(prompt);
  return extractJSON(res.response.text());
}


export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Reasoning pipeline
    const analysis = await analyzeDestination(slug);
    const draftGuide = await generateTravelGuide(slug, analysis);
    const finalGuide = await validateGuide(draftGuide);

    return NextResponse.json(finalGuide, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate travel guide" },
      { status: 500 }
    );
  }
}

