import "./globals.css";
import BackgroundOrbs from "@/components/BackgroundOrbs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="bg-gradient" />
        <BackgroundOrbs />
        {children}
      </body>
    </html>
  );
}
