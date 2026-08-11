"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useSubjectSelector } from "@/hooks/useSubjectSelector";

import styles from "@/features/shared-features/subject-hub/SubjectSelector/SubjectSelector.module.css"; // Scoped CSS module for SubjectSelector

interface SubjectSelectorProps {
  activeSubjectId: string | number;
  setActiveSubjectId: (id: string | number) => void;
  onSubjectChange?: () => void;
}

export function SubjectSelector({ 
  activeSubjectId, 
  setActiveSubjectId, 
  onSubjectChange 
}: SubjectSelectorProps) {
  const { subjects, getSubjectIcon } = useSubjectSelector();

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <BookOpen className={styles.titleIcon} /> Course Allocations
        </CardTitle>
      </CardHeader>
      
      <CardContent className={styles.content}>
        {subjects.map((sub) => {
          const DynamicSubjectIcon = getSubjectIcon(sub.iconName);
          const isActive = String(activeSubjectId) === String(sub.id);

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => {
                setActiveSubjectId(sub.id);
                onSubjectChange?.();
              }}
              className={`${styles.itemBtn} ${isActive ? styles.itemBtnActive : ""}`}
            >
              {/* Dynamic Icon Canvas Badge container wrapper */}
              <div className={`${styles.iconBadge} ${isActive ? styles.iconBadgeActive : ""}`}>
                <DynamicSubjectIcon className={styles.subjectIcon} />
              </div>

              {/* Text Layout Meta Data Frame */}
              <div className={styles.metaContainer}>
                <span className={`${styles.codeMeta} ${isActive ? styles.codeMetaActive : ""}`}>
                  {sub.code} • {sub.gradeLevel || "Year 3"}
                </span>
                <span className={styles.subjectTitle}>
                  {sub.title}
                </span>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}