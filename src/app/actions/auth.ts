"use server";

import { cookies } from "next/headers";

export async function setSessionAction(profile: { id: string; role: string; id_number: string }) {
  const cookieStore = await cookies();
  
  const payload = JSON.stringify({
    id: profile.id,
    role: profile.role,
    id_number: profile.id_number,
  });

  cookieStore.set("atlas_session", payload, {
    httpOnly: true, // Prevents JavaScript (XSS) from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Sent over HTTPS only in production
    sameSite: "lax", // Guards against CSRF attacks
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionAction() {
  const cookieStore = await cookies();

  // 1. Primary deletion method
  cookieStore.delete("atlas_session");

  // 2. Fallback overwrite with zero lifetime to force immediate expiration across all browsers
  cookieStore.set("atlas_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}