import { useEffect, useCallback } from "react";
import { useCreateAssessment } from "@/hooks/useCreateAssessment";

export interface Question {
  id: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
}

interface UseCreateAssessmentModalOptions {
  activeSubjectId: string | number;
  onClose: () => void;
}

export function useCreateAssessmentModal({
  activeSubjectId,
  onClose,
}: UseCreateAssessmentModalOptions) {
  const {
    title,
    setTitle,
    type,
    setType,
    category,
    setCategory,
    questions,
    setQuestions,
    handleSubmit,
    handleReset: resetAssessmentState,
    isLoading,
  } = useCreateAssessment({ activeSubjectId, onClose });

  // Handle question structure transformation when switching category modes
  useEffect(() => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (category === "True or False") {
          return { ...q, options: ["True", "False"], correctAnswer: "True" };
        } else if (category === "Fill in the Blank") {
          return { ...q, options: [], correctAnswer: "" };
        } else {
          return {
            ...q,
            options: q.options.length === 4 ? q.options : ["", "", "", ""],
            correctAnswer: "",
          };
        }
      })
    );
  }, [category, setQuestions]);

  const addQuestion = useCallback(() => {
    const newId = (questions.length + 1).toString();
    const newOptions =
      category === "Multiple Choice"
        ? ["", "", "", ""]
        : category === "True or False"
        ? ["True", "False"]
        : [];
    const newCorrect = category === "True or False" ? "True" : "";

    setQuestions((prev) => [
      ...prev,
      { id: newId, questionText: "", correctAnswer: newCorrect, options: newOptions },
    ]);
  }, [questions.length, category, setQuestions]);

  const removeQuestion = useCallback(
    (index: number) => {
      if (questions.length === 1) return;
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    },
    [questions.length, setQuestions]
  );

  const updateQuestionText = useCallback(
    (index: number, text: string) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], questionText: text };
        return updated;
      });
    },
    [setQuestions]
  );

  const updateOptionText = useCallback(
    (qIndex: number, optIndex: number, text: string) => {
      setQuestions((prev) => {
        const updated = [...prev];
        const updatedOptions = [...updated[qIndex].options];
        updatedOptions[optIndex] = text;
        updated[qIndex] = { ...updated[qIndex], options: updatedOptions };
        return updated;
      });
    },
    [setQuestions]
  );

  const updateCorrectAnswer = useCallback(
    (index: number, val: string) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], correctAnswer: val };
        return updated;
      });
    },
    [setQuestions]
  );

  const handleModalClose = useCallback(() => {
    resetAssessmentState();
    onClose();
  }, [resetAssessmentState, onClose]);

  return {
    title,
    setTitle,
    type,
    setType,
    category,
    setCategory,
    questions,
    isLoading,
    handleSubmit,
    handleModalClose,
    addQuestion,
    removeQuestion,
    updateQuestionText,
    updateOptionText,
    updateCorrectAnswer,
  };
}