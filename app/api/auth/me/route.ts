import { connect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connect();

    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwtDecode(token) as jwt.JwtPayload;
    } catch (error) {
      console.error("JWT Error:", error);
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

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
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
