import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { user, email, password } = req;
    // Get the token from cookies
    if (password) {
      const token = request.cookies.get("token");

      if (!token) {
        return NextResponse.json(
          { error: "No token found", success: false },
          { status: 401 }
        );
      }

      // Verify and decode the token
      const decoded: any = jwtDecode(token.value);

      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid token", success: false },
          { status: 401 }
        );
      }

      // Get the user ID from the decoded token
      // const userId = decoded.id as string;

      const hashedPassword = await bcrypt.hash(password, 10);

      // Fetch the user from the database and update the password
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          password: hashedPassword,
          email,
        },
        { new: true }
      );

      if (!updateUser) {
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
        expiresIn: "1h",
      });

      const response = NextResponse.json({ success: true, user: updateUser });

      response.cookies.set("token", updateToken, {
        httpOnly: true,
      });

      return response;
    } else {
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          email,
        },
        { new: true }
      );

      if (!updateUser) {
        return NextResponse.json(
          { error: "User not found", success: false },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, user: updateUser });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
