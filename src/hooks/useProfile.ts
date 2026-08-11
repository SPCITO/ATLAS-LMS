"use client";

import { useState } from "react";
import { useGetIdentity, useNotification, useLogout } from "@refinedev/core";
import { PROFILE_CONTENT } from "@/data/profileData";

// Define identity interface matching public.profiles schema
export interface UserIdentityProfile {
  id: string;
  id_number: string;
  full_name: string;
  email?: string;
  role: "teacher" | "student" | "admin" | "faculty" | string;
  course_strand?: string;
  department?: string;
  [key: string]: any;
}

export function useProfile() {
  const { data: identity, isLoading } = useGetIdentity<UserIdentityProfile>();
  const { open } = useNotification();
  const { mutateAsync: logout } = useLogout();

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Map to unified profile schema values
  const userDisplayName = identity?.full_name || PROFILE_CONTENT.roles.fallbackUser;
  const accountId = identity?.id_number || PROFILE_CONTENT.registryMatrix.fallbacks.id;
  const accountEmail = identity?.email || PROFILE_CONTENT.registryMatrix.fallbacks.email;
  const isFaculty = identity?.role === "teacher" || (identity?.role as string) === "faculty";

  // Academic track/department info based on role
  const academicProgram = isFaculty
    ? identity?.department || "General Faculty"
    : identity?.course_strand || "Unassigned Track";

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPassword(true);

    setTimeout(() => {
      setIsSubmittingPassword(false);
      open?.({
        type: "success",
        message: PROFILE_CONTENT.securityConfig.toast.message,
        description: PROFILE_CONTENT.securityConfig.toast.description,
      });
    }, 1200);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
      open?.({
        type: "error",
        message: PROFILE_CONTENT.securityConfig.errors.message,
        description: PROFILE_CONTENT.securityConfig.errors.description,
      });
    }
  };

  return {
    identity,
    isLoading,
    isSubmittingPassword,
    isLoggingOut,
    userDisplayName,
    accountId,
    accountEmail,
    isFaculty,
    academicProgram,
    handlePasswordResetRequest,
    handleSignOut,
  };
}