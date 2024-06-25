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
    const { user, email, password, updateSelf } = req;

    if (user.email === email) {
      return NextResponse.json(
        { error: "Email is the same", success: false },
        { status: 500 }
      );
    }

    if (updateSelf) {
      // Get the token from cookies
      const token = request.cookies.get("token");

      if (!token) {
        return NextResponse.json(
          { error: "No token found", success: false },
          { status: 500 }
        );
      }

      // Verify and decode the token
      const decoded: any = jwtDecode(token.value);

      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid token", success: false },
          { status: 500 }
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
          { status: 500 }
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

      const response = NextResponse.json({ success: true, user: updateUser });

      response.cookies.set("token", updateToken, {
        httpOnly: true,
      });

      return response;
    } else {
      const password = generateTempPassword();
      const expireAt = new Date();

      // Expires in 7 days
      expireAt.setDate(expireAt.getDate() + 7);
      const updateUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          email,
          tempPassword: true,
          password,
          expireAt,
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
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateTempPassword(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
