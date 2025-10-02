import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "MongoDB connected successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return NextResponse.json({ message: "Failed to connect to MongoDB." }, { status: 500 });
  }
}