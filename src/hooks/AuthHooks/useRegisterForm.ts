"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@refinedev/core";
import { loginData } from "@/data/loginData";

export type UserRole = "student" | "teacher";

export function useRegisterForm() {
  const router = useRouter();
  const { mutate: register } = useRegister();

  // Dual-Role Tracking State
  const [role, setRole] = useState<UserRole>("student");
  const [idNumber, setIdNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Context-specific details
  const [courseStrand, setCourseStrand] = useState("");
  const [department, setDepartment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    idNumber?: string;
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    courseStrand?: string;
    department?: string;
  }>({});
  const [shake, setShake] = useState(false);

  const { routing } = loginData;

  const validate = () => {
    const next: typeof errors = {};
    const sanitizedId = idNumber.replace(/[`'"]/g, "").trim().toUpperCase();

    if (!sanitizedId) {
      next.idNumber = `Enter your ${role === "student" ? "Student ID" : "Teacher ID"} number.`;
    }

    if (!fullName.trim()) {
      next.fullName = "Please enter your full name.";
    } else if (fullName.trim().length < 2) {
      next.fullName = "Name must be at least 2 characters.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!password) {
      next.password = "Please enter a password.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters long.";
    }

    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    // Role-specific field validation
    if (role === "student" && !courseStrand.trim()) {
      next.courseStrand = "Please specify your course or strand.";
    }

    if (role === "teacher" && !department.trim()) {
      next.department = "Please specify your academic department.";
    }

    return next;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIdNumber("");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCourseStrand("");
    setDepartment("");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.warn("Validation failed with errors:", validationErrors);
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    const sanitizedId = idNumber.replace(/[`'"]/g, "").trim().toUpperCase();

    register(
      {
        idNumber: sanitizedId,
        fullName,
        email,
        role,
        courseStrand: role === "student" ? courseStrand : undefined,
        department: role === "teacher" ? department : undefined,
        password,
      },
      {
        onSuccess: (response: any) => {
          setIsSubmitting(false);

          if (response?.success === false) {
            const rawMsg = response?.error?.message;
            const errorMsg =
              typeof rawMsg === "string" && rawMsg.trim() !== ""
                ? rawMsg
                : "Registration failed. Please check your credentials.";

            setErrors({ idNumber: errorMsg });
            triggerShake();
            return;
          }

          router.refresh();

          let targetRoute = response?.redirectTo;

          if (!targetRoute) {
            targetRoute =
              role === "teacher"
                ? routing?.teacherTargetRoute || "/dashboard/teacher"
                : routing?.studentTargetRoute || "/dashboard/student";
          }

          router.push(targetRoute);
        },
        onError: (err: any) => {
          const rawMsg = err?.message;
          const errorMsg =
            typeof rawMsg === "string" && rawMsg.trim() !== "" && rawMsg !== "{}"
              ? rawMsg
              : "Registration failed. ID may already exist or connection failed.";

          setErrors({ idNumber: errorMsg });
          triggerShake();
          setIsSubmitting(false);
        },
      }
    );
  };

  return {
    role,
    setRole: handleRoleChange,
    idNumber,
    setIdNumber,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    courseStrand,
    setCourseStrand,
    department,
    setDepartment,
    isSubmitting,
    errors,
    setErrors,
    shake,
    handleSubmit,
    router,
  };
}