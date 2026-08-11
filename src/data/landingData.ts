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
    titleLineOne: string;
    gradientText: string;
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
  titleLineOne: "Empower Learning &",
  gradientText: "Student Success",
  description: "A unified academic portal built to simplify classroom management, track student progress, and deliver clear performance insights.",
  ctaButtonText: "Enter Portal",
},
  features: [
    {
      id: "feat-1",
      icon: "Compass",
      title: "De-coupled Layouts",
      description: "Shared presentation skins across diverse entity matrices.",
    },
    {
      id: "feat-2",
      icon: "Shield",
      title: "Role Routing",
      description: "Automated workspace forks separating student and instructor logs.",
    },
    {
      id: "feat-3",
      icon: "Terminal",
      title: "Refine Data Core",
      description: "Eliminating routine data pipeline plumbing code globally.",
    },
  ],
};