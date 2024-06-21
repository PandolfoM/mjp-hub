import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are considered public (accessible without a token)
  const isPublicPath = path === "/login";

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect logic based on the path and token presence
  if (isPublicPath && token) {
    // If trying to access a public path with a token, redirect to the home page
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If trying to access a protected path without a token, redirect to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (token) {
    try {
      const decoded: any = jwtDecode(token);

      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded.exp && decoded.exp < currentTime) {
        const response = NextResponse.redirect(
          new URL("/login", request.nextUrl)
        );
        response.cookies.set("token", "", {
          httpOnly: true,
          expires: new Date(0),
        }); // Delete the token
        return response;
      }

      if (decoded.tempPassword && path !== "/verify") {
        return NextResponse.redirect(new URL("/verify", request.nextUrl));
      }
    } catch (error) {
      console.error("Token verification or user fetching failed:", error);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

// It specifies the paths for which this middleware should be executed.
export const config = {
  matcher: ["/", "/login", "/admin", "/manage/:path*", "/verify"],
};
