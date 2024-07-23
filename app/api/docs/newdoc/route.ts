import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const newDoc = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { title, category, route, newCategory } = reqBody;

    const docCategory = category.value === "new" ? newCategory : category.label;
    const docCategoryRoute =
      category.value === "new"
        ? newCategory.toLowerCase().replace(/\s+/g, "")
        : category.value;

    const doc = await Doc.create({
      category: docCategory,
      categoryRoute: docCategoryRoute,
      pages: [
        {
          name: title,
          route: title.toLowerCase().replace(/\s+/g, ""),
          content: `<p>${title}</p>`,
        },
      ],
    });

    const docs = await Doc.find();

    const response = NextResponse.json({
      message: "Doc created successfully",
      success: true,
      newDoc: doc,
      data: docs,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(newDoc);
