// src/sections/subject-hub/ClassRosterModal.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Users, Trash2, CheckCircle, Search, Loader2 } from "lucide-react";
import { useClassRoster } from "@/hooks/useClassRoster"; // Adjust import path as needed

import styles from "./ClassRosterModal.module.css";

interface ClassRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubjectId: string | number;
}

export function ClassRosterModal({ isOpen, onClose, activeSubjectId }: ClassRosterModalProps) {
  const {
    students,
    filteredStudents,
    loading,
    searchQuery,
    setSearchQuery,
    actionLoading,
    handleApprove,
    handleRemove,
  } = useClassRoster({ isOpen, activeSubjectId });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Users className={styles.headerIcon} />
            <h3 className={styles.title}>Class Roster & Student Requests</h3>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <X className={styles.closeIcon} />
          </button>
        </div>

        {/* Search bar */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search student by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Roster Table */}
        <div className={styles.rosterList}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <Loader2 className={styles.spinner} />
            </div>
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.enrollment_id} className={styles.studentRow}>
                <div className={styles.studentInfo}>
                  <div className={styles.studentHeader}>
                    <span className={styles.studentName}>{student.full_name}</span>
                    <span className={styles.idBadge}>ID: {student.id_number}</span>
                  </div>
                  <span className={styles.strandText}>
                    Strand/Dept: {student.course_strand}
                  </span>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                  {student.status === "pending" ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(student.enrollment_id)}
                      disabled={actionLoading === student.enrollment_id}
                      className={styles.acceptBtn}
                    >
                      <CheckCircle className={styles.btnIcon} /> Accept
                    </Button>
                  ) : (
                    <span className={styles.enrolledBadge}>
                      <CheckCircle className={styles.enrolledIcon} /> Enrolled
                    </span>
                  )}

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemove(student.enrollment_id, student.full_name)}
                    disabled={actionLoading === student.enrollment_id}
                    title="Remove Student"
                    className={styles.removeBtn}
                  >
                    <Trash2 className={styles.trashIcon} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              No students enrolled in this course yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Total Students: {students.length}</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}