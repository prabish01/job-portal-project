import { NextRequest } from "next/server";
import { auth } from "../auth";

export async function middleware(request: NextRequest) {
  const getSession = await auth();

  console.log("session", getSession);

  if (request.nextUrl.pathname.startsWith("/signin") && getSession) {
    return Response.redirect(request.nextUrl.origin);
  }
  if (request.nextUrl.pathname.startsWith("/profile") && !getSession) {
    return Response.redirect(request.nextUrl.origin);
  }
}
