// src/sections/subject-hub/JoinCourseModal.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Loader2 } from "lucide-react";
import { useJoinCourse } from "@/hooks/useJoinCourse"; // Adjust import path as needed

import styles from "./JoinCourseModal.module.css";

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function JoinCourseModal({ isOpen, onClose, onSuccess }: JoinCourseModalProps) {
  const { courseCode, setCourseCode, loading, joinCourse } = useJoinCourse({
    onSuccess,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <UserPlus className={styles.headerIcon} />
            <h3 className={styles.title}>Join Subject Workspace</h3>
          </div>
          <button onClick={onClose} className={styles.closeButton} type="button" aria-label="Close modal">
            <X className={styles.iconSm} />
          </button>
        </div>

        <form onSubmit={joinCourse} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Course Invite Code</label>
            <input
              type="text"
              required
              placeholder="e.g. CS-402-A1B2C"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className={`${styles.input} ${styles.uppercaseInput}`}
              disabled={loading}
            />
          </div>

          <div className={styles.footerActions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !courseCode.trim()}>
              {loading ? (
                <span className={styles.loaderContent}>
                  <Loader2 className={styles.spinner} /> Enrolling...
                </span>
              ) : (
                "Enroll Course"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}