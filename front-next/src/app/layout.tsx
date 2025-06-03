import "./globals.css";
import RQProviders from "./_components/RQProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <RQProviders>
          <main className="max-w-6xl mx-auto px-4 pt-4 pb-10">{children}</main>
        </RQProviders>
      </body>
    </html>
  );
}
