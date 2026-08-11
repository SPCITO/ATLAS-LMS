import { useState, useMemo, useCallback } from "react";
import { useList, useMany } from "@refinedev/core";
import { AssessmentItem } from "@/types";

export interface FormattedSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentIdNum: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  submittedAt: string;
  rawSubmittedAt: string | null;
}

interface UseTeacherAssessmentReviewOptions {
  isOpen: boolean;
  assessment: AssessmentItem | null;
}

export function useTeacherAssessmentReview({
  isOpen,
  assessment,
}: UseTeacherAssessmentReviewOptions) {
  const [copied, setCopied] = useState(false);

  // 1. Query submissions with meta select to join the related profile
  const { query } = useList({
    resource: "submissions",
    filters: [
      {
        field: "assessment_id",
        operator: "eq",
        value: assessment?.id ?? "",
      },
    ],
    meta: {
      select: "*, profiles:student_id(full_name, id_number, email)",
    },
    queryOptions: {
      enabled: Boolean(isOpen && assessment?.id),
    },
  });

  const isLoadingSubmissions = query?.isLoading ?? false;
  const rawSubmissions = query?.data?.data ?? [];

  // 2. Extract unique student IDs as fallback using useMany
  const studentIds = useMemo(() => {
    if (!rawSubmissions.length) return [];
    return Array.from(
      new Set(rawSubmissions.map((s: any) => s.student_id).filter(Boolean))
    );
  }, [rawSubmissions]);

  const { query: profilesQuery } = useMany({
    resource: "profiles",
    ids: studentIds,
    queryOptions: {
      enabled: Boolean(
        isOpen && studentIds.length > 0 && !rawSubmissions[0]?.profiles
      ),
    },
  });

  const profilesMap = useMemo(() => {
    const map = new Map<string, any>();
    profilesQuery?.data?.data?.forEach((profile: any) => {
      map.set(profile.id, profile);
    });
    return map;
  }, [profilesQuery?.data?.data]);

  const isLoading =
    isLoadingSubmissions ||
    Boolean(studentIds.length > 0 && profilesQuery?.isLoading);

  // 3. Format submissions data into clean presentation structures
  const submissions: FormattedSubmission[] = useMemo(() => {
    const assessmentObj = assessment as Record<string, any> | null;

    return rawSubmissions.map((sub: any, index: number) => {
      const totalQuestions =
        sub.total_questions || assessmentObj?.questions?.length || 1;
      const score = sub.score ?? 0;
      const percentage = Math.round((score / totalQuestions) * 100);

      const profile = sub.profiles || profilesMap.get(sub.student_id);
      const studentName = profile?.full_name || "Unknown Student";
      const studentIdNum = profile?.id_number || "";

      const rawDate = sub.submitted_at || sub.created_at;
      const submittedAt = rawDate
        ? new Date(rawDate).toLocaleString()
        : "Recently";

      return {
        id: sub.id || String(index),
        studentId: sub.student_id ? String(sub.student_id) : "N/A",
        studentName,
        studentIdNum,
        score,
        totalQuestions,
        percentage,
        submittedAt,
        rawSubmittedAt: rawDate || null,
      };
    });
  }, [rawSubmissions, profilesMap, assessment]);

  // 4. TSV Clipboard Exporter
  const handleCopyGrades = useCallback(() => {
    if (!submissions.length) return;

    const headers = [
      "Student Name",
      "Student ID",
      "Score",
      "Total",
      "Percentage",
      "Date Submitted",
    ];

    const rows = submissions.map((sub) => {
      const idNum = sub.studentIdNum || sub.studentId;
      const date = sub.rawSubmittedAt
        ? new Date(sub.rawSubmittedAt).toLocaleString()
        : "N/A";

      return [
        sub.studentName,
        idNum,
        sub.score,
        sub.totalQuestions,
        `${sub.percentage}%`,
        date,
      ].join("\t");
    });

    const clipboardText = [headers.join("\t"), ...rows].join("\n");

    navigator.clipboard.writeText(clipboardText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [submissions]);

  return {
    submissions,
    isLoading,
    copied,
    handleCopyGrades,
  };
}