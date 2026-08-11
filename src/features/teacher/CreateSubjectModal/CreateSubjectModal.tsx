"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useCreateSubjectModal } from "@/hooks/useCreateSubjectModal";

import styles from "@/features/teacher/CreateSubjectModal/CreateSubjectModal.module.css";

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSubjectModal({ isOpen, onClose }: CreateSubjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    title,
    setTitle,
    subjectCode,
    setSubjectCode,
    gradeLevel,
    setGradeLevel,
    iconName,
    setIconName,
    handleSubmit,
  } = useCreateSubjectModal({ onClose });

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    try {
      await handleSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <Card className={styles.card}>
        {/* Header Block */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <Sparkles className={styles.headerIcon} />
            <h3 className={styles.title}>Create New Subject</h3>
          </div>
          <button
            onClick={onClose}
            className={styles.closeButton}
            type="button"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X className={styles.iconSm} />
          </button>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Subject Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Advanced Distributed Systems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.gridTwoCols}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Base Code Prefix</label>
              <input
                type="text"
                required
                placeholder="e.g., CS-402"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className={`${styles.input} ${styles.uppercaseInput}`}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Display Branding Icon</label>
            <div className={styles.iconGrid}>
              {["Triangle", "Server", "Atom", "ShieldCheck"].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIconName(icon)}
                  className={`${styles.iconOptionBtn} ${
                    iconName === icon ? styles.iconOptionSelected : ""
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons Footer */}
          <div className={styles.footerActions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Generate & Deploy"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}