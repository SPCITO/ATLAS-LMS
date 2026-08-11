"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Shield, Terminal } from "lucide-react";
import { landingData } from "@/data/landingData";
import { TypewriterText } from "@/components/ui/TypewriterText";
import styles from "@/app/home.module.css";

const iconMap = {
  Compass: Compass,
  Shield: Shield,
  Terminal: Terminal,
};

export default function Home() {
  const { meta, assets, hero, features } = landingData;

  // Single boolean flag to trigger title animation after badge completes
  const [badgeComplete, setBadgeComplete] = useState(false);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <div className={styles.logoBox}>
            <Image
              src={assets.logoPath}
              alt={`${meta.systemName} Logo`}
              fill
              style={{ objectFit: "contain", padding: "0.25rem" }}
            />
          </div>
          <span className={styles.brandName}>{meta.systemName}</span>
        </div>

        <Link href="/login" className={styles.signInLink}>
          Sign In
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className={styles.main}>
        {/* Background Image */}
        <div className={styles.heroBgWrapper}>
          <Image
            src={assets.backgroundImagePath}
            alt="Institutional Campus Background"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Tint Overlays */}
        <div className={styles.darkOverlay} />
        <div className={styles.gridOverlay} />
        <div className={styles.accentFlare} />

        {/* Hero Content Container */}
        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.pulseDot} />
            <TypewriterText
              text={meta.badgeText}
              speed={25}
              delay={100}
              onComplete={() => setBadgeComplete(true)}
              showCursor
            />
          </div>

          {/* Unified Single Title */}
          <h1 className={styles.title}>
            {badgeComplete && (
              <TypewriterText
                text={hero.title}
                speed={30}
                showCursor
              />
            )}
          </h1>

          {/* Subtitle Description */}
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