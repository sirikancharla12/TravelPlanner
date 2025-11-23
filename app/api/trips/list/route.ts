import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const uid = url.searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    // find user by uid
    const user = await prisma.user.findUnique({ where: { uid } });
    if (!user) {
      return NextResponse.json({ trips: [] }, { status: 200 });
    }

    const trips = await prisma.trip.findMany({
      where: {
        chat: { userId: user.id },
      },
      include: {
        chat: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trips }, { status: 200 });
  } catch (err: any) {
    console.error("LIST TRIPS ERROR", err);
    return NextResponse.json({ error: err?.message ?? "Unknown" }, { status: 500 });
  }
}
