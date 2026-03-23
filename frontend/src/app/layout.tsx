import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/react-query";
import ClientMeshBackground from "@/components/ClientMeshBackground";

export const metadata: Metadata = {
  title: "Pre-Closer AI — Your AI Sales Pre-Closer",
  description: "Qualify leads, detect buying signals, and book calls automatically with AI. The complete AI sales platform for growth teams.",
  keywords: "AI sales, lead qualification, sales automation, AI lead scoring, sales pre-closer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ClientMeshBackground />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
