import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/react-query";
import ClientMeshBackground from "@/components/ClientMeshBackground";

export const metadata: Metadata = {
  title: "Pre Closer — Agency Growth Audit & Revenue Optimization",
  description: "Find out where your agency is losing clients and revenue. We analyze your lead generation, follow-up, and conversion process to identify hidden growth leaks.",
  keywords: "agency growth audit, revenue optimization, lead conversion analysis, follow-up analysis, agency consulting",
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
