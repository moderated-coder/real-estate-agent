import Link from "next/link";
import FolderList from "./_components/FolderList";
export default function FolderLayout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <div>
      <header className="min-w-[555px] w-full bg-white shadow-sm border-b">
        <div className="mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="whitespace-nowrap text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>
        </div>
      </header>
      <div className="flex mx-auto gap-5 p-8 min-h-screen">
        <FolderList />
        {children}
      </div>
    </div>
  );
}
