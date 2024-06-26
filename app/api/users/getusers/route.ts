import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

const getUsers = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const users = await User.find();

    if (!users) {
      return NextResponse.json({
        message: "No users found",
        success: false,
        data: [],
      });
    }

    const response = NextResponse.json({
      message: "Users retrieved successfully",
      success: true,
      data: users,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};

export const GET = withAuth(getUsers);
