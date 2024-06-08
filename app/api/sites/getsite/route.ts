import Site from "@/models/Site";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { id } = reqBody;
    const site = await Site.findById(id);

    if (!site) {
      return NextResponse.json({
        message: "No site found",
        success: false,
        data: {},
      });
    }

    const response = NextResponse.json({
      message: "Site retrieved successfully",
      success: true,
      data: site,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
