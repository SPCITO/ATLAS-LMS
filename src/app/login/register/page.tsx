import React from "react";
import { AuthLayout } from "@/sections/auth/AuthLayout/AuthLayout";
import { RegisterForm } from "@/sections/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}