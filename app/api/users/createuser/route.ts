import { connect } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { email } = req;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use", success: false },
        { status: 500 }
      );
    }

    const password = generateTempPassword();
    const expireAt = new Date();

    // Expires in 7 days
    expireAt.setDate(expireAt.getDate() + 7);

    // ! For testing only (expires in 1 minute)
    // expireAt.setMinutes(expireAt.getMinutes() + 1);

    const newUser = new User({
      email,
      password,
      tempPassword: true,
      expireAt,
    });
    await newUser.save();

    const users = await User.find();
    return NextResponse.json({
      message: `User: ${email} created`,
      success: true,
      users,
      password,
    });
  } catch (error) {
    return NextResponse.json({ error, success: false }, { status: 500 });
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
