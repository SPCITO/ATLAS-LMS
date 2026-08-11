"use client";

import { useTable } from "@refinedev/core";
import { CourseModule } from "@/types";

export function useModuleExplorer() {
  const { result, tableQuery } = useTable<CourseModule>({
    resource: "modules",
  });

  const modules = result?.data ?? [];

  const handleUpload = () => {
    alert("Refine deployment trigger: File streaming buffer is active.");
  };

  const handleDownload = (id: string | number) => {
    alert(`Downloading structural target asset node: #${id}`);
  };

  return {
    modules,
    isLoading: tableQuery?.isLoading,
    handleUpload,
    handleDownload,
  };
}