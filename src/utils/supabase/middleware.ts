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

  // Helper function to force browser cache invalidation (prevents back-button restoring view)
  const applyNoCacheHeaders = (res: NextResponse) => {
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, private"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    res.headers.set("Surrogate-Control", "no-store");
    return res;
  };

  // 3. Protect /dashboard/* routes from unauthenticated users
  if (isDashboardRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    
    const redirectResponse = NextResponse.redirect(url);
    // Explicitly wipe the cookie if an invalid state reaches here
    redirectResponse.cookies.delete("atlas_session");
    
    return applyNoCacheHeaders(redirectResponse);
  }

  // 4. Role-Based Route Protection inside /dashboard
  if (isAuthenticated && session) {
    if (pathname.startsWith("/dashboard/teacher") && session.role !== "teacher") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/student";
      return applyNoCacheHeaders(NextResponse.redirect(url));
    }

    if (pathname.startsWith("/dashboard/student") && session.role !== "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/teacher";
      return applyNoCacheHeaders(NextResponse.redirect(url));
    }

    if (isAuthRoute) {
      const targetRoute = session.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";
      const url = request.nextUrl.clone();
      url.pathname = targetRoute;
      return applyNoCacheHeaders(NextResponse.redirect(url));
    }
  }

  // 5. Apply anti-cache headers on all protected responses
  const response = NextResponse.next();
  if (isDashboardRoute || isAuthRoute) {
    applyNoCacheHeaders(response);
  }

  return response;
}