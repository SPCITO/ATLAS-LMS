"use client";

import React, { useState, useMemo } from "react";
import { useOne, useGetIdentity, useList } from "@refinedev/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Eye, 
  Plus, 
  Calendar, 
  FolderPlus, 
  Settings, 
  Copy, 
  Check, 
  Share2,
  Trash2,
  Users
} from "lucide-react";

import { useCourseWorkspace } from "@/hooks/useCourseWorkspace";
import { PdfViewModal } from "../../PdfViewModal/PdfViewModal";
import { CreateModuleModal } from "../../../teacher/CreateModuleModal/CreateModuleModal";
import { CreateAssessmentModal } from "../../../teacher/CreateAssessmentModal/CreateAssessmentModal";
import { CreateSubjectModal } from "../../../teacher/CreateSubjectModal/CreateSubjectModal";
import { StudentAssessmentModal } from "../../../students/StudentAssessmentModal/StudentAssessmentModal";
import { ClassRosterModal } from "../../../teacher/ClassRosterModal/ClassRosterModal";
import { TeacherAssessmentReviewModal } from "../../../teacher/TeacherAssessmentReviewModal/TeacherAssessmentReviewModal";

import styles from "@/features/shared-features/subject-hub/CourseWorkspace/CourseWorkspace.module.css"; // Scoped CSS module for CourseWorkspace

interface CourseWorkspaceProps {
  activeSubjectId: string | number;
  isTeacher: boolean;
  activePdfUrl: string | null;
  setActivePdfUrl: (url: string | null) => void;
}

export function CourseWorkspace({ 
  activeSubjectId, 
  isTeacher, 
  activePdfUrl, 
  setActivePdfUrl 
}: CourseWorkspaceProps) {
  const {
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
  } = useCourseWorkspace({ activeSubjectId, setActivePdfUrl });

  // Tab State Tracking to handle contextual add buttons
  const [activeTab, setActiveTab] = useState("modules");

  // Interactive Student States
  const [selectedActiveTest, setSelectedActiveTest] = useState<any>(null);
  const [isStudentTestOpen, setIsStudentTestOpen] = useState(false);

  // Interactive Teacher Review State
  const [selectedReviewAssessment, setSelectedReviewAssessment] = useState<any>(null);
  const [isTeacherReviewOpen, setIsTeacherReviewOpen] = useState(false);

  // Modal & Dropdown Control States
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [showControlsMenu, setShowControlsMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Identity state for student verification
  const { data: user } = useGetIdentity<any>();
  const studentId = user?.id;

  // Query existing submissions for this student
  const { result: submissionsResult } = useList({
    resource: "submissions",
    filters: [
      {
        field: "student_id",
        operator: "eq",
        value: studentId,
      },
    ],
    queryOptions: {
      enabled: !isTeacher && Boolean(studentId),
    },
  });

  // Fast lookup set for completed assessment IDs
  const completedAssessmentIds = useMemo(() => {
    const list = submissionsResult?.data;
    if (!list) return new Set();
    return new Set(
      list.map(
        (sub: any) => sub.assessment_id || sub.assessmentId
      )
    );
  }, [submissionsResult?.data]);

  const { query } = useOne({
    resource: "courses",
    id: activeSubjectId,
    queryOptions: {
      enabled: Boolean(activeSubjectId),
    },
  });

  const subject = query.data?.data;
  const rawCode = (subject as any)?.course_code || (subject as any)?.code || "PENDING-CODE";
  const inviteLink = `https://atlas.school/register?code=${rawCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className={styles.workspaceContainer}>
      <Tabs 
        defaultValue="modules" 
        onValueChange={setActiveTab}
        className={styles.tabsRoot}
      >
        
        {/* HEADER BLOCK */}
        <div className={styles.headerBlock}>
          
          {/* Tabs Navigation */}
          <div className={styles.tabsNavWrapper}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="modules" className={styles.tabsTrigger}>
                Syllabus Modules
              </TabsTrigger>
              <TabsTrigger value="assessments" className={styles.tabsTrigger}>
                Evaluations
              </TabsTrigger>
            </TabsList>
          </div>

          {isTeacher && (
            <div className={styles.teacherControls}>
              
              {/* CONSOLIDATED COURSE CONTROLS DROPDOWN */}
              <div className={styles.controlsDropdownContainer}>
                <Button 
                  onClick={() => setShowControlsMenu(!showControlsMenu)}
                  className={styles.settingsButton}
                  title="Course Controls"
                >
                  <Settings className={styles.iconSm} />
                </Button>

                {showControlsMenu && (
                  <div className={styles.controlsMenu}>
                    <div className={styles.adminHeader}>
                      <span className={styles.adminTitle}>Course Administration</span>
                      <span className={styles.activeBadge}>Active</span>
                    </div>

                    {/* Trigger: Class Roster & Student Approvals */}
                    <button
                      onClick={() => {
                        setIsRosterModalOpen(true);
                        setShowControlsMenu(false);
                      }}
                      className={styles.deployButton}
                    >
                      <Users className={`${styles.iconSm} ${styles.textEmerald}`} />
                      <div>
                        <span className={styles.deployBtnTitle}>Class Roster</span>
                        <span className={styles.deployBtnSub}>Manage & accept enrolled students</span>
                      </div>
                    </button>

                    {/* Trigger: Deploy Subject */}
                    <button
                      onClick={() => {
                        setIsSubjectModalOpen(true);
                        setShowControlsMenu(false);
                      }}
                      className={styles.deployButton}
                    >
                      <FolderPlus className={`${styles.iconSm} ${styles.textEmerald}`} />
                      <div>
                        <span className={styles.deployBtnTitle}>Deploy New Subject</span>
                        <span className={styles.deployBtnSub}>Generate setup codes for another class</span>
                      </div>
                    </button>

                    <div className={styles.menuDivider}>
                      {/* Copy Code */}
                      <div className={styles.codeSection}>
                        <span className={styles.subLabel}>
                          <Share2 className={styles.iconXs} /> Invite Code
                        </span>
                        <div className={styles.codeBox}>
                          <span className={styles.codeText}>{rawCode}</span>
                          <button onClick={handleCopyCode} className={styles.copyBtn}>
                            {copiedCode ? <Check className={`${styles.iconXs} ${styles.textEmerald}`} /> : <Copy className={styles.iconXs} />}
                          </button>
                        </div>
                      </div>

                      {/* Copy Link */}
                      <div className={styles.codeSection}>
                        <span className={styles.subLabel}>Direct Invite URL</span>
                        <div className={styles.codeBox}>
                          <span className={styles.linkText}>{inviteLink}</span>
                          <button onClick={handleCopyLink} className={styles.copyBtn}>
                            {copiedLink ? <Check className={`${styles.iconXs} ${styles.textEmerald}`} /> : <Copy className={styles.iconXs} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CONTEXTUAL ADD ACTION */}
              {activeTab === "modules" ? (
                <Button 
                  onClick={() => setIsModuleModalOpen(true)} 
                  className={`${styles.actionButton} ${styles.addModuleBtn}`}
                >
                  <Plus className={styles.iconSm} /> Add Module
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsAssessmentModalOpen(true)} 
                  className={`${styles.actionButton} ${styles.addTaskBtn}`}
                >
                  <Plus className={styles.iconSm} /> Add Task
                </Button>
              )}

            </div>
          )}
        </div>

        {/* Content Region: Syllabus Files Table */}
        <TabsContent value="modules" className={styles.tabContentArea}>
          {filteredModules.length > 0 ? (
            filteredModules.map((mod) => {
              const targetUrl = 
                mod.fileUrl || 
                (mod as any).file_url || 
                (mod as any).url || 
                (mod as any).pdf_url || 
                "";

              return (
                <div key={mod.id} className={styles.moduleCard}>
                  <div className={styles.moduleLeft}>
                    <div className={styles.fileIconWrapper}>
                      <FileText className={styles.iconSm} />
                    </div>
                    <span className={styles.moduleTitle}>{mod.title}</span>
                  </div>
                  <div className={styles.moduleActions || "flex items-center gap-2"}>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (!targetUrl) {
                          alert("No PDF URL found for this module.");
                          return;
                        }
                        handleOpenPdf(mod.title, targetUrl);
                      }} 
                      className={styles.viewDocBtn}
                    >
                      <Eye className={styles.iconSm} /> View Document
                    </Button>

                    {isTeacher && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className={styles.deleteAssessmentBtn}
                        onClick={() => handleDeleteModule(mod.id)}
                        title="Delete Module"
                      >
                        <Trash2 className={styles.iconSm} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <FileText className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                No content modules deployed yet
              </p>
            </div>
          )}
        </TabsContent>

        {/* Content Region: Academic Tasks Grid */}
        <TabsContent value="assessments" className={styles.tabContentArea}>
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((asm) => {
              const isSubmitted = !isTeacher && completedAssessmentIds.has(asm.id);

              return (
                <div key={asm.id} className={styles.assessmentCard}>
                  <div className={styles.assessmentInfo}>
                    <div className={styles.assessmentTags}>
                      <span className={`${styles.typeBadge} ${
                        asm.type === "Exam" ? styles.badgeExam : styles.badgeAssignment
                      }`}>
                        {asm.type}
                      </span>
                      {(asm as any).category && (
                        <span className={styles.categoryBadge}>
                          {(asm as any).category}
                        </span>
                      )}
                      <h4 className={styles.assessmentHeading}>{asm.title}</h4>
                    </div>
                    <p className={styles.dueDateText}>
                      <Calendar className={styles.iconXs} /> End Date Coordination: {asm.dueDate}
                    </p>
                  </div>
                  
                  {/* Wrapped inside CSS Module wrapper class */}
                  <div className={styles.assessmentActions}>
                    <Button 
                      disabled={isSubmitted}
                      onClick={() => {
                        if (isTeacher) {
                          setSelectedReviewAssessment(asm);
                          setIsTeacherReviewOpen(true);
                        } else {
                          setSelectedActiveTest(asm);
                          setIsStudentTestOpen(true);
                        }
                      }} 
                      className={styles.assessmentActionBtn}
                    >
                      {isTeacher 
                        ? "Grade Logs" 
                        : isSubmitted 
                          ? "Submitted" 
                          : "Launch Task"}
                    </Button>

                    {isTeacher && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className={styles.deleteAssessmentBtn}
                        onClick={() => handleDeleteAssessment(asm.id)}
                        title="Delete Task"
                      >
                        <Trash2 className={styles.iconSm} />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <Calendar className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                No target objectives assigned yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Internal Sub-Modal Nodes */}
      <PdfViewModal url={activePdfUrl} title={activePdfTitle} onClose={() => setActivePdfUrl(null)} />
      
      <CreateModuleModal 
        isOpen={isModuleModalOpen} 
        onClose={() => setIsModuleModalOpen(false)} 
        activeSubjectId={activeSubjectId} 
      />
      
      <CreateAssessmentModal 
        isOpen={isAssessmentModalOpen} 
        onClose={() => setIsAssessmentModalOpen(false)} 
        activeSubjectId={activeSubjectId} 
      />

      <CreateSubjectModal 
        isOpen={isSubjectModalOpen} 
        onClose={() => setIsSubjectModalOpen(false)} 
      />

      <StudentAssessmentModal 
        isOpen={isStudentTestOpen} 
        onClose={() => setIsStudentTestOpen(false)} 
        assessment={selectedActiveTest} 
      />

      <TeacherAssessmentReviewModal
        isOpen={isTeacherReviewOpen}
        onClose={() => setIsTeacherReviewOpen(false)}
        assessment={selectedReviewAssessment}
      />

      <ClassRosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        activeSubjectId={activeSubjectId}
      />
    </div>
  );
}