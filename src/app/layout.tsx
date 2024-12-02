import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distill | AI-Powered Content Intelligence",
  description: "Transform lengthy content into clear, actionable insights. From articles to videos, get to the essence in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
