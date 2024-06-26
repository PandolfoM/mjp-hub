import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Site from "@/models/Site";
import { NextRequest, NextResponse } from "next/server";

connect();

const getSites = async (req: NextRequest): Promise<NextResponse> => {
  const reqBody = await req.json();
  const { search } = reqBody;

  try {
    let sites = [];

    if (search) {
      const query = search ? { title: { $regex: search, $options: "i" } } : {};
      sites = await Site.find(query).select("-deployments");
    } else {
      sites = await Site.find().limit(20).select("-deployments");
    }

    if (!sites) {
      return NextResponse.json({
        message: "No sites found",
        success: false,
        sites: [],
      });
    }

    const response = NextResponse.json({
      message: "Sites retrieved successfully",
      success: true,
      sites,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(getSites);
