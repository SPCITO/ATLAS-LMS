"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useSubjectSelector } from "@/hooks/useSubjectSelector";

import styles from "@/features/shared-features/subject-hub/SubjectSelector/SubjectSelector.module.css";

interface SubjectSelectorProps {
  activeSubjectId: string | number;
  setActiveSubjectId: (id: string | number) => void;
  onSubjectChange?: () => void;
}

export function SubjectSelector({
  activeSubjectId,
  setActiveSubjectId,
  onSubjectChange,
}: SubjectSelectorProps) {
  const { subjects, getSubjectIcon } = useSubjectSelector();

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>
          <BookOpen className={styles.titleIcon} />
          <span>Course Allocations</span>
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
              {/* Dynamic Icon Badge */}
              <div
                className={`${styles.iconBadge} ${isActive ? styles.iconBadgeActive : ""}`}
              >
                <DynamicSubjectIcon className={styles.subjectIcon} />
              </div>

              {/* Text Layout Frame */}
              <div className={styles.metaContainer}>
                <span
                  className={`${styles.codeMeta} ${isActive ? styles.codeMetaActive : ""}`}
                >
                  {sub.code} • {sub.gradeLevel || "Year 3"}
                </span>
                <span className={styles.subjectTitle} title={sub.title}>
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
