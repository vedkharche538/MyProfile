import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vedhas Kharche — System Architect OS",
  description:
    "Senior Backend & Data Engineer. Distributed systems, cloud architecture, and generative AI at production scale. Interactive portfolio with 3 modes: 3D Architecture, CLI Terminal, and Executive UI.",
  keywords: [
    "Vedhas Kharche",
    "Senior Software Engineer",
    "Backend Engineer",
    "Data Engineer",
    "Distributed Systems",
    "AWS",
    "Kubernetes",
    "FastAPI",
    "Databricks",
    "Microservices",
    "Generative AI",
    "RAG",
  ],
  authors: [{ name: "Vedhas Kharche" }],
  openGraph: {
    title: "Vedhas Kharche — System Architect OS",
    description:
      "Senior Backend & Data Engineer — 6 years building distributed systems on AWS & Databricks.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vedhas Kharche — System Architect OS",
    description: "Senior Backend & Data Engineer portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
