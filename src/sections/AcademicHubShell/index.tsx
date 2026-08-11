"use client";

import React, { useState, useEffect } from "react";
import { AcademicBentoView } from "@/features/shared-features/AcademicBentoView/AcademicBentoView";
import { LiveStreamIndicator } from "@/features/students/LiveStreamIndicator/LiveStreamIndicator";
import { ProfileView } from "@/features/shared-features/ProfileView/ProfileView"; 
import { Button } from "@/components/ui/button";
import { User, BookOpen, UserPlus } from "lucide-react";

// Integrated modular imports
import { SubjectSelector, CourseWorkspace } from "@/features/shared-features/subject-hub";
import { JoinCourseModal } from "@/features/students/JoinCourseModal/JoinCourseModal";
import { useSubjectSelector } from "@/hooks/useSubjectSelector";

import styles from "@/sections/AcademicHubShell/AcademicHubShell.module.css"; // Scoped CSS module for AcademicHubShell

interface AcademicHubShellProps {
  roleTitle: string;
  isTeacher: boolean;
}

export function AcademicHubShell({ roleTitle, isTeacher }: AcademicHubShellProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<string | number>("");
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"workspace" | "profile">("workspace");

  // State to manage Join Course modal visibility for student role
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Fetch courses via subject selector hook
  const { subjects, refetch } = useSubjectSelector();

  // Automatically select the first subject if none selected or if activeSubjectId is invalid
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
            {/* Navigation Mode View Switcher Toggles */}
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
                Profile View
              </Button>
            </div>

            {/* Live Streaming Indicator Row */}
            <div className={styles.indicatorWrapper}>
              <LiveStreamIndicator isTeacher={isTeacher} activeSubjectId={activeSubjectId} />
            </div>

            {/* Student-Only Action: Join Class with Invite Code */}
            {!isTeacher && (
              <div className="mb-3 px-1">
                <Button 
                  onClick={() => setIsJoinModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  <UserPlus className={`${styles.iconSm} stroke-[2.2]`} />
                  Join Class with Code
                </Button>
              </div>
            )}
            
            {/* Main Subject Class Navigator Card */}
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
            <div className="w-full h-full flex flex-col">
              {/* Main Course Workspace */}
              <div className="w-full h-full flex-1">
                <CourseWorkspace 
                  activeSubjectId={activeSubjectId} 
                  isTeacher={isTeacher} 
                  activePdfUrl={activePdfUrl}
                  setActivePdfUrl={setActivePdfUrl} 
                />
              </div>
            </div>
          )
        }
      />

      {/* Join Course Modal Node */}
      <JoinCourseModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinSuccess}
      />
    </>
  );
}