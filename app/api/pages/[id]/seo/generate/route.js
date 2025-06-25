
import Pages from "@/app/models/Page";
import { dbConnect } from "@/app/lib/mongoose";
import { generateSEOWithGemini } from "@/app/lib/gemini";
import { NextResponse } from "next/server";


export async function POST(req, { params }) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { id } = await params;
        console.log(id)
       
        const page = await Pages.findById(id);
        if (!page) {
          return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }
    
        const { title, content, category } = page;

        console.log(page)

        await dbConnect();

        const seo = await generateSEOWithGemini(title, content, category);

        const updatedPage = await Pages.findByIdAndUpdate(
            id,
            {
                $set: {
                    meta_title: seo.meta_title,
                    meta_description: seo.meta_description,
                    keywords: seo.keywords,
                },
            },
            { new: true }
        );

        return NextResponse.json({ message: "SEO generated", data: updatedPage }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
