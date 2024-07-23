import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const getDocs = async (): Promise<NextResponse> => {
  try {
    const docs = await Doc.find();

    const uniqueCategories = Array.from(
      new Set(
        docs.map((doc) =>
          JSON.stringify({ label: doc.category, value: doc.categoryRoute })
        )
      )
    ).map((str) => JSON.parse(str));

    uniqueCategories.push({ label: "New Category", value: "new" });

    if (!docs) {
      return NextResponse.json({
        message: "No docs found",
        success: false,
        data: [],
      });
    }

    const response = NextResponse.json({
      message: "Docs retrieved successfully",
      success: true,
      data: { docs, categories: uniqueCategories },
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const GET = withAuth(getDocs);
