import { verifyToken } from "./jwt";
import { cookies } from "next/headers";

export function getUserFromToken() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("No token");
  return verifyToken(token); // throws if invalid
}
