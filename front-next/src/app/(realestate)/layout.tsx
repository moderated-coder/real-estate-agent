import { Suspense } from "react";
import NavBar from "./_components/NavBar";
export default function RealEstateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
      </Suspense>
      {children}
    </div>
  );
}
