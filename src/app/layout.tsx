export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ background: "black", color: "white" }}>
        <div style={{ fontSize: "40px", padding: "40px" }}>
          ROOT LAYOUT WORKING
        </div>
        {children}
      </body>
    </html>
  );
}
