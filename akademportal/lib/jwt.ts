import jwt, { type SignOptions } from "jsonwebtoken";

const SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export function signAccessToken(payload: JwtPayload, expiresIn: string | number = "7d") {
  if (!SECRET) throw new Error("NEXTAUTH_SECRET is not set");
  const opts: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  return jwt.sign({ ...payload }, SECRET, opts);
}

export function verifyAccessToken(token: string): JwtPayload {
  if (!SECRET) throw new Error("NEXTAUTH_SECRET is not set");
  return jwt.verify(token, SECRET) as JwtPayload;
}
