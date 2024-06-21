import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { _id } = req;

    await User.findOneAndDelete({ _id });
    const users = await User.find();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
