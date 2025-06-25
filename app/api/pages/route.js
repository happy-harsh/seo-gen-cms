import { dbConnect } from "@/app/lib/mongoose";
import Pages from "@/app/models/Page";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newPage = await Pages.create({ title, content, category });

    return NextResponse.json(newPage, { status: 201 });
  } catch (err) {
    console.error("Create Page Error:", err);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}



export async function GET(req) {
  await dbConnect();

  try {
    const allpages = await Pages.find({});
    return NextResponse.json(allpages, { status: 201 });
  } catch (err) {
    console.error("Get Page Error:", err);
    return NextResponse.json(
      { error: "Failed to show page" },
      { status: 500 }
    );
  }
}