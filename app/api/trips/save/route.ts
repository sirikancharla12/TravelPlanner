import { prisma } from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";

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
    try{
        const body=await req.json();

        if(!body?.uid){
            return NextResponse.json({error:"uid is required"});
        }

        const user=await prisma.user.findFirst({
            where:{uid:body.uid},
            })

        if (!user) {
            return NextResponse.json({ error: "User not found , please signup" }, { status: 404 });
        }

let chatId=body.chatId ?? null;
if(chatId){
 const existing = await prisma.chat.findUnique({ where: { id: chatId } });
      if (!existing || existing.userId !== user.id) {
        chatId = null;
      }
}


if(!chatId){
    const chat=await prisma.chat.create({
        data:{
            title:body.title ?? `Trip ${new Date().toLocaleString()}`,
            userId:user.id
        }
    });
    chatId=chat.id
}

   const parsedDate = body.date ? new Date(body.date) : null;

   const trip=await prisma.trip.create({
    data:{
         fromLocation: body.fromLocation ?? null,
        toLocation: body.toLocation ?? null,
        date: parsedDate,
        itinerary: body.itinerary ?? null, 
        chatId,
    }
   })
return NextResponse.json({ success: true, trip }, { status: 201 });
    } catch (err: any) {
    console.error("SAVE TRIP ERROR", err);
    return NextResponse.json({ error: err?.message ?? "Unknown" }, { status: 500 });
    }
}