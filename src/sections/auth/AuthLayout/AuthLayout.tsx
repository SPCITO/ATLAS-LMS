"use client";

import React from "react";
import Image from "next/image";
import { landingData } from "@/data/landingData";

import styles from "@/sections/auth/AuthLayout/AuthLayout.module.css"; // Scoped CSS module for AuthLayout

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { assets } = landingData;

  return (
    /* Root structural canvas frame container - using slate-950 for a rich, deep base */
    <div className={styles.container}>
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