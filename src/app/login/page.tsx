import React from "react";
import { AuthLayout } from "@/sections/auth/AuthLayout/AuthLayout";
import { LoginForm } from "@/sections/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}