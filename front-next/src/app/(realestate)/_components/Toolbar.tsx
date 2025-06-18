"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getFolderList } from "@/src/lib/api";
import { addEstatesToFolder } from "@/src/lib/api";

interface ToolbarProps {
  selectedCount: number;

  allListingsCount: number;
  onSelectAll: (isChecked: boolean) => void;
  allItemsSelected: boolean;
  selectedEstateIds: Set<string>;
  onClearSelection: () => void;
}

const Toolbar = ({
  selectedCount,
  allListingsCount,
  onSelectAll,
  allItemsSelected,
  selectedEstateIds,
  onClearSelection,
}: ToolbarProps) => {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const router = useRouter();
  const { data: folders } = useQuery({
    queryKey: ["folders", "admin"],
    queryFn: getFolderList,
  });
  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "admin", folder_name: folderName }),
      });
      if (!res.ok) throw new Error("Failed to create folder");
      return folderName;
    },
    onMutate: async (newFolderName) => {
      await queryClient.cancelQueries({ queryKey: ["folders", "admin"] });
      const previousFolders = queryClient.getQueryData<string[]>(["folders", "admin"]) ?? [];
      queryClient.setQueryData(["folders", "admin"], (old: string[] = []) => [...old, newFolderName]);
      return { previousFolders };
    },
    onError: (_err, _newFolderName, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders", "admin"], context.previousFolders);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", "admin"] });
      setIsAddingFolder(false);
      setNewFolderName("");
    },
  });

  const saveToSpecificFolderMutation = useMutation({
    mutationFn: ({ folderName, estateIds }: { folderName: string; estateIds: string[] }) =>
      addEstatesToFolder({ folderName, estateIds }),
    onSuccess: (folderName) => {
      alert(`${selectedCount}개의 항목을 '${folderName}' 폴더에 추가했습니다!`);
      onClearSelection();
      queryClient.invalidateQueries({ queryKey: ["folders", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["folderContent", "admin", folderName] });
    },
    onError: (error, { folderName }) => {
      console.error(`'${folderName}' 폴더에 항목 추가 실패:`, error);
      alert(`'${folderName}' 폴더에 항목 추가 실패: ${error.message}`);
    },
  });

  const mutateCreateFolder = (folderName: string) => {
    if (!folderName.trim()) return;
    createFolderMutation.mutate(folderName);
    setNewFolderName("");
    setIsAddingFolder(false);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      mutateCreateFolder(newFolderName);
    }
  };

  const handleToolbarSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(e.target.checked);
  };

  const handleFolderClickToSave = (folderName: string) => {
    if (selectedCount === 0) {
      alert("폴더에 추가할 선택된 항목이 없습니다.");
      return;
    }
    saveToSpecificFolderMutation.mutate({
      folderName,
      estateIds: Array.from(selectedEstateIds),
    });
  };

  return (
    <aside className="sticky top-24 self-start ml-4 ">
      <div className="flex flex-col w-70 gap-2 bg-white border rounded-lg px-3 py-2 shadow-md">
        <div className="border-b pb-2 mb-2">
          <label className="flex items-center space-x-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={allItemsSelected}
              onChange={handleToolbarSelectAllChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded-sm"
            />
            <span className="text-gray-700">
              전체 선택 ({selectedCount}/{allListingsCount})
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {folders && folders.length > 0 ? (
            folders?.map((folder: string, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <span className="text-sm text-gray-800">{folder}</span>
                <button
                  onClick={() => handleFolderClickToSave(folder)}
                  className="text-xs text-blue-500 hover:underline px-2 py-1 bg-blue-100 rounded"
                >
                  선택 항목 추가
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/folder/admin/${folder}`);
                  }}
                  className="text-xs text-blue-500 hover:underline px-2 py-1 bg-blue-100 rounded"
                >
                  폴더로 이동
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">생성된 폴더가 없습니다.</p>
          )}
        </div>

        {isAddingFolder ? (
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="폴더 이름"
              className="border px-2 py-1 text-sm rounded"
            />
            <div className="flex gap-2">
              <button
                className="text-sm text-white bg-blue-500 rounded px-2 py-1 hover:bg-blue-600"
                onClick={async () => {
                  if (!newFolderName.trim()) return;
                  mutateCreateFolder(newFolderName);
                }}
              >
                생성
              </button>
              <button
                className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200"
                onClick={() => {
                  setIsAddingFolder(false);
                  setNewFolderName("");
                }}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => setIsAddingFolder(true)}
          >
            새 폴더 추가
          </button>
        )}
      </div>
    </aside>
  );
};

export default Toolbar;
