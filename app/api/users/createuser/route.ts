import { connect } from "@/lib/db";
import { withAuth } from "@/middleware/auth";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

connect();

const createUser = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const request = await req.json();
    const { email, name } = request;

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
      name,
      password,
      tempPassword: true,
      expireAt,
      favorites: [],
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
};

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

export const POST = withAuth(createUser);
