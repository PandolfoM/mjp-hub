import { connect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const token = cookies().get("token");

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded = jwtDecode(token.value) as jwt.JwtPayload;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("favorites");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
