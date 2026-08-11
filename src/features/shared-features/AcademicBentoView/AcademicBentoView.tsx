"use client";

import React from "react";
import Image from "next/image";
import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, Layers, Loader2 } from "lucide-react";
import { UserIdentityProfile } from "@/types";
import { landingData } from "@/data/landingData";

import styles from "@/features/shared-features/AcademicBentoView/AcademicBentoView.module.css";

interface AcademicBentoViewProps {
  roleTitle: string;
  navigationSlot: React.ReactNode;
  workspaceSlot: React.ReactNode;
}

export function AcademicBentoView({ roleTitle, navigationSlot, workspaceSlot }: AcademicBentoViewProps) {
  // Query real-time identity using the global shared profile definition type
  const { data: identity, isLoading } = useGetIdentity<UserIdentityProfile>();
  const { assets } = landingData;

  // Fallback checks to determine if user record represents an active student or teacher instance
  const userDisplayName = identity?.teacher_full_name || identity?.student_full_name || "User Account";
  const gradeLevel = identity?.grade_level || "Faculty";
  const sectionName = identity?.section_name || "Department";
  const courseCode = identity?.course_code;

  return (
    /* BASE CANVAS - Responsive Viewport Height and Scroll Control */
    <div className={styles.canvas}>
      {/* HIGH-VISIBILITY BACKGROUND IMAGE */}
      <div className={styles.bgOverlay}>
        <Image
          src="/Background/green.png"
          alt="Campus Architectural Framework Base"
          fill
          priority
          sizes="100vw" /* <--- Fixed for full-screen background */
          className={styles.bgImage}
        />
      </div>

      {/* Main Layout Container Frame */}
      <div className={styles.container}>
        {/* Structural Header with Embedded Branding Identity Logo */}
        <header className={styles.header}>
          <div className={styles.brandingGroup}>
            <div className={styles.logoContainer}>
              <Image
                src={assets?.logoPath || "/logo.png"}
                alt="Institutional Branding Logo Identity"
                fill
                priority
                sizes="(max-width: 768px) 48px, 64px" /* <--- Fixed for header logo */
                className={styles.logoImage}
              />
            </div>
            <div>
              <h1 className={styles.brandTitle}>Atlas</h1>
              <p className={styles.roleTitle}>{roleTitle} Hub</p>
            </div>
          </div>
        </header>

        {/* Dynamic Bento Matrix Layout */}
        <div className={styles.bentoGrid}>
          {/* Left Menu Column */}
          <div className={styles.navigationCol}>
            {/* 👤 Real-time Refine Profile Identity Card */}
            <Card className={styles.profileCard}>
              <CardContent className={styles.profileContent}>
                {isLoading ? (
                  <div className={styles.syncState}>
                    <Loader2 className={`h-3.5 w-3.5 ${styles.spin} ${styles.brandGreenText}`} />
                    Synchronizing Academic Context...
                  </div>
                ) : (
                  <div className={styles.profileRow}>
                    <div className={styles.profileMeta}>
                      {/* Avatar Anchor Box */}
                      <div className={styles.avatar}>
                        <User className="h-4 w-4 md:h-5 md:w-5 stroke-[2.2]" />
                      </div>

                      {/* Meta Matrix Data */}
                      <div className={styles.identityTextGroup}>
                        <h2 className={styles.userName}>
                          {userDisplayName}
                        </h2>

                        <div className={styles.userBadges}>
                          <span className={styles.badgeGroup}>
                            <Layers className={`h-3 w-3 ${styles.brandGreenText} shrink-0`} />
                            {gradeLevel} — {sectionName}
                          </span>

                          {courseCode && courseCode.trim() !== "" && (
                            <>
                              <span className={styles.dotSeparator}>•</span>
                              <span className={styles.courseBadge}>
                                <GraduationCap className="h-3 w-3 shrink-0" />
                                {courseCode}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Navigation Workspace Sub-Slot */}
            <div className={styles.navigationSlot}>
              {navigationSlot}
            </div>
          </div>

          {/* Right Core Action Workspace */}
          <div className={styles.workspaceCol}>
            {workspaceSlot}
          </div>
        </div>
      </div>
    </div>
  );
}