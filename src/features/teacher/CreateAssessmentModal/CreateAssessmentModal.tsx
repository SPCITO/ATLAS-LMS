"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { useCreateAssessmentModal } from "@/hooks/useCreateAssessmentModal"; // Adjust path as needed

import styles from "@/features/teacher/CreateAssessmentModal/CreateAssessmentModal.module.css";

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubjectId: string | number;
}

export function CreateAssessmentModal({
  isOpen,
  onClose,
  activeSubjectId,
}: CreateAssessmentModalProps) {
  const {
    title,
    setTitle,
    type,
    setType,
    category,
    setCategory,
    questions,
    isLoading,
    handleSubmit,
    handleModalClose,
    addQuestion,
    removeQuestion,
    updateQuestionText,
    updateOptionText,
    updateCorrectAnswer,
  } = useCreateAssessmentModal({ activeSubjectId, onClose });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modalCard}>
        {/* Header Block */}
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Assemble New Task Objective</h3>
          <button
            type="button"
            onClick={handleModalClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            <X className={styles.iconSm} />
          </button>
        </div>

        {/* Core Form Area */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Top Level Metadata Configuration Grid */}
          <div className={styles.metaGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Classification Group</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={styles.selectInput}
              >
                <option value="Quiz">Quiz Objective</option>
                <option value="Exam">Exam Objective</option>
                <option value="Assignment">Assignment Submission Task</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Question Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className={`${styles.selectInput} ${styles.selectInputCategory}`}
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="Fill in the Blank">Fill in the Blank</option>
                <option value="True or False">True or False</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>File Objective Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Chapter 1 Matrix Vectors"
                className={styles.textInput}
              />
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Dynamic Question Constructor Container Track */}
          <div className={styles.questionSection}>
            <div className={styles.questionHeader}>
              <h4 className={styles.sectionTitle}>
                Active Question Pipeline ({questions.length})
              </h4>
              <Button
                type="button"
                variant="outline"
                onClick={addQuestion}
                className={styles.addQuestionBtn}
              >
                <Plus className={styles.iconXs} /> Add Question
              </Button>
            </div>

            {questions.map((q, index) => (
              <div key={q.id} className={styles.questionNodeCard}>
                <div className={styles.nodeHeader}>
                  <span className={styles.nodeBadge}>
                    Question Node #{index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className={styles.removeBtn}
                      title="Remove question"
                    >
                      <Trash2 className={styles.iconSm} />
                    </button>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>Question Prompt Context</label>
                  <input
                    required
                    type="text"
                    value={q.questionText}
                    onChange={(e) => updateQuestionText(index, e.target.value)}
                    placeholder="Enter what you want to ask the student..."
                    className={`${styles.textInput} ${styles.nodeInput}`}
                  />
                </div>

                {category === "Multiple Choice" && (
                  <div className={styles.fieldGroup}>
                    <label className={styles.subLabel}>
                      Multiple Selection Matrix Options
                    </label>
                    <div className={styles.optionsGrid}>
                      {q.options.map((opt, optIdx) => (
                        <input
                          required
                          key={optIdx}
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOptionText(index, optIdx, e.target.value)
                          }
                          placeholder={`Option Matrix Choice ${String.fromCharCode(
                            65 + optIdx
                          )}`}
                          className={`${styles.textInput} ${styles.optionInput}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>Target Correct Answer Key</label>
                  {category === "True or False" ? (
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                      className={`${styles.selectInput} ${styles.nodeInput}`}
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                  ) : (
                    <input
                      required
                      type="text"
                      value={q.correctAnswer}
                      onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                      placeholder={
                        category === "Multiple Choice"
                          ? "Must match one option choice above"
                          : "Type accurate key response"
                      }
                      className={`${styles.textInput} ${styles.nodeInput} ${styles.correctAnswerInput}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Interactive Actions Bar */}
          <div className={styles.footerActions}>
            <Button
              type="button"
              variant="ghost"
              onClick={handleModalClose}
              className={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={styles.deployBtn}
            >
              {isLoading ? "Deploying..." : "Deploy Target"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}