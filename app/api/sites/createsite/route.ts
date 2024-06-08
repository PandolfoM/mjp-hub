import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Site from "@/models/Site";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { repo, env, title } = reqBody;

    const site = await Site.create({ repo, env, title });

    if (!site) {
      return NextResponse.json(
        { error: "Site creation failed" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      message: "Site created",
      success: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
