// hooks/useSubjectSelector.ts
"use client";

import { useGetIdentity, useList, useTable } from "@refinedev/core";
import { Triangle, Server, Atom, ShieldCheck, BookOpen } from "lucide-react";
import { SubjectItem } from "@/types";

export const SUBJECT_ICON_MAP = {
  Triangle: Triangle,
  Server: Server,
  Atom: Atom,
  ShieldCheck: ShieldCheck,
};

export type SubjectIconKey = keyof typeof SUBJECT_ICON_MAP;

export function useSubjectSelector() {
  // Fetch logged-in user profile identity
  const { data: identity } = useGetIdentity<{
    uuid: string;
    role: "teacher" | "student";
  }>();

  const isTeacher = identity?.role === "teacher";
  const userUuid = identity?.uuid;

  // 1. TEACHER: Fetch courses created specifically by this teacher
  const { result: teacherCoursesResult, tableQuery: teacherQuery } = useTable<SubjectItem>({
    resource: "courses",
    filters: {
      permanent: [
        {
          field: "created_by",
          operator: "eq",
          value: userUuid,
        },
      ],
    },
    queryOptions: {
      enabled: Boolean(isTeacher && userUuid),
    },
  });

  // 2. STUDENT: Fetch ONLY approved course enrollments
  const { result: studentEnrollmentsResult, query: studentEnrollmentsQuery } = useList({
    resource: "enrollments",
    filters: [
      {
        field: "student_id",
        operator: "eq",
        value: userUuid,
      },
      {
        field: "status",
        operator: "eq",
        value: "approved",
      },
    ],
    queryOptions: {
      enabled: Boolean(!isTeacher && userUuid),
    },
  });

  // Extract enrolled course IDs for the student
  const enrolledCourseIds =
    studentEnrollmentsResult?.data?.map((item: any) => item.course_id) || [];

  // 3. STUDENT: Fetch course details matching the approved course IDs
  const { result: studentCoursesResult, tableQuery: studentQuery } = useTable<SubjectItem>({
    resource: "courses",
    filters: {
      permanent: [
        {
          field: "id",
          operator: "in",
          value: enrolledCourseIds.length > 0 ? enrolledCourseIds : ["00000000-0000-0000-0000-000000000000"],
        },
      ],
    },
    queryOptions: {
      enabled: Boolean(!isTeacher && userUuid && enrolledCourseIds.length > 0),
    },
  });

  // Determine subjects depending on user role
  const subjects = isTeacher
    ? teacherCoursesResult?.data ?? []
    : studentCoursesResult?.data ?? [];

  const isLoading = isTeacher
    ? teacherQuery?.isLoading
    : studentQuery?.isLoading;

  const getSubjectIcon = (iconName: string | undefined) => {
    return SUBJECT_ICON_MAP[iconName as SubjectIconKey] || BookOpen;
  };

  // Unified refetch method to refresh queries when modal succeeds
  const refetch = () => {
    if (isTeacher) {
      teacherQuery?.refetch?.();
    } else {
      studentEnrollmentsQuery?.refetch?.();
      studentQuery?.refetch?.();
    }
  };

  return {
    subjects,
    isLoading,
    getSubjectIcon,
    refetch,
  };
}