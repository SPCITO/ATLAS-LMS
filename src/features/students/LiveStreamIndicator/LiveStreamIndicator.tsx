"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Radio, Link2, VideoOff } from "lucide-react";
import { useLiveStream } from "@/hooks/useLiveStream";

import styles from "@/features/students/LiveStreamIndicator/LiveStreamIndicator.module.css";

interface LiveStreamIndicatorProps {
  isTeacher: boolean;
  activeSubjectId: string | number;
}

export function LiveStreamIndicator({
  isTeacher = false,
  activeSubjectId,
}: LiveStreamIndicatorProps) {
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
      <Card className={`${styles.card} ${styles.pulse} p-0 border-0`}>
        <div className={styles.loadingSkeleton} />
      </Card>
    );
  }

  const hasActiveLink = Boolean(activeMeetingUrl);

  return (
    <Card
      className={`${styles.card} ${
        hasActiveLink ? styles.cardActive : styles.cardInactive
      } p-0 border-0 shadow-sm`}
    >
      <CardContent className="p-2 sm:p-3">
        {!isTeacher ? (
          /* Student Mode: Single horizontal row to save vertical space */
          <div className="flex items-center justify-between gap-2">
            <div className={styles.headerTitle}>
              <Radio
                className={`${styles.radioIcon} ${
                  hasActiveLink ? styles.pulse : styles.radioIconInactive
                } shrink-0`}
              />
              <span className="truncate text-xs font-bold">
                ({currentSubject?.code ?? "N/A"})
              </span>
            </div>

            <div className="shrink-0 min-w-[120px]">
              {hasActiveLink ? (
                <a
                  href={activeMeetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkWrapper}
                >
                  <Button className={styles.joinBtn}>
                    <Video className={styles.iconSm} />
                    <span>Join Lecture</span>
                  </Button>
                </a>
              ) : (
                <Button
                  disabled
                  className={`${styles.joinBtn} ${styles.disabledBtn}`}
                >
                  <VideoOff className={styles.iconSm} />
                  <span>No Room Link</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Teacher Mode: Compact form */
          <div className="flex flex-col gap-2">
            <div className={styles.headerTitle}>
              <Radio
                className={`${styles.radioIcon} ${
                  hasActiveLink ? styles.pulse : styles.radioIconInactive
                }`}
              />
              <span className="truncate text-xs font-bold">
                ({currentSubject?.code ?? "N/A"})
              </span>
            </div>

            <form onSubmit={handleUrlUpdate} className={styles.form}>
              <div className={styles.inputWrapper}>
                <Link2 className={styles.inputIcon} />
                <input
                  type="url"
                  placeholder="Paste meeting link..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              {urlError && <p className={styles.errorMessage}>{urlError}</p>}
              <Button
                type="submit"
                disabled={isUpdating}
                className={styles.submitBtn}
              >
                {isUpdating ? "Broadcasting..." : "Broadcast Link"}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
