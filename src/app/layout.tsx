import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";
import { Navigation } from "@/components/Common/Navigation";

export const metadata: Metadata = {
  title: "StorySteps",
  description: "AI-powered language learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AppProvider>
          <Navigation />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
