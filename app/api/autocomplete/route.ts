import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input");
  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: process.env.GOOGLE_API_KEY,
          language: "en",
        //   region: "in", // prioritize Indian 
        },
      }
    );

    const places = res.data.predictions.map((p: any) => ({
      description: p.description, // Hyderabad, Telangana, India
      main_text: p.structured_formatting?.main_text,
      secondary_text: p.structured_formatting?.secondary_text,
      place_id: p.place_id,
    }));

    return NextResponse.json(places);
  } catch (err: any) {
    console.error("Autocomplete API error:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete suggestions" },
      { status: 500 }
    );
  }
}
