import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="bg-gradient" />
        {children}
      </body>
    </html>
  );
}
