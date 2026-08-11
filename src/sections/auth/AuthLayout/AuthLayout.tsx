"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { landingData } from "@/data/landingData";
import { UserPlus, LogIn } from "lucide-react";

import styles from "@/sections/auth/AuthLayout/AuthLayout.module.css"; // Scoped CSS module for AuthLayout 

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { assets } = landingData;
  const pathname = usePathname();
  const router = useRouter();

  // Determine active view to render correct helper details
  const isRegisterPage = pathname === "/register";

  return (
    /* Root structural canvas frame container - using slate-950 for a rich, deep base */
    <div className={styles.container}>
      {/* STICKY CORNER FLOATING NAV BUTTON */}
      <div className={styles.floatingNav}>
        {isRegisterPage ? (
          <button
            onClick={() => router.push("/login")}
            className={`${styles.navBtn} ${styles.signInBtn}`}
          >
            <LogIn className={`${styles.iconSm} ${styles.emeraldIconLight}`} />
            <span>Sign In</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/login/register")}
            className={`${styles.navBtn} ${styles.registerBtn}`}
          >
            <UserPlus className={`${styles.iconSm} ${styles.emeraldIconSoft}`} />
            <span>Register Account</span>
          </button>
        )}
      </div>

      {/* Background Image Layer Container */}
      <div className={styles.bgLayer}>
        <Image
          src={assets.backgroundImagePath}
          alt="System Core Graphic Canvas"
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        {/* Toned-down Dark Overlay Tint */}
        <div className={styles.bgDarkTint} />
      </div>

      {/* Balanced Vignette Overlay */}
      <div className={styles.vignetteOverlay} />

      {/* Environmental accent glows */}
      <div className={styles.topGlow} />
      <div className={styles.bottomGlow} />

      {/* Container frame for split floating form panel */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}