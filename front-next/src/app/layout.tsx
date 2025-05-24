import ClientInit from "@/components/ClientInit";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
