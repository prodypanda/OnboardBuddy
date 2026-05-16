import type { Metadata } from "next";
import "@onboardbuddy/react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnboardBuddy Demo",
  description: "Character-guided onboarding tours for React and Next.js apps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
