import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const saveDoc = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const reqBody = await req.json();
    const { route, content } = reqBody;

    const doc = await Doc.findOneAndUpdate(
      { "pages.route": route },
      { $set: { "pages.$.content": content } },
      { new: true }
    );

    if (!doc) {
      return NextResponse.json({
        message: "No doc found",
        success: false,
        data: {},
      });
    }

    const response = NextResponse.json({
      message: "Doc saved successfully",
      success: true,
      data: doc,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(saveDoc);
