import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[/api/signup] body:", body);

    const { name, email, password, uid, authProvider, phone, photoURL } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log("[/api/signup] user already exists:", existingUser.email);
      return NextResponse.json({ message: "User already exists", user: existingUser }, { status: 200 });
    }

    const data: any = {
      name,
      email,
      uid, 
      image: photoURL,
      authProvider: authProvider === "GOOGLE" ? "GOOGLE" : "PHONE",
    };

    if (phone) data.phone = phone;

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const newUser = await prisma.user.create({ data });

    console.log("[/api/signup] user created id:", newUser.id);
    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      message: "Error creating user", 
      error: error.message 
    }, { status: 500 });
  }
}