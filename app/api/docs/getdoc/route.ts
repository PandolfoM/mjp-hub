import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const getDoc = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { category, route } = reqBody;

    const doc = await Doc.findOne(
      {
        categoryRoute: category,
        pages: { $elemMatch: { route: route } },
      },
      {
        "pages.$": 1, // This projection will include only the matched element in the 'pages' array
      }
    ).exec();

    if (!doc) {
      return NextResponse.json({
        message: "No doc found",
        success: false,
        data: null,
      });
    }

    const response = NextResponse.json({
      message: "Doc retrieved successfully",
      success: true,
      data: doc,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(getDoc);
