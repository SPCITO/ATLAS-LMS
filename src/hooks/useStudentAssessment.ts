import { useState } from "react";
import { useCreate, useGetIdentity, useList } from "@refinedev/core";

interface UseStudentAssessmentOptions {
  isOpen: boolean;
  assessment: any;
  onClose: () => void;
}

export function useStudentAssessment({
  isOpen,
  assessment,
  onClose,
}: UseStudentAssessmentOptions) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const { data: user } = useGetIdentity<{ id?: string; sub?: string }>();
  const studentId = user?.id || user?.sub;

  // Refine v4 mutation handling
  const createResult = useCreate();
  const submitAssessment = createResult.mutate;
  const isSubmitting = createResult.mutation?.isPending ?? false;

  // Refine v4 query handling
  const { query: existingSubmissionsQuery } = useList({
    resource: "submissions",
    filters: [
      { field: "student_id", operator: "eq", value: studentId ?? "" },
      { field: "assessment_id", operator: "eq", value: assessment?.id ?? "" },
    ],
    queryOptions: {
      enabled: Boolean(isOpen && studentId && assessment?.id),
    },
  });

  const existingSubmissions = existingSubmissionsQuery?.data?.data ?? [];
  const hasAlreadySubmitted = existingSubmissions.length > 0;

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || {};

  const handleSelectAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let correctCount = 0;
      questions.forEach((q: any, idx: number) => {
        const studentAnswer = (answers[idx] || "").trim().toLowerCase();
        const correctAnswer = (q.correctAnswer || "").trim().toLowerCase();

        if (studentAnswer === correctAnswer) {
          correctCount++;
        }
      });

      setScore(correctCount);

      const payload = {
        assessment_id: assessment.id,
        student_id: studentId,
        answers,
        score: correctCount,
        total_questions: questions.length,
      };

      submitAssessment(
        {
          resource: "submissions",
          values: payload,
        },
        {
          onSuccess: () => {
            setIsSubmitted(true);
          },
          onError: (error: any) => {
            console.error("Submission failed:", error?.message || error);
            setIsSubmitted(true);
          },
        }
      );
    }
  };

  const handleModalClose = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    onClose();
  };

  return {
    currentQuestionIndex,
    currentQuestion,
    questions,
    answers,
    isSubmitted,
    score,
    isSubmitting,
    hasAlreadySubmitted,
    handleSelectAnswer,
    handleNext,
    handleModalClose,
  };
}