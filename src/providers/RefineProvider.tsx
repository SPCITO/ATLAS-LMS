"use client"

import React from "react";
import { Refine, DataProvider, AuthProvider } from "@refinedev/core";
// 1. Remove createClient import from @supabase/supabase-js
// 2. Import your central singleton instance:
import { supabaseClient } from "@/lib/supabaseClient";
import { setSessionAction, clearSessionAction } from "@/app/actions/auth";

// Clean helper: Strips symbols and normalizes ID
const cleanIdNumber = (rawId: any): string => {
  if (!rawId) return "";
  return String(rawId).replace(/[`'"]/g, "").trim().toUpperCase();
};

// Helper: Formats raw profile DB objects without breaking UUID references
function formatIdentity(profile: any, fallbackEmail?: string) {
  if (!profile) return null;

  const isTeacher = profile.role === "teacher" || profile.role === "faculty";
  const fullName = profile.full_name || profile.teacher_full_name || profile.student_full_name || "User Account";

  const primaryDept = profile.department || profile.course_strand || (isTeacher ? "Faculty Core" : "General");

  return {
    ...profile,
    id: profile.id || profile.uuid,
    uuid: profile.id || profile.uuid,
    id_number: profile.id_number || profile.id,
    
    email: profile.email || fallbackEmail || "",
    role: profile.role || "student",
    
    full_name: fullName,
    student_full_name: !isTeacher ? fullName : "",
    teacher_full_name: isTeacher ? fullName : "",
    
    grade_level: profile.grade_level || profile.gradeLevel || (isTeacher ? "Faculty Core" : "Year 3"),
    gradeLevel: profile.grade_level || profile.gradeLevel || (isTeacher ? "Faculty Core" : "Year 3"),
    section_name: primaryDept,
    course_strand: profile.course_strand || primaryDept,
    department: profile.department || primaryDept,
    course_code: profile.id_number || "N/A",
  };
}

const setSessionCookie = async (profile: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("atlas_user", JSON.stringify(profile));
  }
  try {
    await setSessionAction(profile);
  } catch (err) {
    console.warn("Server action failed to set session cookie:", err);
  }
};

const clearSessionCookie = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("atlas_user");
  }
  try {
    await clearSessionAction();
  } catch (err) {
    console.warn("Server action failed to clear session cookie:", err);
  }
};

export function RefineProvider({ children }: { children: React.ReactNode }) {
  const realSupabaseAuthProvider: AuthProvider = {
    login: async ({ idNumber, password }) => {
      const sanitizedId = cleanIdNumber(idNumber);

      if (!sanitizedId) {
        return {
          success: false,
          error: { name: "AuthError", message: "ID Number is required." },
        };
      }

      const { data: profile, error: profileErr } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id_number", sanitizedId)
        .maybeSingle();

      if (profileErr || !profile) {
        return {
          success: false,
          error: {
            name: "AuthError",
            message: "ID Number not registered. Please register first.",
          },
        };
      }

      if (profile.email) {
        const { error: authError } = await supabaseClient.auth.signInWithPassword({
          email: profile.email,
          password: password,
        });

        if (authError) {
          return {
            success: false,
            error: { name: "AuthError", message: "Invalid password." },
          };
        }
      }

      const formatted = formatIdentity(profile);
      await setSessionCookie(formatted);

      const targetRoute =
        profile.role === "teacher"
          ? "/dashboard/teacher"
          : "/dashboard/student";

      return { success: true, redirectTo: targetRoute };
    },

    register: async ({
      idNumber,
      fullName,
      email,
      role,
      courseStrand,
      department,
      password,
    }) => {
      const sanitizedId = cleanIdNumber(idNumber);

      if (!sanitizedId) {
        return {
          success: false,
          error: { name: "RegistrationError", message: "Invalid ID Number." },
        };
      }

      const { data: existing } = await supabaseClient
        .from("profiles")
        .select("id_number")
        .eq("id_number", sanitizedId)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: {
            name: "RegistrationError",
            message: "This ID Number is already registered.",
          },
        };
      }

      let authUserId = crypto.randomUUID();

      if (email && email.trim() !== "") {
        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName,
              id_number: sanitizedId,
              role: role,
            },
          },
        });

        if (authError) {
          return {
            success: false,
            error: { name: "RegistrationError", message: authError.message },
          };
        }

        if (authData?.user) {
          authUserId = authData.user.id;
        }
      }

      const { data: newProfile, error: profileError } = await supabaseClient
        .from("profiles")
        .upsert(
          {
            id: authUserId,
            id_number: sanitizedId,
            full_name: fullName,
            email: email ? email.trim() : null,
            role: role,
            course_strand: role === "student" ? courseStrand : null,
            department: role === "teacher" ? department : null,
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (profileError || !newProfile) {
        return {
          success: false,
          error: {
            name: "RegistrationError",
            message: profileError?.message || "Failed to create profile record.",
          },
        };
      }

      const formatted = formatIdentity(newProfile);
      await setSessionCookie(formatted);

      const targetRoute =
        role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";

      return { success: true, redirectTo: targetRoute };
    },

    check: async () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("atlas_user");
        if (user) return { authenticated: true };
      }
      return { authenticated: false, redirectTo: "/login" };
    },

    getIdentity: async () => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("atlas_user");
        if (savedUser) {
          try {
            const profile = JSON.parse(savedUser);
            return formatIdentity(profile);
          } catch (e) {
            console.error("Failed to parse cached profile:", e);
          }
        }
      }

      const { data: sessionData } = await supabaseClient.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) return null;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const formatted = formatIdentity(profile, user.email);
        if (typeof window !== "undefined") {
          localStorage.setItem("atlas_user", JSON.stringify(formatted));
        }
        return formatted;
      }

      return formatIdentity({
        id: user.id,
        id_number: user.user_metadata?.id_number || user.id,
        role: user.user_metadata?.role || "student",
        full_name: user.user_metadata?.full_name || "User Account",
        email: user.email,
      });
    },

    logout: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("atlas_user");
        await clearSessionCookie();
        await supabaseClient.auth.signOut();
        window.location.href = "/login";
      }
      return { success: true, redirectTo: "/login" };
    },
    onError: async (error) => ({ error }),
  };

  const supabaseDataProvider: DataProvider = {
    getList: async ({ resource, filters }) => {
      let query = (supabaseClient.from(resource as any) as any).select("*");

      if (filters && filters.length > 0) {
        for (const filter of filters) {
          if ("field" in filter && "value" in filter) {
            const val = filter.value;

            if (val !== undefined && val !== null && val !== "") {
              if (typeof val === "string" && val.includes(",")) {
                const valuesArray = val.split(",").map((v) => v.trim());
                query = query.in(filter.field, valuesArray);
              } else if (Array.isArray(val)) {
                query = query.in(filter.field, val);
              } else {
                query = query.eq(filter.field, val);
              }
            }
          }
        }
      }

      const { data, error } = await query;
      if (error) {
        console.error(`Error fetching list for ${resource}:`, error.message);
        return { data: [], total: 0 };
      }

      return { data: data || [], total: data?.length || 0 };
    },

    getOne: async ({ resource, id }) => {
      if (!id) return { data: {} as any };
      const { data } = await (supabaseClient.from(resource as any) as any)
        .select("*")
        .eq("id", id)
        .single();
      return { data };
    },
    create: async ({ resource, variables }) => {
      const { data, error } = await (supabaseClient.from(resource as any) as any)
        .insert(variables as any)
        .select()
        .single();
      if (error) throw error;
      return { data };
    },
    update: async ({ resource, id, variables }) => {
      const { data, error } = await (supabaseClient.from(resource as any) as any)
        .update(variables as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { data };
    },
    deleteOne: async ({ resource, id }) => {
      const { data, error } = await (supabaseClient.from(resource as any) as any)
        .delete()
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { data };
    },
    getApiUrl: () => process.env.NEXT_PUBLIC_SUPABASE_URL!,
  };

  return (
    <Refine
      dataProvider={supabaseDataProvider}
      authProvider={realSupabaseAuthProvider}
      resources={[
        { name: "profiles" },
        { name: "courses" },
        { name: "modules" },
        { name: "assessments" },
        { name: "enrollments" },
      ]}
    >
      {children}
    </Refine>
  );
}