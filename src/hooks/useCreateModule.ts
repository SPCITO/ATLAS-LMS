// src/hooks/useCreateModule.ts
"use client";

import React, { useState, useRef } from "react";
import { useCreate } from "@refinedev/core";
import { supabaseClient } from "@/lib/supabaseClient";

interface UseCreateModuleProps {
  activeSubjectId: string | number;
  onClose: () => void;
}

export function useCreateModule({ activeSubjectId, onClose }: UseCreateModuleProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createRecord } = useCreate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const targetSubjectId = activeSubjectId ? String(activeSubjectId).trim() : null;

    if (!targetSubjectId) {
      console.error("Cannot upload module: activeSubjectId is empty or undefined.");
      alert("Please select a course before uploading modules.");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        // 1. Generate unique file path
        const fileExt = file.name.split(".").pop();
        const filePath = `${targetSubjectId}/${crypto.randomUUID()}.${fileExt}`;

        // 2. Upload file to Supabase Storage bucket
        const { error: uploadError } = await supabaseClient.storage
          .from("course-modules")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Supabase storage upload error:", uploadError);
          alert(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // 3. Obtain public URL synchronously
        const { data: publicUrlData } = supabaseClient.storage
          .from("course-modules")
          .getPublicUrl(filePath);

        const filePublicUrl = publicUrlData.publicUrl;

        // 4. Record database entry
        createRecord({
          resource: "modules",
          values: {
            id: crypto.randomUUID(),
            subject_id: targetSubjectId,
            title: file.name,
            file_url: filePublicUrl,
            file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          },
        });
      }

      clearSelection();
      onClose();
    } catch (err) {
      console.error("Unexpected upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    selectedFiles,
    isUploading,
    fileInputRef,
    handleFileChange,
    removeFile,
    clearSelection,
    handleSubmit,
    triggerFileInput,
  };
}