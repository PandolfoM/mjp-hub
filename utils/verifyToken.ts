import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

// const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

interface DecodedToken extends JwtPayload {
  email?: string;
  id?: boolean;
}

export function verifyToken(token: string): {
  valid: boolean;
  decoded?: DecodedToken;
  error?: any;
} {
  try {
    const decoded = jwtDecode(token) as jwt.JwtPayload;
    // const decoded = jwt.verify(token, TOKEN_SECRET) as DecodedToken;
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
}
