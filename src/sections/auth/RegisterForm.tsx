"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Lock,
  Bookmark,
  IdCard,
  Loader2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useRegisterForm } from "@/hooks/AuthHooks/useRegisterForm";
import { landingData } from "@/data/landingData";
import { loginData } from "@/data/loginData";

import styles from "@/sections/auth/AuthLayout/AuthLayout.module.css";

export function RegisterForm() {
  const {
    role,
    setRole,
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
  } = useRegisterForm();

  const { meta } = loginData;
  const { assets } = landingData;

  const isStudent = role === "student";

  // Pre-fill ID field with prefix when switching roles
  useEffect(() => {
    const requiredPrefix = isStudent ? "STD-" : "TCH-";
    if (!idNumber || !idNumber.startsWith(requiredPrefix)) {
      setIdNumber(requiredPrefix);
    }
  }, [role, isStudent, setIdNumber, idNumber]);

  // Handle prefix control on ID Number
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const requiredPrefix = isStudent ? "STD-" : "TCH-";
    let val = e.target.value.toUpperCase();

    if (!val.startsWith(requiredPrefix)) {
      val = requiredPrefix;
    }

    const formatted = val.slice(0, 15);
    setIdNumber(formatted);

    if (errors.idNumber) {
      setErrors((prev) => ({ ...prev, idNumber: undefined }));
    }
  };

  // Evaluate password strength dynamically
  const passwordStrength = useMemo(() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "text-red-500", isWeak: true };
    if (score === 2 || score === 3) return { label: "Medium", color: "text-amber-500", isWeak: false };
    return { label: "Strong", color: "text-emerald-500", isWeak: false };
  }, [password]);

  // Live validation for password matching
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);

    if (password && val && password !== val) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: undefined,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }

    if (confirmPassword && val !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else if (confirmPassword && val === confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: undefined,
      }));
    }
  };

  return (
    <Card className={`${styles.card} ${shake ? styles.shake : ""}`}>
      {/* LEFT SIDE: Inputs and Selection Details */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.fieldEnter} style={{ animationDelay: "0ms" }}>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles.backLink}
            >
              <ArrowLeft className={styles.backArrow} />
              Back to Sign In
            </button>
          </div>

          <div
            className={`${styles.headerGroup} ${styles.fieldEnter}`}
            style={{ animationDelay: "40ms" }}
          >
            <span className={styles.accessBadge}>Atlas Security Registration</span>
            <h2 className={styles.title}>Account Registration</h2>
          </div>

          {/* INTERACTIVE ROLE SELECTION SWITCHER */}
          <div
            className={`${styles.roleSwitcher} ${styles.fieldEnter}`}
            style={{ animationDelay: "80ms" }}
          >
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`${styles.roleBtn} ${
                isStudent
                  ? styles.roleBtnActiveStudent
                  : styles.roleBtnInactive
              }`}
            >
              <GraduationCap className={styles.roleBtnIcon} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`${styles.roleBtn} ${
                !isStudent
                  ? styles.roleBtnActiveTeacher
                  : styles.roleBtnInactive
              }`}
            >
              <Building2 className={styles.roleBtnIcon} />
              Faculty
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* ID Code Field */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "120ms" }}
            >
              <label htmlFor="reg-id" className={styles.label}>
                {isStudent
                  ? "Assigned Student ID Number"
                  : "Assigned Faculty Code"}
              </label>
              <div className={styles.inputWrapper}>
                <IdCard
                  className={`${styles.inputIcon} ${
                    errors.idNumber ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="reg-id"
                  type="text"
                  placeholder={
                    isStudent ? "e.g., STD-2026-0001" : "e.g., TCH-2026-0089"
                  }
                  value={idNumber}
                  onChange={handleIdChange}
                  maxLength={15}
                  className={`${styles.input} ${styles.inputUppercase} ${
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

            {/* Full Name Input Field */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "160ms" }}
            >
              <label htmlFor="reg-name" className={styles.label}>
                Your Full Name
              </label>
              <div className={styles.inputWrapper}>
                <User
                  className={`${styles.inputIcon} ${
                    errors.fullName ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="reg-name"
                  type="text"
                  placeholder={
                    isStudent ? "e.g., Jason Adrian Platino" : "e.g., Dr. Alexander Vance"
                  }
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName)
                      setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  className={`${styles.input} ${
                    errors.fullName ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Address Input Field */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "200ms" }}
            >
              <div className={styles.labelWrapper}>
                <label htmlFor="reg-email" className={styles.label}>
                  Email Address
                </label>
                <span className={styles.optionalBadge}>Optional</span>
              </div>
              <div className={styles.inputWrapper}>
                <Mail
                  className={`${styles.inputIcon} ${
                    errors.email ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="e.g., user@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`${styles.input} ${
                    errors.email ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "240ms" }}
            >
              <div className={styles.labelWrapper}>
                <label htmlFor="reg-password" className={styles.label}>
                  Password
                </label>
                {passwordStrength && (
                  <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                    Strength: {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Lock
                  className={`${styles.inputIcon} ${
                    errors.password ? styles.iconError : styles.iconDefault
                  }`}
                />
                <input
                  id="reg-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`${styles.input} ${
                    errors.password ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {passwordStrength?.isWeak && (
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-500">
                  <ShieldAlert className="h-3 w-3" />
                  Weak password. Include numbers and special characters for higher security.
                </p>
              )}
              {errors.password && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div
              className={`${styles.fieldGroup} ${styles.fieldEnter}`}
              style={{ animationDelay: "280ms" }}
            >
              <label htmlFor="reg-confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <div className={styles.inputWrapper}>
                <CheckCircle2
                  className={`${styles.inputIcon} ${
                    errors.confirmPassword
                      ? styles.iconError
                      : styles.iconDefault
                  }`}
                />
                <input
                  id="reg-confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`${styles.input} ${
                    errors.confirmPassword ? styles.inputHasError : ""
                  }`}
                />
              </div>
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                  <ShieldCheck className="h-3 w-3" />
                  Passwords match.
                </p>
              )}
              {errors.confirmPassword && (
                <p className={styles.errorText}>
                  <AlertCircle className={styles.alertIcon} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* REQUIRED DYNAMIC FIELD INTERCHANGE BLOCK */}
            {isStudent ? (
              <div
                className={`${styles.fieldGroup} ${styles.fieldEnter}`}
                style={{ animationDelay: "320ms" }}
              >
                <label htmlFor="reg-course" className={styles.label}>
                  Course / Strand
                </label>
                <div className={styles.inputWrapper}>
                  <Bookmark
                    className={`${styles.inputIcon} ${
                      errors.courseStrand ? styles.iconError : styles.iconDefault
                    }`}
                  />
                  <input
                    id="reg-course"
                    type="text"
                    placeholder="e.g., BSCS or STEM"
                    value={courseStrand}
                    onChange={(e) => {
                      setCourseStrand(e.target.value);
                      if (errors.courseStrand)
                        setErrors((prev) => ({
                          ...prev,
                          courseStrand: undefined,
                        }));
                    }}
                    className={`${styles.input} ${
                      errors.courseStrand ? styles.inputHasError : ""
                    }`}
                  />
                </div>
                {errors.courseStrand && (
                  <p className={styles.errorText}>
                    <AlertCircle className={styles.alertIcon} />
                    {errors.courseStrand}
                  </p>
                )}
              </div>
            ) : (
              <div
                className={`${styles.fieldGroup} ${styles.fieldEnter}`}
                style={{ animationDelay: "320ms" }}
              >
                <label htmlFor="reg-dept" className={styles.label}>
                  Academic Department Assignment
                </label>
                <div className={styles.inputWrapper}>
                  <Building2
                    className={`${styles.inputIcon} ${
                      errors.department
                        ? styles.iconError
                        : styles.iconDefault
                    }`}
                  />
                  <input
                    id="reg-dept"
                    type="text"
                    placeholder="e.g., Computer Science Dept"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department)
                        setErrors((prev) => ({
                          ...prev,
                          department: undefined,
                        }));
                    }}
                    className={`${styles.input} ${
                      errors.department ? styles.inputHasError : ""
                    }`}
                  />
                </div>
                {errors.department && (
                  <p className={styles.errorText}>
                    <AlertCircle className={styles.alertIcon} />
                    {errors.department}
                  </p>
                )}
              </div>
            )}

            <div className={styles.actionArea}>
              <Button
                type="submit"
                disabled={isSubmitting || Boolean(errors.confirmPassword)}
                className={styles.submitBtn}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className={styles.spinner} />
                    <span>Establishing Network Node...</span>
                  </>
                ) : isStudent ? (
                  "Complete Student Setup"
                ) : (
                  "Initialize Faculty Node"
                )}
              </Button>

              <p className={styles.footerNotice}>
                Authorized entry matches structural data validation records
                within Atlas databases.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Visual Brand Canvas */}
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
            <p className={styles.mediaDescription}>
              Verify your physical school identity profile records to initiate
              security authorization.
            </p>
          </div>
        </div>

        <div className={styles.mediaFooterBadge}>
          <span className={styles.mediaFooterText}>
            {isStudent ? "Student Node Active" : "Faculty Node Active"}
          </span>
        </div>
      </div>
    </Card>
  );
}