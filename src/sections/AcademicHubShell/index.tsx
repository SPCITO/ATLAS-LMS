"use client";

import React, { useState, useEffect } from "react";
import { AcademicBentoView } from "@/features/shared-features/AcademicBentoView/AcademicBentoView";
import { LiveStreamIndicator } from "@/features/students/LiveStreamIndicator/LiveStreamIndicator";
import { ProfileView } from "@/features/shared-features/ProfileView/ProfileView";
import { Button } from "@/components/ui/button";
import { User, BookOpen, UserPlus } from "lucide-react";

import {
  SubjectSelector,
  CourseWorkspace,
} from "@/features/shared-features/subject-hub";
import { JoinCourseModal } from "@/features/students/JoinCourseModal/JoinCourseModal";
import { useSubjectSelector } from "@/hooks/useSubjectSelector";

import styles from "@/sections/AcademicHubShell/AcademicHubShell.module.css";

interface AcademicHubShellProps {
  roleTitle: string;
  isTeacher: boolean;
}

export function AcademicHubShell({
  roleTitle,
  isTeacher,
}: AcademicHubShellProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<string | number>("");
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"workspace" | "profile">(
    "workspace",
  );
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const { subjects, refetch } = useSubjectSelector();

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      const exists = subjects.some((s) => s.id === activeSubjectId);
      if (!activeSubjectId || !exists) {
        setActiveSubjectId(subjects[0].id);
      }
    }
  }, [subjects, activeSubjectId]);

  const handleJoinSuccess = () => {
    if (typeof refetch === "function") {
      refetch();
    }
  };

  return (
    <>
      <AcademicBentoView
        roleTitle={roleTitle}
        navigationSlot={
          <div className={styles.navigationContainer}>
            {/* View Switcher Toggles */}
            <div className={styles.tabGroup}>
              <Button
                onClick={() => setCurrentTab("workspace")}
                className={`${styles.tabBtn} ${
                  currentTab === "workspace"
                    ? styles.tabBtnActive
                    : styles.tabBtnInactive
                }`}
              >
                <BookOpen className={`${styles.iconSm} stroke-[2.2]`} />
                Workspace
              </Button>
              <Button
                onClick={() => setCurrentTab("profile")}
                className={`${styles.tabBtn} ${
                  currentTab === "profile"
                    ? styles.tabBtnActive
                    : styles.tabBtnInactive
                }`}
              >
                <User className={`${styles.iconSm} stroke-[2.2]`} />
                Profile
              </Button>
            </div>

            {/* Live Streaming Indicator */}
            <div className={styles.indicatorWrapper}>
              <LiveStreamIndicator
                isTeacher={isTeacher}
                activeSubjectId={activeSubjectId}
              />
            </div>

            {/* Join Class Action Button for Students */}
            {!isTeacher && (
              <div className="w-full">
                <Button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-10 rounded-lg transition-colors text-xs uppercase tracking-wider"
                >
                  <UserPlus className={`${styles.iconSm} stroke-[2.2]`} />
                  Join Class with Code
                </Button>
              </div>
            )}

            {/* Subject Selector Card */}
            <div className={styles.subjectSelectorWrapper}>
              <SubjectSelector
                activeSubjectId={activeSubjectId}
                setActiveSubjectId={setActiveSubjectId}
                onSubjectChange={() => {
                  setActivePdfUrl(null);
                  setCurrentTab("workspace");
                }}
              />
            </div>
          </div>
        }
        workspaceSlot={
          currentTab === "profile" ? (
            <ProfileView />
          ) : (
            <div className="w-full flex-1 flex flex-col min-h-[400px]">
              <CourseWorkspace
                activeSubjectId={activeSubjectId}
                isTeacher={isTeacher}
                activePdfUrl={activePdfUrl}
                setActivePdfUrl={setActivePdfUrl}
              />
            </div>
          )
        }
      />

      <JoinCourseModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </>
  );
}
