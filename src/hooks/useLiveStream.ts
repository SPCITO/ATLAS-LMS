"use client";

import React, { useState, useEffect } from "react";
import { useOne, useUpdate } from "@refinedev/core";

export interface SubjectItem {
  id: string | number;
  title?: string;
  code?: string;
  course_code?: string;
  live_meeting_url?: string;
  liveMeetingUrl?: string;
  [key: string]: any;
}

interface UseLiveStreamProps {
  activeSubjectId: string | number;
}

export function useLiveStream({ activeSubjectId }: UseLiveStreamProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const { result, query } = useOne<SubjectItem>({
    resource: "courses",
    id: activeSubjectId,
    queryOptions: {
      enabled: Boolean(activeSubjectId),
    },
  });

  const rawSubject = result;
  const isLoading = query.isLoading;
  const refetch = query.refetch;

  // Extract database string strictly
  const dbUrl = (
    rawSubject?.live_meeting_url ??
    rawSubject?.liveMeetingUrl ??
    ""
  ).toString().trim();

  // Helper: check if string is a valid URL
  const isValidUrlFormat = (str: string) => {
    if (!str) return false;
    try {
      const formatted = str.startsWith("http://") || str.startsWith("https://") ? str : `https://${str}`;
      const url = new URL(formatted);
      return url.hostname.includes(".");
    } catch {
      return false;
    }
  };

  // Only assign activeMeetingUrl if dbUrl is an actual valid URL
  const activeMeetingUrl = dbUrl && isValidUrlFormat(dbUrl)
    ? dbUrl.startsWith("http://") || dbUrl.startsWith("https://")
      ? dbUrl
      : `https://${dbUrl}`
    : "";

  const currentSubject = rawSubject
    ? {
        ...rawSubject,
        code: rawSubject.code || rawSubject.course_code || "N/A",
        liveMeetingUrl: activeMeetingUrl,
      }
    : undefined;

  const { mutate: updateSubject } = useUpdate();

  useEffect(() => {
    setInputUrl(activeMeetingUrl);
    setUrlError(null);
  }, [activeSubjectId, activeMeetingUrl]);

  const handleUrlUpdate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUrlError(null);

    let trimmedUrl = inputUrl.trim();

    if (trimmedUrl && !isValidUrlFormat(trimmedUrl)) {
      setUrlError("Please enter a valid URL (e.g., https://meet.google.com/abc-defg-hij)");
      return;
    }

    if (trimmedUrl && !trimmedUrl.startsWith("http://") && !trimmedUrl.startsWith("https://")) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    setIsUpdating(true);

    updateSubject(
      {
        resource: "courses",
        id: activeSubjectId,
        values: { live_meeting_url: trimmedUrl },
      },
      {
        onSuccess: () => {
          setIsUpdating(false);
          setUpdateSuccess(true);
          refetch();
          setTimeout(() => setUpdateSuccess(false), 3000);
        },
        onError: (err) => {
          setIsUpdating(false);
          setUrlError("Failed to update broadcast coordinates. Please try again.");
          console.error("Live stream URL update error:", err);
        },
      }
    );
  };

  const handleClearUrl = () => {
    setInputUrl("");
    updateSubject(
      {
        resource: "courses",
        id: activeSubjectId,
        values: { live_meeting_url: "" },
      },
      {
        onSuccess: () => {
          setUpdateSuccess(true);
          refetch();
          setTimeout(() => setUpdateSuccess(false), 3000);
        },
      }
    );
  };

  return {
    inputUrl,
    setInputUrl,
    activeMeetingUrl,
    currentSubject,
    isLoading,
    isUpdating,
    updateSuccess,
    urlError,
    handleUrlUpdate,
    handleClearUrl,
  };
}