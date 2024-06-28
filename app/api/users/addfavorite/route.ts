import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

const addFavorite = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const request = await req.json();
    const { uid, siteId } = request;

    const updateUser = await User.findOneAndUpdate(
      {
        _id: uid,
      },
      {
        $push: { favorites: siteId },
      },
      { new: true }
    );

    if (!updateUser) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: updateUser });
  } catch (error) {
    return NextResponse.json({ error, success: false }, { status: 500 });
  }
};

export const POST = withAuth(addFavorite);
