import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Doc from "@/models/Doc";
import { NextRequest, NextResponse } from "next/server";

connect();

const getDocs = async (): Promise<NextResponse> => {
  try {
    const doc = await Doc.find();

    if (!doc) {
      return NextResponse.json({
        message: "No docs found",
        success: false,
        data: {},
      });
    }

    const response = NextResponse.json({
      message: "Docs retrieved successfully",
      success: true,
      data: doc,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const GET = withAuth(getDocs);
