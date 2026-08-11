"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useLoginForm } from "@/hooks/AuthHooks/useLoginForm";
import { loginData } from "@/data/loginData";
import { landingData } from "@/data/landingData";

import styles from "@/sections/auth/AuthLayout/AuthLayout.module.css"; // Scoped CSS module for AuthLayout

// List of hardcoded mock IDs that can bypass verification checks
const MOCK_CREDENTIALS_LIST = [
  { id: "TCH-99410", label: "Teacher Demo Account" },
  { id: "STD-20261", label: "Student Demo Account" },
];

export function LoginForm() {
  const {
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
  } = useLoginForm();

  const { meta } = loginData;
  const { assets } = landingData;

  // Handles uppercase transformation and allows flexible formats up to 15 characters
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and strip out special characters except hyphens
    const rawVal = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");

    // Cap string at 15 characters total
    const formatted = rawVal.slice(0, 15);

    setIdNumber(formatted);

    if (errors.idNumber) {
      setErrors((prev) => ({ ...prev, idNumber: undefined }));
    }
  };

  // Helper to quickly fill the form for testing
  const handleSelectMockAccount = (id: string) => {
    setIdNumber(id);
    if (errors.idNumber) setErrors((prev) => ({ ...prev, idNumber: undefined }));
  };

  return (
    <Card className={`${styles.card} ${shake ? styles.shake : ""}`}>
      {/* LEFT SIDE: Input Controls Layout */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.fieldEnter} style={{ animationDelay: "0ms" }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              className={styles.backLink}
            >
              <ArrowLeft className={styles.backArrow} />
              Back to home
            </button>
          </div>

          <div
            className={`${styles.headerGroup} ${styles.fieldEnter}`}
            style={{ animationDelay: "40ms" }}
          >
            <span className={styles.accessBadge}>Secure Access Node</span>
            <h2 className={styles.title}>Account Verification</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* School ID Input Node */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "80ms" }}
            >
              <label htmlFor="login-id" className={styles.label}>
                School ID Number
              </label>
              <div className={styles.inputWrapper}>
                <User
                  className={`${styles.inputIcon} ${
                    errors.idNumber ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="login-id"
                  type="text"
                  placeholder="e.g., STD-2026-0001 or TCH-12345"
                  value={idNumber}
                  onChange={handleIdChange}
                  maxLength={15} // Updated to allow up to 15 characters
                  className={`${styles.input} uppercase ${
                    errors.idNumber ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {errors.idNumber && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.idNumber}
                </p>
              )}
            </div>

            {/* Password Input Node */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "120ms" }}
            >
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock
                  className={`${styles.inputIcon} ${
                    errors.password ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`${styles.input} ${
                    errors.password ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {errors.password && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.password}
                </p>
              )}
            </div>

            <div className={styles.actionArea}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    <span>Verifying Identity...</span>
                  </>
                ) : (
                  "Continue to Portal"
                )}
              </Button>

              <p className={styles.footerNotice}>{meta.footerNotice}</p>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Branded Media Screen */}
      <div className={styles.mediaSection}>
        <div className={styles.bgImageWrapper}>
          <Image
            src={assets.backgroundImagePath}
            alt="Canvas Background"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className={styles.mediaBgImage}
          />
        </div>
        <div className={styles.bgRadialOverlay} />

        <div className={styles.mediaContent}>
          <div className={styles.logoWrapper}>
            <Image
              src={assets.logoPath}
              alt="Logo"
              fill
              sizes="(max-width: 768px) 64px, 96px"
              priority
              className={styles.logoImage}
            />
          </div>

          <div className={styles.mediaTextGroup}>
            <h1 className={styles.mediaTitle}>{meta.title}</h1>
            <p className={styles.mediaDescription}>{meta.description}</p>
          </div>
        </div>

        <div className={styles.mediaFooterBadge}>
          <span className={styles.mediaFooterText}>
            Identity Node Pre-Verification
          </span>
        </div>
      </div>
    </Card>
  );
}