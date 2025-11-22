import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAmadeusAccessToken } from "@/lib/api/amadeus";

// 🔹 Smart IATA resolver (Common → Amadeus → Gemini)
async function getIATACodeSmart(city: string, token: string): Promise<string | null> {
  if (!city) return null;
  const cleanCity = city.trim().toLowerCase();

  // ✅ Common Indian cities
  const commonCodes: Record<string, string> = {
    goa: "GOI",
    delhi: "DEL",
    mumbai: "BOM",
    chennai: "MAA",
    bangalore: "BLR",
    hyderabad: "HYD",
    kolkata: "CCU",
    pune: "PNQ",
    jaipur: "JAI",
    ahmedabad: "AMD",
  };
  if (commonCodes[cleanCity]) {
    console.log(`✅ Found IATA (common): ${city} → ${commonCodes[cleanCity]}`);
    return commonCodes[cleanCity];
  }

  // ✈️ Amadeus location lookup
  try {
    const res = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: city, subType: "AIRPORT,CITY" },
      }
    );

    const iataCode = res.data?.data?.[0]?.iataCode;
    if (iataCode && /^[A-Z]{3}$/.test(iataCode)) {
      console.log(`✅ Found IATA (Amadeus): ${city} → ${iataCode}`);
      return iataCode;
    }
  } catch (err: any) {
    console.warn(`⚠️ Amadeus lookup failed for ${city}:`, err.message);
  }

  // 🤖 Gemini fallback
  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Return ONLY the 3-letter IATA airport code for this city: ${city}. Example: Paris -> CDG`

                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.toUpperCase();
    console.log(`🧠 Gemini response for ${city}:`, rawText);

    const match = rawText?.toUpperCase().match(/\b[A-Z]{3}\b/);

    if (match) {
      console.log(` Found IATA (Gemini): ${city} → ${match[0]}`);
      return match[0];
    }
  } catch (err) {
    console.error(` Gemini IATA fallback failed for ${city}:`, err);
  }

  console.warn(`Could not resolve IATA for ${city}`);
  return null;
}

// 🔹 Main API Route
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let origin = searchParams.get("origin")?.trim();
    let destination = searchParams.get("destination")?.trim();

    const INDIAN_AIRLINES = ["AI", "6E", "SG", "G8", "UK"]; // Air India, IndiGo, SpiceJet, GoFirst, Vistara

    let departureDate = searchParams.get("departureDate")?.trim();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (!departureDate) {
      departureDate = tomorrow.toISOString().split("T")[0];
    } else {
      const parsedDate = new Date(departureDate);
      if (isNaN(parsedDate.getTime()) || parsedDate < today) {
        departureDate = tomorrow.toISOString().split("T")[0];
      }
    }

    const token = await getAmadeusAccessToken();

    // 🎯 Resolve IATA codes
    const destCode =
      destination && destination.length === 3
        ? destination.toUpperCase()
        : await getIATACodeSmart(destination || "Delhi", token);
    const origCode =
      origin && origin.length === 3
        ? origin.toUpperCase()
        : await getIATACodeSmart(origin || "Goa", token);

    if (!destCode || !origCode)
      return NextResponse.json({ error: "Invalid origin or destination" }, { status: 400 });

    console.log("🔍 Final Amadeus params:", {
      originLocationCode: origCode,
      destinationLocationCode: destCode,
      departureDate,
    });

    // 🛫 Fetch flight offers
    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: origCode,
          destinationLocationCode: destCode,
          departureDate,
          adults: 1,
          currencyCode: "INR",
          max: 10,
        },
      }
    );

    // 🧩 Process flights
    const flights = response.data.data.map((offer: any) => {
      const airline = offer.validatingAirlineCodes[0];
      return {
        price: offer.price.total,
        currency: offer.price.currency,
        airline,
        type: INDIAN_AIRLINES.includes(airline) ? "Domestic" : "International",
        duration: offer.itineraries[0].duration,
        departure: offer.itineraries[0].segments[0].departure,
        arrival: offer.itineraries[0].segments.slice(-1)[0].arrival,
      };
    });

    // 🇮🇳 Sort Indian airlines first
    const sortedFlights = flights.sort((a: { airline: string; }, b: { airline: string; }) => {
      const aIsIndian = INDIAN_AIRLINES.includes(a.airline);
      const bIsIndian = INDIAN_AIRLINES.includes(b.airline);
      return aIsIndian === bIsIndian ? 0 : aIsIndian ? -1 : 1;
    });

    return NextResponse.json({ flights: sortedFlights });
  } catch (error: any) {
    console.error("❌ Flight fetch error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 });
  }
}
