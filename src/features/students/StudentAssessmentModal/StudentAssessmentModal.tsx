"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, ChevronRight, Loader2 } from "lucide-react";
import { useStudentAssessment } from "@/hooks/useStudentAssessment";

import styles from "@/features/students/StudentAssessmentModal/StudentAssessmentModal.module.css";

interface StudentAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: any;
}

export function StudentAssessmentModal({
  isOpen,
  onClose,
  assessment,
}: StudentAssessmentModalProps) {
  const [mounted, setMounted] = useState(false);

  const {
    currentQuestionIndex,
    currentQuestion,
    questions,
    answers,
    isSubmitted,
    score,
    isSubmitting,
    hasAlreadySubmitted,
    handleSelectAnswer,
    handleNext,
    handleModalClose,
  } = useStudentAssessment({ isOpen, assessment, onClose });

  // Prevent SSR hydration mismatch for portal target
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safeguard: If student has already submitted this test, close the modal immediately
  useEffect(() => {
    if (isOpen && hasAlreadySubmitted) {
      onClose();
    }
  }, [isOpen, hasAlreadySubmitted, onClose]);

  const handleDismiss = () => {
    if (handleModalClose) {
      handleModalClose();
    }
    onClose(); // Reset isStudentTestOpen state in CourseWorkspace
  };

  // Early return after hook execution
  if (
    !mounted ||
    !isOpen ||
    !assessment ||
    !assessment.questions ||
    hasAlreadySubmitted
  ) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <Card className={styles.modalCard}>
        <div className={styles.header}>
          <div>
            <span className={styles.badge}>
              Active Session: {assessment.category}
            </span>
            <h3 className={styles.title}>{assessment.title}</h3>
          </div>
          {!isSubmitted && (
            <button
              onClick={handleDismiss}
              className={styles.closeBtn}
              type="button"
            >
              <X className={styles.iconSm} />
            </button>
          )}
        </div>

        <div className={styles.contentPanel}>
          {!isSubmitted ? (
            <>
              <div className={styles.progressMeta}>
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>
                  Progress:{" "}
                  {Math.round((currentQuestionIndex / questions.length) * 100)}%
                </span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>

              <div className={styles.questionBox}>
                <p className={styles.questionText}>
                  {currentQuestion.questionText || currentQuestion.title}
                </p>
              </div>

              {assessment.category === "Multiple Choice" && (
                <div className={styles.mcGrid}>
                  {currentQuestion.options?.map((option: string, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectAnswer(option)}
                      className={`${styles.mcOptionBtn} ${
                        answers[currentQuestionIndex] === option
                          ? styles.mcOptionSelected
                          : ""
                      }`}
                    >
                      <span className={styles.optionPrefix}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {assessment.category === "True or False" && (
                <div className={styles.tfGrid}>
                  {["True", "False"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectAnswer(option)}
                      className={`${styles.tfOptionBtn} ${
                        answers[currentQuestionIndex] === option
                          ? option === "True"
                            ? styles.tfOptionTrueSelected
                            : styles.tfOptionFalseSelected
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {assessment.category === "Fill in the Blank" && (
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    Provide Input Metric
                  </label>
                  <input
                    type="text"
                    value={answers[currentQuestionIndex] || ""}
                    onChange={(e) => handleSelectAnswer(e.target.value)}
                    placeholder="Type your precise response..."
                    className={styles.textInput}
                  />
                </div>
              )}
            </>
          ) : (
            <div className={styles.summaryContainer}>
              <CheckCircle2 className={styles.successIcon} />
              <div>
                <h4 className={styles.summaryTitle}>
                  Task Telemetry Submitted Successfully
                </h4>
                <p className={styles.summarySub}>
                  Evaluation logs compiled cleanly
                </p>
              </div>

              <div className={styles.scoreCard}>
                <span className={styles.scoreLabel}>Final Score Metrics</span>
                <span className={styles.scoreValue}>
                  {score}{" "}
                  <span className={styles.scoreTotal}>
                    / {questions.length}
                  </span>
                </span>
                <span className={styles.passTag}>Pass Mark Registered</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          {!isSubmitted ? (
            <Button
              disabled={!answers[currentQuestionIndex] || isSubmitting}
              onClick={handleNext}
              className={styles.nextBtn}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : currentQuestionIndex === questions.length - 1 ? (
                "Submit Analytics"
              ) : (
                "Next Module"
              )}
              {!isSubmitting && <ChevronRight className={styles.iconXs} />}
            </Button>
          ) : (
            <Button onClick={handleDismiss} className={styles.exitBtn}>
              Exit Layout Window
            </Button>
          )}
        </div>
      </Card>
    </div>,
    document.body,
  );
}
