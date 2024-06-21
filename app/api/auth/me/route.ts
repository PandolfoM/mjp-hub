import { connect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token");

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(
      token.value,
      process.env.TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password"); // Exclude the password field

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
