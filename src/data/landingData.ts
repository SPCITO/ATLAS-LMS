export interface FeatureItem {
  id: string;
  icon: "Compass" | "Shield" | "Terminal";
  title: string;
  description: string;
}

export interface LandingContent {
  meta: {
    systemName: string;
    badgeText: string;
  };
  assets: {
    logoPath: string;
    backgroundImagePath: string;
  };
  hero: {
    title: string;
    description: string;
    ctaButtonText: string;
  };
  features: FeatureItem[];
}

export const landingData: LandingContent = {
  meta: {
    systemName: "Atlas LMS",
    badgeText: "LMS Powered by Next.js & Refine",
  },
  assets: {
    logoPath: "/Logo/SPCLOGO.avif",
    backgroundImagePath: "/Background/green.png",
  },
  hero: {
    title: "ATLAS LMS",
    description: "A unified academic portal built to simplify classroom management, track student progress, and deliver clear performance insights.",
    ctaButtonText: "Enter Portal",
  },
features: [
  {
    id: "feat-1",
    icon: "Compass",
    title: "Easy Navigation",
    description: "A clean, consistent view across all your courses and class tools.",
  },
  {
    id: "feat-2",
    icon: "Shield",
    title: "Tailored Dashboards",
    description: "Dedicated spaces designed specifically for teachers and students.",
  },
  {
    id: "feat-3",
    icon: "Terminal",
    title: "Fast & Reliable",
    description: "Fast updates to keep grades, schedules, and materials accurate.",
  },
],
};