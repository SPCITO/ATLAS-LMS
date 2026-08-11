import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { supabaseClient } from "@/lib/supabaseClient";

interface UserIdentity {
  uuid: string;
  [key: string]: any;
}

interface UseJoinCourseOptions {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function useJoinCourse({ onSuccess, onClose }: UseJoinCourseOptions = {}) {
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: identity } = useGetIdentity<UserIdentity>();

  const joinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = courseCode.trim().toUpperCase();

    if (!cleanCode) {
      alert("Please enter a course invite code.");
      return;
    }

    if (!identity?.uuid) {
      alert("Unable to verify student identity. Please sign in again.");
      return;
    }

    setLoading(true);

    try {
      // 1. Locate target course ID by course_code
      const { data: course, error: courseError } = await supabaseClient
        .from("courses")
        .select("id, title")
        .eq("course_code", cleanCode)
        .single();

      if (courseError || !course) {
        alert("Invalid invite code. Please verify and try again.");
        return;
      }

      // 2. Insert record into enrollments table with status set to 'pending'
      const { error: enrollError } = await supabaseClient
        .from("enrollments")
        .insert({
          student_id: identity.uuid,
          course_id: course.id,
          status: "pending",
        });

      if (enrollError) {
        if (enrollError.code === "23505") {
          alert(`You have already requested enrollment in "${course.title}".`);
        } else {
          alert(`Enrollment failed: ${enrollError.message}`);
        }
        return;
      }

      alert(
        `Enrollment request submitted for "${course.title}"! Please wait for your teacher to accept your request.`
      );
      setCourseCode("");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    courseCode,
    setCourseCode,
    loading,
    joinCourse,
  };
}