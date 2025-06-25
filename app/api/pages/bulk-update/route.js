import { dbConnect } from "@/app/lib/mongoose";
import Pages from "@/app/models/Page";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
  try {
    await dbConnect();

    const { pageIds, sharedPrompt } = await req.json();
    if (!pageIds || !sharedPrompt) {
      return NextResponse.json({ error: "pageIds and sharedPrompt are required" }, { status: 400 });
    }

    const pages = await Pages.find({ _id: { $in: pageIds } });
    if (!pages.length) {
      return NextResponse.json({ error: "No pages found for given IDs" }, { status: 404 });
    }

    const batchPrompt = `
${sharedPrompt}

Process the following CMS pages and return a JSON array with updated data for each:

${pages.map((page, index) => `
Page ${index + 1}:
ID: ${page._id}
Title: ${page.title}
Content: ${page.content}
Category: ${page.category || "General"}
`).join("\n")}

Return output like this (strict JSON only, no markdown):

[
  {
    "id": "665c1",
    "title": "...",
    "content": "...",
    "meta_title": "...",
    "meta_description": "...",
    "keywords": ["..."]
  },
  ...
]
    `;

    const result = await model.generateContent(batchPrompt);
    const raw = await result.response.text();
    const cleaned = raw.replace(/^```json\s*|```$/g, "").trim();

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Failed to parse Gemini response:", raw);
      throw new Error("Gemini output could not be parsed");
    }

    const operations = parsedOutput.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: {
          $set: {
            title: item.title,
            content: item.content,
            meta_title: item.meta_title,
            meta_description: item.meta_description,
            keywords: item.keywords,
          }
        }
      }
    }));

    const bulkResult = await Pages.bulkWrite(operations);

    return NextResponse.json({ message: "Bulk update successful", updated: bulkResult.nModified }, { status: 200 });

  } catch (error) {
    console.error("Bulk Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
