export default function SavedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex mx-auto gap-5 p-8 min-h-screen">
      {/* Sidebar */}
      <aside className="w-[220px] bg-white rounded-xl shadow-md p-5 h-fit">
        <h3 className="text-lg font-semibold mb-3">리스트</h3>
        <ul className="space-y-1">
          {["김철수", "이영희", "박지훈", "새 고객 추가 +"].map((name, idx) => (
            <li
              key={idx}
              className={`px-3 py-2 rounded-md cursor-pointer transition ${
                idx === 0 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      </aside>
      {children}
    </div>
  );
}
