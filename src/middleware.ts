import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("Bearer")?.value;
  const role = request.cookies.get("role")?.value;
  const id = request.cookies.get("currentUserId")?.value;
  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";
  const isSignupRoute = pathname === "/signup";

  // If an authenticated user tries to access /login or /signup, redirect them back
  if ((isLoginRoute || isSignupRoute) && (role || token || id)) {
    const referer = request.headers.get("referer");
    const fromParam = request.nextUrl.searchParams.get("from");

    // Prefer explicit from param, then same-origin referer, else fallback
    let redirectTarget: string | null = null;

    if (fromParam && typeof fromParam === "string") {
      redirectTarget = fromParam;
    } else if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (
          refererUrl.origin === request.nextUrl.origin &&
          // Avoid bouncing back to /login or /signup
          !refererUrl.pathname.startsWith("/login") &&
          !refererUrl.pathname.startsWith("/signup")
        ) {
          redirectTarget =
            refererUrl.pathname + refererUrl.search + refererUrl.hash;
        }
      } catch {
        // ignore bad referer
      }
    }

    const fallback = "/";
    const destination = new URL(redirectTarget || fallback, request.url);
    return NextResponse.redirect(destination);
  }

  // Below rules apply only to dashboard routes
  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  if (role === "2001") {
    const forbiddenUrl = new URL("/forbidden", request.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Forbid manager from add/edit user pages
  if (role === "3276") {
    const isNewUserPage = pathname.startsWith("/dashboard/users/new-user");
    const isUserEditPage = /^\/dashboard\/users\/[^/]+/.test(pathname);
    if (isNewUserPage || isUserEditPage) {
      const forbiddenUrl = new URL("/forbidden", request.url);
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
