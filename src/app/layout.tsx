import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children ?? (
          <p style={{ color: "red", fontSize: 24 }}>
            CHILDREN FAILED TO RENDER
          </p>
        )}
      </body>
    </html>
  );
}
