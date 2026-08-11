"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Copy, Check, Sparkles } from "lucide-react";
import { useCreateSubjectModal } from "@/hooks/useCreateSubjectModal"; // Adjust import path as needed

import styles from "@/features/teacher/CreateSubjectModal/CreateSubjectModal.module.css";

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSubjectModal({ isOpen, onClose }: CreateSubjectModalProps) {
  const {
    title,
    setTitle,
    subjectCode,
    setSubjectCode,
    gradeLevel,
    setGradeLevel,
    iconName,
    setIconName,
    copied,
    inviteLink,
    handleCopyLink,
    handleSubmit,
  } = useCreateSubjectModal({ onClose });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.card}>
        {/* Header Block */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <Sparkles className={styles.headerIcon} />
            <h3 className={styles.title}>Create New Subject</h3>
          </div>
          <button onClick={onClose} className={styles.closeButton} type="button" aria-label="Close">
            <X className={styles.iconSm} />
          </button>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Subject Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Advanced Distributed Systems"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
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
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className={styles.select}
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

          {/* DYNAMICALLY GENERATED LINK GENERATOR PREVIEW */}
          {subjectCode.trim().length > 0 && (
            <div className={styles.previewCard}>
              <span className={styles.previewLabel}>Generated Student Enrollment Link</span>
              <div className={styles.linkRow}>
                <span className={styles.linkText}>{inviteLink}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={styles.copyBtn}
                  title="Copy link"
                >
                  {copied ? (
                    <Check className={`${styles.iconXs} ${styles.checkIcon}`} />
                  ) : (
                    <Copy className={styles.iconXs} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Trigger Buttons Footer */}
          <div className={styles.footerActions}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button type="submit" className={styles.submitBtn}>
              Generate & Deploy
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}