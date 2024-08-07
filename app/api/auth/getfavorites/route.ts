import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import Site, { Site as TypeSite } from "@/models/Site";
import { NextRequest, NextResponse } from "next/server";

connect();

const getFavorites = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { favs } = await req.json();
    const favorites: TypeSite[] = [];

    for (let i = 0; i < favs.length; i++) {
      const site = await Site.findById(favs[i]);
      favorites.push(site);
    }

    return NextResponse.json({ favorites });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(getFavorites);
