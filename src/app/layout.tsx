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
      <body className="min-h-screen bg-quest-bg text-white antialiased">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
