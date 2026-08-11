"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, X, ExternalLink } from "lucide-react";
import { useDocumentViewer } from "@/hooks/usePdfViewModal"; // Adjust import path as needed

import styles from "@/features/shared-features/PdfViewModal/PdfViewModal.module.css";

interface PdfViewModalProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

export function PdfViewModal({ url, title, onClose }: PdfViewModalProps) {
  const { iframeSrc } = useDocumentViewer(url);

  if (!url) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <FileText className={styles.headerIcon} />
            <h3 className={styles.title}>Previewing: {title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              Download / Open <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              variant="ghost"
              onClick={onClose}
              className={styles.closeBtn}
            >
              <X className={styles.iconSm} />
            </Button>
          </div>
        </div>

        {/* Embedded Document Frame */}
        <div className={styles.frameContainer}>
          <iframe
            src={iframeSrc}
            className={styles.iframe}
            title="Document Viewer"
          />
        </div>
      </Card>
    </div>
  );
}