import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { uid, siteId } = req;

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
}
