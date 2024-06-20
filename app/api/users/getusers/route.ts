import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

connect();

export async function GET() {
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
}
