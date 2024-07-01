import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    // Check if the token is present in cookies
    const token = cookies().get("token");

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const response = NextResponse.json({
      message: "User signed out successfully",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Set the cookie to expire immediately
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
