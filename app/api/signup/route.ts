import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
    try{
        const {name,email,password}=await req.json();

        if(!email || !password){
            return NextResponse.json(
                     { message: "Email and password are required" },
        { status: 400 }
            )
        }

        const existinguser=await prisma.user.findUnique({where:email});
        if(existinguser){
             return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }


        const hashpass=await bcrypt.hash(password,10);

        const newUser=await prisma.user.create({
           data:{name,email,password:hashpass} 
        })

        
    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    }
    catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating user" }, { status: 500 });
  }
}