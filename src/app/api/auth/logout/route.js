import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return new Response("Logged out", {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
