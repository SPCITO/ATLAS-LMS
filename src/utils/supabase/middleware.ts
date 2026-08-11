import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Force HTTPS in Production Environments
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}`,
      301
    );
  }

  // 2. Read Secure HttpOnly session cookie
  const sessionCookie = request.cookies.get("atlas_session")?.value;
  let session: { id?: string; role?: "student" | "teacher"; id_number?: string } | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      session = null;
    }
  }

  const isAuthenticated = Boolean(session && session.role);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 3. Protect /dashboard/* routes from unauthenticated users
  if (isDashboardRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 4. Role-Based Route Protection inside /dashboard
  if (isAuthenticated && session) {
    if (pathname.startsWith("/dashboard/teacher") && session.role !== "teacher") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/student";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/student") && session.role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/teacher";
      return NextResponse.redirect(url);
    }

    if (isAuthRoute) {
      const targetRoute = session.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
      const url = request.nextUrl.clone();
      url.pathname = targetRoute;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}