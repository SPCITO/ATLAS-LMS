export interface LoginContent {
  meta: {
    title: string;
    description: string;
    footerNotice: string;
  };
  //  Added assets declaration directly inside the login interface
  assets: {
    backgroundImagePath: string;
    logoPath: string;
  };
  labels: {
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordHint: string;
    submitButtonText: string;
  };
  routing: {
    teacherFallbackEmail: string;
    teacherTargetRoute: string;
    studentTargetRoute: string;
  };
}

export const loginData: LoginContent = {
  meta: {
    title: "Welcome to Atlas",
    description: "Secure Learning Management System",
    footerNotice: "Protected Platform Workspace. Unauthorized entry protocols active.",
  },
  //  Populated asset parameters here
  assets: {
    backgroundImagePath: "/Background/green.png", 
    logoPath: "/Logo/logo.png", // Adjust paths to match your folder setup
  },
  labels: {
    emailLabel: "Email",
    emailPlaceholder: "name@academy.edu or teacher@atlas.com",
    passwordLabel: "Password",
    passwordHint: "Default Demo: teacher@atlas.com",
    submitButtonText: "Authorize System Workspace",
  },
  routing: {
    teacherFallbackEmail: "teacher@atlas.com",
    teacherTargetRoute: "/dashboard/teacher",
    studentTargetRoute: "/dashboard/student",
  },
};