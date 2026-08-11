import { useState, useEffect, useCallback, useMemo } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export interface EnrolledStudent {
  enrollment_id: string;
  student_id: string;
  enrolled_at: string;
  status: string;
  full_name: string;
  id_number: string;
  course_strand?: string;
}

interface UseClassRosterOptions {
  isOpen: boolean;
  activeSubjectId: string | number;
}

export function useClassRoster({ isOpen, activeSubjectId }: UseClassRosterOptions) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    if (!activeSubjectId) return;
    setLoading(true);

    try {
      const { data, error } = await supabaseClient
        .from("enrollments")
        .select(`
          id,
          student_id,
          enrolled_at,
          status,
          profiles (
            full_name,
            id_number,
            course_strand
          )
        `)
        .eq("course_id", activeSubjectId);

      if (error) {
        console.error("Error fetching roster:", error.message || error.details || JSON.stringify(error));
        setStudents([]);
        return;
      }

      const formatted: EnrolledStudent[] = (data || []).map((item: any) => {
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;

        return {
          enrollment_id: item.id,
          student_id: item.student_id,
          enrolled_at: item.enrolled_at,
          status: item.status || "approved",
          full_name: profile?.full_name || "Unknown Student",
          id_number: profile?.id_number || "N/A",
          course_strand: profile?.course_strand || "N/A",
        };
      });

      setStudents(formatted);
    } catch (err: any) {
      console.error("Unexpected roster error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [activeSubjectId]);

  useEffect(() => {
    if (isOpen && activeSubjectId) {
      fetchRoster();
    }
  }, [isOpen, activeSubjectId, fetchRoster]);

  const handleApprove = async (enrollmentId: string) => {
    setActionLoading(enrollmentId);
    try {
      const { error } = await supabaseClient
        .from("enrollments")
        .update({ status: "approved" })
        .eq("id", enrollmentId);

      if (error) throw error;

      setStudents((prev) =>
        prev.map((s) => (s.enrollment_id === enrollmentId ? { ...s, status: "approved" } : s))
      );
    } catch (err: any) {
      alert(`Failed to approve student: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (enrollmentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to remove ${studentName} from this class?`)) return;

    setActionLoading(enrollmentId);
    try {
      const { error, count } = await supabaseClient
        .from("enrollments")
        .delete({ count: "exact" })
        .eq("id", enrollmentId);

      if (error) {
        console.error("Supabase Delete Error:", error);
        alert(`Database Error: ${error.message}`);
        return;
      }

      if (count === 0) {
        alert("Permission denied or record not found. Check Supabase RLS policies.");
        return;
      }

      setStudents((prev) => prev.filter((s) => s.enrollment_id !== enrollmentId));
    } catch (err: any) {
      console.error(err);
      alert(`Failed to remove student: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(query) ||
        s.id_number.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  return {
    students,
    filteredStudents,
    loading,
    searchQuery,
    setSearchQuery,
    actionLoading,
    handleApprove,
    handleRemove,
    refetch: fetchRoster,
  };
}