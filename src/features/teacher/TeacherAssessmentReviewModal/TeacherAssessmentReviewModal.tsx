"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AssessmentItem } from "@/types";
import { X, UserCheck, Loader2, Copy, Check } from "lucide-react";
import { useTeacherAssessmentReview } from "@/hooks/useTeacherAssessmentReview"; // Adjust import path as needed

import styles from "./TeacherAssessmentReviewModal.module.css";

interface TeacherAssessmentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem | null;
}

export function TeacherAssessmentReviewModal({
  isOpen,
  onClose,
  assessment,
}: TeacherAssessmentReviewModalProps) {
  const [mounted, setMounted] = useState(false);

  const { submissions, isLoading, copied, handleCopyGrades } =
    useTeacherAssessmentReview({
      isOpen,
      assessment,
    });

  // Prevent SSR hydration mismatch for portal target
  useEffect(() => {
    setMounted(true);
  }, []);

  // Early return AFTER all hooks execute
  if (!mounted || !isOpen || !assessment) return null;

  return createPortal(
    <div className={styles.reviewOverlay}>
      <Card className={styles.reviewCard}>
        {/* Header */}
        <div className={styles.reviewHeader}>
          <div>
            <h3 className={styles.modalTitle}>Review Submissions</h3>
            <p className={styles.modalSubtitle}>
              {assessment.title || `Assessment #${assessment.id}`}
            </p>
          </div>

          <div className={styles.headerActions}>
            {/* Copy Grade Records Button */}
            {submissions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyGrades}
                disabled={isLoading}
                className={styles.copyButton}
              >
                {copied ? (
                  <>
                    <Check className={styles.successIcon} />
                    <span className={styles.copiedText}>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className={styles.copyIcon} />
                    <span>Copy Grades</span>
                  </>
                )}
              </Button>
            )}

            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} />
            <p>Fetching student submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className={styles.emptyState}>
            <UserCheck className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No submissions recorded yet.</p>
            <p className={styles.emptySubtitle}>
              Students haven't submitted answers for this assessment.
            </p>
          </div>
        ) : (
          <div className={styles.submissionsList}>
            {submissions.map((sub) => (
              <div key={sub.id} className={styles.submissionItem}>
                <div className={styles.submissionMeta}>
                  <div className={styles.studentInfo}>
                    <span className={styles.studentName}>
                      {sub.studentName}{" "}
                      {sub.studentIdNum && (
                        <span className={styles.idNumText}>
                          ({sub.studentIdNum})
                        </span>
                      )}
                    </span>
                    <span className={styles.studentIdSubtext}>
                      ID: {sub.studentId.slice(0, 8)}
                    </span>
                  </div>

                  <span className={styles.badgeSuccess}>
                    Score: {sub.score} / {sub.totalQuestions} ({sub.percentage}
                    %)
                  </span>
                </div>
                <p className={styles.submittedDate}>
                  Submitted: {sub.submittedAt}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>,
    document.body,
  );
}
