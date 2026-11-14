import type { Metadata } from "next";
import "./globals.css";
import StoreHydration from "@/components/StoreHydration";

export const metadata: Metadata = {
  title: "CodeQuest — Learn Python, Level by Level",
  description: "A gamified, in-browser Python learning platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-quest-bg bg-quest-pattern text-slate-100 antialiased selection:bg-quest-blue/30 selection:text-quest-blueLight">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
