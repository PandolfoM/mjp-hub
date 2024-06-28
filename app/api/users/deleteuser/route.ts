import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

const deleteUser = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const request = await req.json();
    const { _id } = request;

    await User.findOneAndDelete({ _id });
    const users = await User.find();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const POST = withAuth(deleteUser);
