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
  const [copied, setCopied] = useState(false);

  const { mutate: createRecord } = useCreate();
  const { data: identity } = useGetIdentity<UserIdentity>();

  // Generate code memoized on subjectCode so it stays consistent during re-renders
  const generatedCode = useMemo(() => {
    const prefix = subjectCode.trim().toUpperCase() || "SUBJ";
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${randomSuffix}`;
  }, [subjectCode]);

  const inviteLink = useMemo(() => {
    return `https://atlas.school/register?code=${generatedCode}`;
  }, [generatedCode]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink]);

  const resetForm = useCallback(() => {
    setTitle("");
    setSubjectCode("");
    setGradeLevel("Year 1");
    setIconName("Triangle");
    setCopied(false);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim() || !subjectCode.trim()) return;

      createRecord({
        resource: "courses",
        values: {
          title: title,
          course_code: generatedCode,
          icon: iconName,
          live_meeting_url: "", // Set to empty string so the teacher enters a real link later
          created_by: identity?.uuid || null,
          instructor: identity?.teacher_full_name || "",
        },
      });

      resetForm();
      onClose();
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
    copied,
    inviteLink,
    handleCopyLink,
    handleSubmit,
  };
}