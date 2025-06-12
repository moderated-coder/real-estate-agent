"use client";
import { useQuery } from "@tanstack/react-query";
import { getFolderList } from "@/src/lib/api";
import { useParams, useRouter } from "next/navigation";

const FolderList = () => {
  const { user, foldername } = useParams<{ user: string; foldername: string }>();
  const router = useRouter();
  const { data: folders } = useQuery({
    queryKey: ["folders", user],
    queryFn: getFolderList,
  });

  return (
    <aside className="w-[220px] bg-white rounded-xl shadow-md p-5 h-fit">
      <h3 className="text-lg font-semibold mb-3">리스트</h3>
      <ul className="space-y-1">
        {folders?.map((folder: string, idx: number) => (
          <li
            key={idx}
            className={`px-3 py-2 rounded-md cursor-pointer transition ${
              folder === decodeURIComponent(foldername) ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              router.replace(`/folder/${user}/${encodeURIComponent(folder)}`);
            }}
          >
            {folder}
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default FolderList;
