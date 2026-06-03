import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/react-query";
import ClientMeshBackground from "@/components/ClientMeshBackground";

export const metadata: Metadata = {
  title: "Pre-Closure AI — The World's Most Advanced AI Sales Pre-Closer",
  description: "Pre-Closure AI qualifies, nurtures, follows up, scores, books, and prepares your prospects before you ever join the call.",
  keywords: "pre-closure ai, sales pre-closer, ai lead qualification, sales automation, follow-up engine, lead nurturing, objection handler",
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
