"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Shield, Terminal } from "lucide-react";
import { landingData } from "@/data/landingData";
import { TypewriterText } from "@/components/ui/TypewriterText";
import styles from "@/app/home.module.css"; // Scoped CSS module for landing page

const iconMap = {
  Compass: Compass,
  Shield: Shield,
  Terminal: Terminal,
};

export default function Home() {
  const { meta, assets, hero, features } = landingData;

  // Track sequence stage for hero text transitions
  const [stage, setStage] = useState<"badge" | "title1" | "title2" | "done">("badge");

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <div className={styles.logoBox}>
            <Image
              src={assets.logoPath}
              alt="Institutional Branding Identity Logo"
              fill
              style={{ objectFit: "contain", padding: "0.25rem" }}
            />
          </div>
          <span className={styles.brandName}>
            {meta.systemName}
          </span>
        </div>

        <Link href="/login" className={styles.signInLink}>
          Sign In
        </Link>
      </header>

      {/* Main Hero Section with scoped background image and dark overlay */}
      <main className={styles.main}>
        {/* Hero Background Image */}
        <div className={styles.heroBgWrapper}>
          <Image
            src="/background/green.png"
            alt="Institutional Campus Context Background"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Dark Tint Overlay for Image Contrast */}
        <div className={styles.darkOverlay} />

        {/* Grid Overlay */}
        <div className={styles.gridOverlay} />

        {/* Accent Flare */}
        <div className={styles.accentFlare} />

        {/* Hero Content Container */}
        <div className={styles.heroContent}>
          {/* System Tag Badge */}
          <div className={styles.badge}>
            <span className={styles.pulseDot} />
            <TypewriterText
              text={meta.badgeText}
              speed={25}
              delay={100}
              onComplete={() => setStage("title1")}
              showCursor
            />
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            {stage !== "badge" && (
              <TypewriterText
                text={hero.titleLineOne}
                speed={35}
                onComplete={() => setStage("title2")}
                showCursor
              />
            )}
            <br />
            {(stage === "title2" || stage === "done") && (
              <span className={styles.gradientText}>
                <TypewriterText
                  text={hero.gradientText}
                  speed={35}
                  onComplete={() => setStage("done")}
                  showCursor
                />
              </span>
            )}
          </h1>

          {/* Description */}
          <p className={`${styles.description} ${styles.fadeSlideUp} ${styles.delay100}`}>
            {hero.description}
          </p>

          {/* Action CTA Button */}
          <div className={`${styles.ctaWrapper} ${styles.fadeSlideUp} ${styles.delay200}`}>
            <Link href="/login" className={styles.ctaButton}>
              {hero.ctaButtonText}
              <ArrowRight className={styles.ctaIcon} />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Features */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          {features.map((feature, idx) => {
            const IconComponent = iconMap[feature.icon] || Compass;
            const delayClass = styles[`delay${(idx + 1) * 100}` as keyof typeof styles] || "";

            return (
              <div 
                key={feature.id} 
                className={`${styles.featureCard} ${styles.fadeSlideUp} ${delayClass}`}
              >
                <div className={styles.featureIconWrapper}>
                  <IconComponent className={styles.featureIcon} />
                </div>
                <div>
                  <h4 className={styles.featureTitle}>
                    <TypewriterText
                      text={feature.title}
                      speed={30}
                      delay={200 + idx * 150}
                      showCursor={false}
                    />
                  </h4>
                  <p className={styles.featureDesc}>
                    <TypewriterText
                      text={feature.description}
                      speed={20}
                      delay={400 + idx * 150}
                      showCursor={false}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
}