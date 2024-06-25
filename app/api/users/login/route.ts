import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    //check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invlid password" }, { status: 400 });
    }

    //create token data
    // A JavaScript object (tokenData) is created to store essential user
    // information. In this case, it includes the user's unique identifier (id),
    // and email.

    const tokenData = {
      id: user._id,
      email: user.email,
      tempPassword: user.tempPassword,
    };

    // Create a token with expiration of 1 hour
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Create a JSON response indicating successful login
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user,
    });

    // Set the token as an HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
