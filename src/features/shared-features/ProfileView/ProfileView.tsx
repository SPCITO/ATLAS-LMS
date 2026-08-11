"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Shield, 
  KeyRound, 
  Layers, 
  GraduationCap, 
  CheckCircle2, 
  Loader2, 
  LogOut, 
  Building2,
  Mail,
  Fingerprint,
  Sparkles
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { PROFILE_CONTENT } from "@/data/profileData";

import styles from "@/features/shared-features/ProfileView/ProfileView.module.css";

export function ProfileView() {
  const {
    identity,
    isLoading,
    isSubmittingPassword,
    isLoggingOut,
    userDisplayName,
    accountId,
    accountEmail,
    isFaculty,
    academicProgram,
    handlePasswordResetRequest,
    handleSignOut,
  } = useProfile();

  if (isLoggingOut) {
    return (
      <div className={styles.logoutOverlay}>
        <div className="relative flex items-center justify-center">
          <div className={styles.pingCircle} />
          <div className={styles.logoutIconWrapper}>
            <LogOut className="h-6 w-6 stroke-[2.2]" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className={styles.logoutTitle}>
            {PROFILE_CONTENT.loading.deauthorizingTitle}
          </h3>
          <p className={styles.logoutDesc}>
            {PROFILE_CONTENT.loading.deauthorizingDesc}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={`${styles.iconMd} ${styles.spin} text-emerald-600`} />
        <span>{PROFILE_CONTENT.loading.synchronizingText}</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Identity Header */}
      <Card className={styles.heroCard}>
        <div className={styles.heroBanner}>
          <div className={styles.heroOverlay} />
        </div>
        
        <CardContent className={styles.heroContent}>
          <div className={styles.userHeaderRow}>
            <div className={styles.userInfoGroup}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <User className={styles.iconLg} />
                </div>
                <div className={styles.avatarOnlineDot} title="Account Active" />
              </div>
              
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`${styles.roleBadge} ${isFaculty ? styles.roleBadgeFaculty : styles.roleBadgeStudent}`}>
                    <Sparkles className="w-3 h-3" />
                    {isFaculty ? PROFILE_CONTENT.roles.faculty : PROFILE_CONTENT.roles.student}
                  </span>
                </div>
                <h2 className={styles.userName}>
                  {userDisplayName}
                </h2>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className={styles.disconnectBtn}
            >
              <LogOut className="h-3.5 w-3.5 stroke-[2.2]" />
              {PROFILE_CONTENT.actions.disconnectBtn}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid Section */}
      <div className={styles.mainGrid}>
        {/* Academic & Registry Information */}
        <Card className={`${styles.card} ${styles.registryCol}`}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <Layers className="w-4 h-4 text-emerald-600" />
              {PROFILE_CONTENT.registryMatrix.title}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              {PROFILE_CONTENT.registryMatrix.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            <div className={`${styles.grid2Col} ${styles.borderBottom}`}>
              <div className={styles.dataTile}>
                <label className={styles.fieldLabel}>
                  <Fingerprint className="w-3 h-3 inline mr-1 text-slate-400" />
                  {PROFILE_CONTENT.registryMatrix.labels.id}
                </label>
                <span className={styles.fieldValueMono}>{accountId}</span>
              </div>
              
              <div className={styles.dataTile}>
                <label className={styles.fieldLabel}>
                  <Mail className="w-3 h-3 inline mr-1 text-slate-400" />
                  {PROFILE_CONTENT.registryMatrix.labels.email}
                </label>
                <span className={styles.fieldValueText}>{accountEmail}</span>
              </div>
            </div>

            <div className={styles.grid2Col}>
              <div className={styles.dataTile}>
                <label className={styles.fieldLabel}>
                  {isFaculty ? "DEPARTMENT" : "COURSE / STRAND"}
                </label>
                <div className="flex items-center gap-2 mt-1.5 font-semibold text-slate-800 text-sm">
                  {isFaculty ? (
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{academicProgram || "Unassigned"}</span>
                </div>
              </div>

              <div className={styles.dataTile}>
                <label className={styles.fieldLabel}>SYSTEM ROLE</label>
                <span className="capitalize text-sm font-bold text-slate-800 block mt-1.5">
                  {identity?.role || "User"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Telemetry */}
        <div className={`${styles.securityCol} ${styles.spaceY6}`}>
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <Shield className="w-4 h-4 text-emerald-600" />
                {PROFILE_CONTENT.securityConfig.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <form onSubmit={handlePasswordResetRequest} className="space-y-4">
                <div className={styles.noticeBox}>
                  <KeyRound className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className={styles.noticeText}>
                    {PROFILE_CONTENT.securityConfig.notice}
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmittingPassword}
                  className={styles.resetBtn}
                >
                  {isSubmittingPassword && <Loader2 className={`${styles.iconSm} ${styles.spin}`} />}
                  {PROFILE_CONTENT.actions.resetBtn}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className={styles.statusCard}>
            <CardContent className={styles.statusRow}>
              <div className={styles.statusGroup}>
                <div className={styles.statusDot} />
                <div>
                  <h4 className={styles.statusTitle}>
                    {PROFILE_CONTENT.telemetry.statusTitle}
                  </h4>
                  <p className={styles.statusDesc}>
                    {PROFILE_CONTENT.telemetry.statusDesc}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}