import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./actions";

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/api/products",
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  const result = await getCurrentUser();

  if (!result.success || !result.data) {
    // Redirect to sign-in page for protected routes
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}
