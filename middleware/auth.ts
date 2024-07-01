import { verifyToken } from "@/utils/verifyToken";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token =
      cookies().get("token")?.value ||
      headers().get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { valid, decoded, error } = verifyToken(token);

    if (error) {
      return NextResponse.json(
        { error: "Error verifying token" },
        { status: 401 }
      );
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // (req as any) = decoded;
    // Attach the decoded token to the request object

    return handler(req);
  };
}
