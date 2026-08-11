"use client";

import { useState } from "react";
import { useCreate } from "@refinedev/core";

export interface QuestionNode {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
}

interface UseCreateAssessmentProps {
  activeSubjectId: string | number;
  onClose: () => void;
}

export function useCreateAssessment({ activeSubjectId, onClose }: UseCreateAssessmentProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Quiz");
  const [category, setCategory] = useState<"Multiple Choice" | "Fill in the Blank" | "True or False">("Multiple Choice");
  const [questions, setQuestions] = useState<QuestionNode[]>([
    { id: "1", questionText: "", correctAnswer: "", options: ["", "", "", ""] }
  ]);

  // Destructure mutate and the mutation status directly from useCreate
  const createMutation = useCreate();
  const { mutate: createRecord } = createMutation;
  
  // Safely check for loading state across Refine / TanStack Query versions
  const isLoading = Boolean(
    (createMutation as any).isLoading || 
    (createMutation as any).isPending
  );

  const handleReset = () => {
    setTitle("");
    setType("Quiz");
    setCategory("Multiple Choice");
    setQuestions([{ id: "1", questionText: "", correctAnswer: "", options: ["", "", "", ""] }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !activeSubjectId) return;

    createRecord(
      {
        resource: "assessments",
        values: {
          subject_id: activeSubjectId,
          title: title.trim(),
          type,
          category,
          questions,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
      },
      {
        onSuccess: () => {
          handleReset();
          onClose();
        },
      }
    );
  };

  return {
    title,
    setTitle,
    type,
    setType,
    category,
    setCategory,
    questions,
    setQuestions,
    handleSubmit,
    handleReset,
    isLoading,
  };
}