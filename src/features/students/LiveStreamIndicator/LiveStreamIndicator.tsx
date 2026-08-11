"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Radio, Link2 } from "lucide-react";
import { useLiveStream } from "@/hooks/useLiveStream";

import styles from "@/features/students/LiveStreamIndicator/LiveStreamIndicator.module.css"; // Scoped CSS module for LiveStreamIndicator

interface LiveStreamIndicatorProps {
  isTeacher: boolean;
  activeSubjectId: string | number;
}

export function LiveStreamIndicator({ isTeacher = false, activeSubjectId }: LiveStreamIndicatorProps) {
  const {
    inputUrl,
    setInputUrl,
    activeMeetingUrl,
    currentSubject,
    isLoading,
    isUpdating,
    urlError,
    handleUrlUpdate,
  } = useLiveStream({ activeSubjectId });

  if (isLoading) {
    return (
      <Card className={`${styles.card} ${styles.pulse}`}>
        <div className={styles.loadingSkeleton} />
      </Card>
    );
  }

  const hasActiveLink = Boolean(activeMeetingUrl);

  return (
    <Card 
      className={`${styles.card} ${
        hasActiveLink ? styles.cardActive : styles.cardInactive
      }`}
    >
      <CardHeader>
        <CardTitle className={styles.headerTitle}>
          <Radio 
            className={`${styles.radioIcon} ${
              hasActiveLink ? styles.pulse : styles.radioIconInactive
            }`} 
          />
          Live Lecture Telemetry ({currentSubject?.code ?? "N/A"})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isTeacher ? (
          /* Student Display Panel */
          <div className={styles.studentPanel}>
            <div>
              <h4 className={styles.panelTitle}>
                {hasActiveLink ? "Sync Coordinate Active" : "No Active Stream Tracked"}
              </h4>
              <p className={styles.panelDescription}>
                {hasActiveLink 
                  ? `Instructor streaming session for ${currentSubject?.title ?? "this subject"}` 
                  : "Standby for the instructor to broadcast the stream coordinates."}
              </p>
            </div>
            {hasActiveLink && (
              <a 
                href={activeMeetingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className={styles.linkWrapper}
              >
                <Button className={styles.joinBtn}>
                  <Video className={styles.iconSm} />
                  Join Lecture
                </Button>
              </a>
            )}
          </div>
        ) : (
          /* Teacher Control Form Matrix */
          <form onSubmit={handleUrlUpdate} className={styles.form}>
            <div className={styles.inputWrapper}>
              <Link2 className={styles.inputIcon} />
              <input
                type="url"
                placeholder="Paste dynamic stream meeting link (Zoom / Google Meet)..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className={styles.textInput}
              />
            </div>
            {urlError && <p className={styles.errorMessage}>{urlError}</p>}
            <Button type="submit" disabled={isUpdating} className={styles.submitBtn}>
              {isUpdating ? "Broadcasting..." : "Broadcast Updated Coordinates"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}