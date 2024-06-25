import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { password } = req;
    // Get the token from cookies
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "No token found", success: false },
        { status: 401 }
      );
    }

    // Verify and decode the token
    const decoded: any = jwt.verify(
      token.value,
      process.env.TOKEN_SECRET as string
    );

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token", success: false },
        { status: 401 }
      );
    }

    // Get the user ID from the decoded token
    const userId = decoded.id as string;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the user from the database and update the password
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        password: hashedPassword,
        tempPassword: false,
        $unset: { expireAt: "" },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found", success: false },
        { status: 404 }
      );
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      tempPassword: user.tempPassword,
    };

    const updateToken = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", updateToken, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
