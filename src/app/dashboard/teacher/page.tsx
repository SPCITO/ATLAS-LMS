"use client";

import React from "react";
import { AcademicHubShell } from "@/sections/AcademicHubShell";

export default function TeacherDashboardPage() {
  return <AcademicHubShell roleTitle="Faculty Management" isTeacher={true} />;
}