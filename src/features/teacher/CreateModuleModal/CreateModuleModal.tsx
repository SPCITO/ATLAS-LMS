// src/sections/subject-hub/CreateModuleModal.tsx
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Trash2, Layers, Loader2 } from "lucide-react";
import { useCreateModule } from "@/hooks/useCreateModule";

import styles from "@/features/teacher/CreateModuleModal/CreateModuleModal.module.css"; // Scoped CSS module for CreateModuleModal

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubjectId: string | number;
}

export function CreateModuleModal({ isOpen, onClose, activeSubjectId }: CreateModuleModalProps) {
  const {
    selectedFiles,
    isUploading,
    fileInputRef,
    handleFileChange,
    removeFile,
    clearSelection,
    handleSubmit,
    triggerFileInput,
  } = useCreateModule({ activeSubjectId, onClose });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <Card className={styles.modalCard}>
        {/* Header Node */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Layers className={styles.iconSm} />
          </div>
          <h3 className={styles.title}>
            Upload Target Module Node
          </h3>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* File Drag Drop Selection Area */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Academic Documents (One-to-Many Selection)
            </label>
            
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className={styles.dropzone}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange} 
                className={styles.hiddenInput} 
              />
              <UploadCloud className={styles.uploadIcon} />
              <span className={styles.dropzoneTitle}>
                Choose Module Files
              </span>
              <span className={styles.dropzoneSub}>
                PDF, PPT, DOC up to many instances
              </span>
            </button>
          </div>

          {/* Staged files array monitor list */}
          {selectedFiles.length > 0 && (
            <div className={styles.fileList}>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <FileText className={styles.fileIcon} />
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                  <div className={styles.fileMeta}>
                    <span className={styles.sizeBadge}>
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => removeFile(idx)}
                      className={styles.removeBtn}
                    >
                      <Trash2 className={styles.iconXs} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dialog Action Buttons footer */}
          <div className={styles.footerActions}>
            <Button 
              type="button" 
              variant="ghost" 
              disabled={isUploading}
              onClick={() => {
                clearSelection();
                onClose();
              }} 
              className={styles.cancelBtn}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={selectedFiles.length === 0 || isUploading}
              className={styles.deployBtn}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </span>
              ) : (
                `Deploy ${selectedFiles.length > 0 ? `${selectedFiles.length} Assets` : "Asset"}`
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}