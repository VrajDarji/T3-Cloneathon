import { NextRequest, NextResponse } from "next/server";
import { log } from "node:console";

const PUBLIC_ROUTES = ["/", "/signup", "/login", "/public"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = request.cookies.get("userId")?.value;

  const isPublic =
    pathname === "/" ||
    PUBLIC_ROUTES.some((route) => route !== "/" && pathname.startsWith(route));

  if (isPublic) {
    if (user && pathname === "/") {
      const chatUrl = new URL("/chat", request.url);
      return NextResponse.redirect(chatUrl);
    }

    return NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  if (user) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
