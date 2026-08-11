"use client";

import { useState } from "react";
import { useList, useDelete } from "@refinedev/core";
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

  // Guard query execution so it only runs when activeSubjectId is valid
  const isQueryEnabled = Boolean(activeSubjectId) && activeSubjectId !== "";

  // 1. Query modules using useList
  const { result: modulesResult } = useList<CourseModule>({
    resource: "modules",
    filters: [
      {
        field: "subject_id",
        operator: "eq",
        value: activeSubjectId,
      },
    ],
    queryOptions: {
      enabled: isQueryEnabled,
    },
  });

  // Access array under result.data
  const rawModules = modulesResult?.data ?? [];
  const filteredModules = rawModules.filter(
    (mod: CourseModule) => String((mod as any).subject_id ?? mod.id) === String(activeSubjectId)
  );

  // 2. Query assessments using useList
  const { result: assessmentsResult } = useList<AssessmentItem>({
    resource: "assessments",
    filters: [
      {
        field: "subject_id",
        operator: "eq",
        value: activeSubjectId,
      },
    ],
    queryOptions: {
      enabled: isQueryEnabled,
    },
  });

  // Access array under result.data
  const rawAssessments = assessmentsResult?.data ?? [];
  const filteredAssessments = rawAssessments.filter(
    (asm: AssessmentItem) => String((asm as any).subject_id ?? asm.id) === String(activeSubjectId)
  );

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