// app/api/trips/save/route.ts  (or wherever your save endpoint lives)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SaveBody = {
  uid: string;
  title?: string;
  itinerary: any;
  fromLocation?: string | null;
  toLocation?: string | null;
  date?: string | null;
  chatId?: number | null;
};

export async function POST(req: Request) {
  try {
    const body: SaveBody = await req.json();

    if (!body?.uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    // Ensure user exists (upsert)
    const user = await prisma.user.upsert({
      where: { uid: body.uid },
      update: {},
      create: { uid: body.uid },
    });

    // Resolve chatId: if provided, validate ownership; otherwise create one
    let chatId: number | null = body.chatId ?? null;
    if (chatId) {
      const existingChat = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!existingChat || existingChat.userId !== user.id) {
        chatId = null; // invalid or doesn't belong to this user
      }
    }

    if (!chatId) {
      const newChat = await prisma.chat.create({
        data: {
          title: body.title ?? `Trip ${new Date().toLocaleString()}`,
          userId: user.id,
        },
      });
      chatId = newChat.id;
    }

    const parsedDate = body.date ? new Date(body.date) : null;

    const incomingItineraryStr = JSON.stringify(body.itinerary ?? {});

    // 1) Check latest trip for this chat (fast)
    const latestTripForChat = await prisma.trip.findFirst({
      where: { chatId },
      orderBy: { createdAt: "desc" },
    });

    if (latestTripForChat) {
      try {
        const existingIt = JSON.stringify(latestTripForChat.itinerary ?? {});
        if (existingIt === incomingItineraryStr) {
          // Same itinerary already saved for this chat - return existing trip
          return NextResponse.json(
            { success: true, alreadyExists: true, trip: latestTripForChat },
            { status: 200 }
          );
        }
      } catch (e) {
        // ignore stringify errors and continue to broader check
        console.warn("stringify compare failed for chat trip", e);
      }
    }

    // 2) Broader check: fetch recent trips for this user's chats and compare itineraries
    // (This prevents duplicates saved under different chat records)
    const userChats = await prisma.chat.findMany({ where: { userId: user.id }, select: { id: true } });
    const chatIds = userChats.map((c) => c.id);

    if (chatIds.length > 0) {
      const trips = await prisma.trip.findMany({
        where: { chatId: { in: chatIds } },
        orderBy: { createdAt: "desc" },
        take: 50, // limit how many to check (adjust as you see fit)
      });

      for (const t of trips) {
        try {
          const tIt = JSON.stringify(t.itinerary ?? {});
          if (tIt === incomingItineraryStr) {
            return NextResponse.json({ success: true, alreadyExists: true, trip: t }, { status: 200 });
          }
        } catch {
          // ignore and continue
        }
      }
    }

    // no duplicate -> create new trip
    const trip = await prisma.trip.create({
      data: {
        fromLocation: body.fromLocation ?? null,
        toLocation: body.toLocation ?? null,
        date: parsedDate,
        itinerary: body.itinerary ?? null,
        chatId,
      },
    });

    return NextResponse.json({ success: true, alreadyExists: false, trip }, { status: 201 });
  } catch (err: any) {
    console.error("SAVE TRIP ERROR", err);
    return NextResponse.json({ error: err?.message ?? "Unknown" }, { status: 500 });
  }
}
