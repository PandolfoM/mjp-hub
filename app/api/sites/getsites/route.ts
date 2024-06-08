import Site from "@/models/Site";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sites = await Site.find();

    if (!sites) {
      return NextResponse.json({
        message: "No sites found",
        success: false,
        data: [],
      });
    }

    const response = NextResponse.json({
      message: "Sites retrieved successfully",
      success: true,
      data: sites,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
