"use client";

import React from "react";
import { AcademicHubShell } from "@/sections/AcademicHubShell";

export default function StudentDashboardPage() {
  return <AcademicHubShell roleTitle="Student Portal" isTeacher={false} />;
}