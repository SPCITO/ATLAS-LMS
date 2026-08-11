"use client";

import { useState } from "react";
import { useTable, useDelete } from "@refinedev/core";
import { CourseModule, AssessmentItem } from "@/types";

interface UseCourseWorkspaceProps {
  activeSubjectId: string | number;
  setActivePdfUrl: (url: string | null) => void;
}

export function useCourseWorkspace({ activeSubjectId, setActivePdfUrl }: UseCourseWorkspaceProps) {
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [activePdfTitle, setActivePdfTitle] = useState<string>("");

  const { mutate: deleteMutate } = useDelete();

  // Fetch filtered modules targeting subject_id foreign key
  const { result: modulesResult } = useTable<CourseModule>({
    resource: "modules",
    filters: { permanent: [{ field: "subject_id", operator: "eq", value: activeSubjectId }] },
  });
  const filteredModules = modulesResult?.data ?? [];

  // Fetch filtered assessments targeting subject_id foreign key
  const { result: assessmentsResult } = useTable<AssessmentItem>({
    resource: "assessments",
    filters: { permanent: [{ field: "subject_id", operator: "eq", value: activeSubjectId }] },
  });
  const filteredAssessments = assessmentsResult?.data ?? [];

  const handleOpenPdf = (title: string, url: string) => {
    setActivePdfTitle(title);
    setActivePdfUrl(url);
  };

  const handleDeleteModule = (id: string | number) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteMutate({
        resource: "modules",
        id,
      });
    }
  };

  const handleDeleteAssessment = (id: string | number) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      deleteMutate({
        resource: "assessments",
        id,
      });
    }
  };

  return {
    isModuleModalOpen,
    setIsModuleModalOpen,
    isAssessmentModalOpen,
    setIsAssessmentModalOpen,
    activePdfTitle,
    filteredModules,
    filteredAssessments,
    handleOpenPdf,
    handleDeleteModule,
    handleDeleteAssessment,
  };
}