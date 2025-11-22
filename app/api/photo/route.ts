import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const photoRef = req.nextUrl.searchParams.get("photoRef");
  if (!photoRef) {
    return NextResponse.json({ error: "Missing photoRef" }, { status: 400 });
  }

  try {
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/photo`,
      {
        params: {
          maxwidth: 800,
          photoreference: photoRef,
          key: process.env.GOOGLE_API_KEY,
        },
        responseType: "arraybuffer", 
      }
    );

    return new NextResponse(res.data, {
      status: 200,
      headers: {
        "Content-Type": res.headers["content-type"] || "image/jpeg",
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
