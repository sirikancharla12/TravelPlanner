import { geminiModel } from "@/lib/api/geminisdk";
import { NextResponse,NextRequest } from "next/server";


export async function POST(req:NextRequest){
try{
    const {slug}=await req.json();

    if(!slug){
        return NextResponse.json({error:"Slug is required"},{status:400});
    }

    const prompt=`Provide a detailed travel guide for the destination: ${slug}. Include top attractions, best time to visit, local cuisine, and travel tips. Format the response in JSON with keys: attractions, bestTimeToVisit, localCuisine, travelTips.`;

const result=await geminiModel.generateContent(prompt);
const response=result.response.text();

console.log("Explore route response:",response);
return NextResponse.json({data:response},{status:200});
}catch(err){
    console.log(err);
return NextResponse.json({error:"Failed to generate travel guide"},{status:500});
}
}