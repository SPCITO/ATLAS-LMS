/**
 * 🎓 Unified Atlas Academic Type System Definitions
 * Syncs legacy sysa_spc database schemas with modern frontend views
 */

export interface UserIdentityProfile {
  student_number?: string;
  employee_id?: string;
  student_full_name?: string;
  teacher_full_name?: string;
  student_email?: string;
  teacher_email?: string;
  grade_level?: string;
  section_name?: string;
  course_code?: string;
}

export interface SubjectItem {
  id: number;
  title: string;
  code: string;
  gradeLevel: string;
  liveMeetingUrl?: string;
  iconName?:string
}

export interface CourseModule {
  id: number;
  subjectId: number;
  title: string;
  fileUrl: string;
}

export interface AssessmentItem {
  id: number;
  subjectId: number;
  title: string;
  type: "Quiz" | "Assignment" | "Exam" | "Project";
  dueDate: string;
}