import { useState, useMemo, useCallback } from "react";
import { useCreate, useGetIdentity } from "@refinedev/core";

export interface UserIdentity {
  uuid: string;
  teacher_full_name?: string;
  [key: string]: any;
}

interface UseCreateSubjectModalOptions {
  onClose: () => void;
}

export function useCreateSubjectModal({ onClose }: UseCreateSubjectModalOptions) {
  const [title, setTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Year 1");
  const [iconName, setIconName] = useState("Triangle");

  const { mutateAsync: createRecord } = useCreate();
  const { data: identity } = useGetIdentity<UserIdentity>();

  // Generate code memoized on subjectCode
  const generatedCode = useMemo(() => {
    const prefix = subjectCode.trim().toUpperCase() || "SUBJ";
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${randomSuffix}`;
  }, [subjectCode]);

  const resetForm = useCallback(() => {
    setTitle("");
    setSubjectCode("");
    setGradeLevel("Year 1");
    setIconName("Triangle");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !subjectCode.trim()) return;

      try {
        await createRecord({
          resource: "courses",
          values: {
            title: title,
            course_code: generatedCode,
            icon: iconName,
            live_meeting_url: "",
            created_by: identity?.uuid || null,
            instructor: identity?.teacher_full_name || "",
          },
        });

        resetForm();
        onClose();
      } catch (err) {
        console.error("Failed to create subject:", err);
      }
    },
    [title, subjectCode, generatedCode, iconName, identity, createRecord, resetForm, onClose]
  );

  return {
    title,
    setTitle,
    subjectCode,
    setSubjectCode,
    gradeLevel,
    setGradeLevel,
    iconName,
    setIconName,
    handleSubmit,
  };
}