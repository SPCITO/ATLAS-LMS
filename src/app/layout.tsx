import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RefineProvider } from "@/providers/RefineProvider";

// Configured with essential weights and display swap for crisp rendering
const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Atlas LMS",
  description: "Next-gen Learning Framework",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body 
        className={`${inter.className} antialiased text-slate-900 bg-white selection:bg-emerald-500 selection:text-white`} 
        suppressHydrationWarning
      >
        <RefineProvider>{children}</RefineProvider>
      </body>
    </html>
  );
}