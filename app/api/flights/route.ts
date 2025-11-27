import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getAmadeusAccessToken } from "@/lib/api/amadeus";

const formatCityName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

async function getIATACodeSmart(
  city: string,
  token: string
): Promise<{ code: string | null; name: string }> {
  if (!city) return { code: null, name: "" };
  const cleanCity = city.trim().toLowerCase();

  const commonCodes: Record<string, string> = {
    goa: "GOI",
    delhi: "DEL",
    newdelhi: "DEL",
    mumbai: "BOM",
    chennai: "MAA",
    bangalore: "BLR",
    bengaluru: "BLR",
    hyderabad: "HYD",
    kolkata: "CCU",
    pune: "PNQ",
    jaipur: "JAI",
    ahmedabad: "AMD",
    kochi: "COK",
    paris: "CDG",
    london: "LHR",
    dubai: "DXB",
    newyork: "JFK",
    singapore: "SIN",
    australia: "SYD",
    sydney: "SYD",
    melbourne: "MEL",
  };

  if (commonCodes[cleanCity]) {
    return { code: commonCodes[cleanCity], name: formatCityName(city) };
  }

  try {
    const res = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: city, subType: "AIRPORT,CITY" },
      }
    );
    const location = res.data?.data?.[0];
    if (location?.iataCode) {
      const officialName = location.address?.cityName || formatCityName(city);
      return { code: location.iataCode, name: officialName };
    }
  } catch (err: any) {
    console.warn(` Amadeus lookup failed for ${city}:`, err.message);
  }

  return { code: null, name: city };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawOrigin = searchParams.get("origin")?.trim() || "";
    const rawDest = searchParams.get("destination")?.trim() || "";

    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!rawDest) {
      return NextResponse.json(
        { error: "destination is required" },
        { status: 400 }
      );
    }

    
    let departureDate = searchParams.get("departureDate")?.trim();
    const now = new Date();
    if (!departureDate || new Date(departureDate) <= now) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 2);
      departureDate = tomorrow.toISOString().split("T")[0];
    }

    const token = await getAmadeusAccessToken();

    const destData = await getIATACodeSmart(rawDest, token);
    if (!destData.code) {
      return NextResponse.json(
        { error: `Could not resolve destination: ${rawDest}` },
        { status: 400 }
      );
    }

    let originCode: string | null = null;
    let originName = "Your Location";

    if (
      rawOrigin &&
      rawOrigin.toLowerCase() !== "your location" &&
      rawOrigin !== ""
    ) {
      console.log(` Using typed origin: "${rawOrigin}"`);
      const originData = await getIATACodeSmart(rawOrigin, token);
      originCode = originData.code;
      originName = originData.name;

      if (!originCode) {
        return NextResponse.json(
          { error: `Could not resolve origin: ${rawOrigin}` },
          { status: 400 }
        );
      }
    }
    else if (lat && lon) {
      console.log(
        ` No typed origin. Using geolocation Lat/Lon: ${lat}, ${lon}`
      );
      try {
        const nearRes = await axios.get(
          "https://test.api.amadeus.com/v1/reference-data/locations/airports",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              latitude: lat,
              longitude: lon,
              radius: 100,
              sort: "distance",
            },
          }
        );

        const nearest = nearRes.data?.data?.[0];
        if (nearest?.iataCode) {
          originCode = nearest.iataCode;
          originName =
            nearest.address?.cityName || nearest.name || "Current Location";
        } else {
          return NextResponse.json(
            { error: "Could not find nearby airport from location" },
            { status: 400 }
          );
        }
      } catch (error: any) {
        console.warn("⚠️ Failed to resolve Lat/Lon to Airport:", error.message);
        return NextResponse.json(
          { error: "Could not resolve origin from coordinates" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Origin or coordinates are required" },
        { status: 400 }
      );
    }

    if (!originCode || !destData.code) {
      return NextResponse.json(
        { error: "Could not determine valid airports." },
        { status: 400 }
      );
    }

    if (originCode === destData.code) {
      return NextResponse.json(
        { error: "Origin and Destination cannot be the same." },
        { status: 400 }
      );
    }

    console.log(
      ` Final Search Params: ${originCode} (${originName}) -> ${destData.code} (${destData.name}) on ${departureDate}`
    );

    const response = await axios.get(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: originCode,
          destinationLocationCode: destData.code,
          departureDate,
          adults: 1,
          currencyCode: "INR",
          max: 10,
        },
      }
    );

    const carrierNames = response.data.dictionaries?.carriers || {};

    const flights = response.data.data.map((offer: any) => {
      const airlineCode = offer.validatingAirlineCodes[0];
      const segment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments.slice(-1)[0];

      const airlineName = carrierNames[airlineCode]
        ? carrierNames[airlineCode]
            .split(" ")
            .map(
              (w: string) =>
                w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            )
            .join(" ")
        : airlineCode;

      return {
        id: offer.id,
        price: offer.price.total,
        currency: offer.price.currency,
        airlineCode,
        airlineName,
        flightNumber: segment.number,
        duration: offer.itineraries[0].duration,
        departure: {
          iataCode: segment.departure.iataCode,
          city: originName,
          at: segment.departure.at,
        },
        arrival: {
          iataCode: lastSegment.arrival.iataCode,
          city: destData.name,
          at: lastSegment.arrival.at,
        },
      };
    });

    const sortedFlights = flights.sort(
      (a: any, b: any) => Number(a.price) - Number(b.price)
    );
    return NextResponse.json({ flights: sortedFlights });
  } catch (error: any) {
    const errorMsg = error.response?.data?.errors?.[0]?.detail || error.message;
    console.error(" Flight API Error:", errorMsg);

    if (error.response?.data?.errors?.[0]?.code === 425) {
      return NextResponse.json(
        { error: "Date is in the past. Please select a future date." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
