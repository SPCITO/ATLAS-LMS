"use client";
//THIS IS VACANT FOR NOT THIS COMPONENT IS NOT BEING USED FOR NOW  @RESERVE FOR FUTURE USE CASES
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle } from "lucide-react";
import { useTable, useList, useGetIdentity } from "@refinedev/core";
import { AssessmentItem } from "@/types";
import { TeacherAssessmentReviewModal } from "../TeacherAssessmentReviewModal/TeacherAssessmentReviewModal";
import { StudentAssessmentModal } from "../../students/StudentAssessmentModal/StudentAssessmentModal";

import styles from "@/features/teacher/EvaluationOverviewCard/EvaluationOverviewCard.module.css"; // Scoped CSS module for EvaluationOverviewCard

// 1. EVALUATIONS TAB COMPONENT
interface EvaluationsTabProps {
  assessments: any[];
  onLaunchTask: (assessment: any) => void;
}

export function EvaluationsTab({ assessments, onLaunchTask }: EvaluationsTabProps) {
  const { data: user } = useGetIdentity<{ id?: string; sub?: string }>();
  const studentId = user?.id || user?.sub;

  const { query: submissionsQuery } = useList({
    resource: "submissions",
    filters: [
      {
        field: "student_id",
        operator: "eq",
        value: studentId,
      },
    ],
    queryOptions: {
      enabled: !!studentId,
    },
  });

  const submissions = submissionsQuery?.data?.data ?? [];
  const submittedAssessmentIds = new Set(
    submissions.map((sub: any) => String(sub.assessment_id))
  );

  return (
    <div className="space-y-4">
      {assessments?.map((task) => {
        const isCompleted = submittedAssessmentIds.has(String(task.id));

        return (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
          >
            <div>
              <div className="flex gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  QUIZ
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {task.category || "General"}
                </span>
              </div>
              <h4 className="font-bold text-gray-900">{task.title}</h4>
            </div>

            <div>
              {isCompleted ? (
                <Button variant="outline" disabled className="gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Completed
                </Button>
              ) : (
                <Button
                  onClick={() => onLaunchTask(task)}
                  className="bg-slate-900 text-white hover:bg-slate-800"
                >
                  LAUNCH TASK
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 2. MAIN SIDEBAR COMPONENT
interface EvaluationOverviewCardProps {
  isTeacher: boolean;
}

export function EvaluationOverviewCard({ isTeacher }: EvaluationOverviewCardProps) {
  const { data: user } = useGetIdentity<{ id?: string; sub?: string }>();
  const studentId = user?.id || user?.sub;

  const { result, tableQuery } = useTable<AssessmentItem>({
    resource: "assessments",
  });

  const { query: submissionsQuery } = useList({
    resource: "submissions",
    filters: [
      {
        field: "student_id",
        operator: "eq",
        value: studentId,
      },
    ],
    queryOptions: {
      enabled: !isTeacher && !!studentId,
    },
  });

  const submissions = submissionsQuery?.data?.data ?? [];
  const submittedAssessmentIds = new Set(
    submissions.map((sub: any) => String(sub.assessment_id))
  );

  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const assessments = (result?.data ?? []).slice(0, 5);

  const handleGradeClick = (task: AssessmentItem) => {
    setSelectedAssessment(task);
    setIsReviewOpen(true);
  };

  const handleStudentTakeTest = (task: AssessmentItem) => {
    setSelectedAssessment(task);
    setIsStudentModalOpen(true);
  };

  return (
    <>
      <Card className={styles.card}>
        <CardHeader className={styles.header}>
          <div>
            <CardTitle className={styles.title}>
              {isTeacher ? "Curriculum Controls" : "Active Evaluations"}
            </CardTitle>
            <CardDescription>
              {isTeacher
                ? "Manage active class evaluation targets"
                : "Live telemetry feeding from mock API endpoint"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {tableQuery?.isLoading ? (
            <div className={styles.loadingState}>Syncing records...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isTeacher ? styles.thTeacherCol : styles.thStudentCol}>
                    {isTeacher ? "Assessment Node" : "Task Title"}
                  </TableHead>
                  {isTeacher ? (
                    <>
                      <TableHead>Submissions</TableHead>
                      <TableHead className={styles.textRight}>Action</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>System Index</TableHead>
                      <TableHead className={styles.textRight}>Action</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((task) => {
                  const isCompleted = submittedAssessmentIds.has(String(task.id));

                  return (
                    <TableRow key={task.id} className={styles.tableRow}>
                      <TableCell className={styles.taskTitleCell}>
                        {task.title || `Evaluation Target Matrix #${task.id}`}
                      </TableCell>

                      {isTeacher ? (
                        <>
                          <TableCell>
                            <div className={styles.submissionsWrapper}>
                              <Users className={styles.submissionsIcon} />
                              <span>{Number(task.id) * 4 + 3}/24</span>
                            </div>
                          </TableCell>
                          <TableCell className={styles.textRight}>
                            <Button
                              variant="outline"
                              className={styles.gradeBtn}
                              onClick={() => handleGradeClick(task)}
                            >
                              Grade
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            <Badge variant={Number(task.id) % 2 === 0 ? "default" : "secondary"}>
                              Node-{task.id}
                            </Badge>
                          </TableCell>
                          <TableCell className={styles.textRight}>
                            {isCompleted ? (
                              <Button size="sm" variant="outline" disabled>
                                <CheckCircle className="mr-1 h-3.5 w-3.5 text-green-500" />
                                Completed
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleStudentTakeTest(task)}
                              >
                                Start
                              </Button>
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TeacherAssessmentReviewModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedAssessment(null);
        }}
        assessment={selectedAssessment}
      />

      <StudentAssessmentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedAssessment(null);
        }}
        assessment={selectedAssessment}
      />
    </>
  );
}