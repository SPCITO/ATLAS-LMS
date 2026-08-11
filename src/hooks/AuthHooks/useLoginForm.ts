"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@refinedev/core";
import { loginData } from "@/data/loginData";


export function useLoginForm() {
  const router = useRouter();
  const { mutate: login } = useLogin();
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState(""); // Add state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ idNumber?: string; password?: string }>({});
  const [shake, setShake] = useState(false);

  const { routing } = loginData;

  const validate = () => {
    const next: { idNumber?: string; password?: string } = {};

    if (!idNumber.trim()) {
      next.idNumber = "Enter your ID number to continue.";
    }
    if (!password) {
      next.password = "Enter your password to continue.";
    }

    return next;
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    const sanitizedId = idNumber.toUpperCase().trim();

    // Pass both idNumber and password
    login(
      { idNumber: sanitizedId, password },
      {
        onSuccess: (data: any) => {
          setIsSubmitting(false);

          if (data?.success === false) {
            setErrors({
              idNumber: data?.error?.message || "Invalid ID Number or Password.",
            });
            triggerShake();
            return;
          }

          router.refresh();

          if (data?.redirectTo) {
            router.push(data.redirectTo);
          } else if (sanitizedId.startsWith("TCH-") || sanitizedId === "TEACHER") {
            router.push(routing?.teacherTargetRoute || "/dashboard/teacher");
          } else {
            router.push(routing?.studentTargetRoute || "/dashboard/student");
          }
        },
        onError: (err: any) => {
          setErrors({
            idNumber: err?.message || "Invalid credentials.",
          });
          triggerShake();
          setIsSubmitting(false);
        },
      }
    );
  };

  return {
    idNumber,
    setIdNumber,
    password,
    setPassword,
    isSubmitting,
    errors,
    setErrors,
    shake,
    handleSubmit,
    router,
  };
}