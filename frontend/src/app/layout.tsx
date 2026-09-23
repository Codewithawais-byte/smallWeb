import "./globals.css";

export const metadata = { title: "The Small Web" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
