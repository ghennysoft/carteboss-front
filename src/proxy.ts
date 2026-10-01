// proxy.ts

import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/");

  const accessToken = request.cookies.get("access_token")?.value;

  // Route publique + utilisateur connecté
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Route privée + utilisateur non connecté
  if (!isPublicRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Ne pas intercepter :
     * - API
     * - fichiers Next.js
     * - images optimisées
     * - favicon
     * - fichiers statiques
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf)$).*)",
  ],
};
