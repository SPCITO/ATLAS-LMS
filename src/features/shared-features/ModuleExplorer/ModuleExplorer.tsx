"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Download, UploadCloud } from "lucide-react";
import { useModuleExplorer } from "@/hooks/useModuleExplorer";

import styles from "@/features/shared-features/ModuleExplorer/ModuleExplorer.module.css"; // Scoped CSS module for ModuleExplorer

interface ModuleExplorerProps {
  isTeacher?: boolean;
}

export function ModuleExplorer({ isTeacher = false }: ModuleExplorerProps) {
  const { modules, isLoading, handleUpload, handleDownload } = useModuleExplorer();

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div>
          <CardTitle className={styles.cardTitle}>
            Academic Core Modules
          </CardTitle>
          <CardDescription className={styles.cardDescription}>
            Verified syllabus directives & documentation
          </CardDescription>
        </div>
        {isTeacher && (
          <Button 
            onClick={handleUpload}
            className={styles.uploadBtn}
          >
            <UploadCloud className={styles.iconSm} />
            Upload PDF
          </Button>
        )}
      </CardHeader>

      <CardContent className={styles.cardContent}>
        {isLoading ? (
          <div className={styles.loadingState}>
            Syncing document nodes...
          </div>
        ) : (
          <Table>
            <TableHeader className={styles.tableHeader}>
              <TableRow className={styles.headerRow}>
                <TableHead className={styles.thDocument}>
                  Resource Document
                </TableHead>
                <TableHead className={styles.thAction}>
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((item) => (
                <TableRow key={item.id} className={styles.tableRow}>
                  <TableCell className={styles.cellDocument}>
                    <FileText className={styles.fileIcon} />
                    <span className={styles.docTitle}>
                      {item.title || `Curriculum_Framework_v${item.id}.pdf`}
                    </span>
                  </TableCell>
                  <TableCell className={styles.cellAction}>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownload(item.id)}
                      className={styles.downloadBtn}
                    >
                      <Download className={styles.iconXs} />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}