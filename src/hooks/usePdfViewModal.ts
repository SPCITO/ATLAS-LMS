import { useMemo } from "react";

interface DocumentViewerHook {
  iframeSrc: string;
  isPdf: boolean;
  isOfficeDoc: boolean;
}

export function useDocumentViewer(url: string | null): DocumentViewerHook {
  return useMemo(() => {
    if (!url) {
      return { iframeSrc: "", isPdf: false, isOfficeDoc: false };
    }

    const cleanUrl = url.split("?")[0].toLowerCase();

    // 1. Check if file is genuinely a PDF
    const isPdf =
      cleanUrl.endsWith(".pdf") ||
      url.startsWith("blob:") ||
      url.startsWith("data:");

    // 2. Check if file is an Office document
    const isOfficeDoc =
      cleanUrl.endsWith(".docx") ||
      cleanUrl.endsWith(".doc") ||
      cleanUrl.endsWith(".xlsx") ||
      cleanUrl.endsWith(".pptx");

    // Determine iframe source URL based on file type
    let iframeSrc = url;

    if (isOfficeDoc) {
      iframeSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    } else if (!isPdf) {
      iframeSrc = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }

    return { iframeSrc, isPdf, isOfficeDoc };
  }, [url]);
}