"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation, useQueryClient 추가
import { Article } from "@/src/app/(realestate)/types/realEstate";
import Image from "next/image";

interface Props {
  user: string;
  foldername: string;
}

const SavedEstateList = ({ user, foldername }: Props) => {
  const queryClient = useQueryClient();

  const {
    data: savedEstates,
    isLoading,
    isError,
  } = useQuery<Article[]>({
    queryKey: ["folderContent", user, decodeURIComponent(foldername)],
    queryFn: async ({ queryKey }) => {
      const [, user_id, folder_name] = queryKey;
      console.log(`Fetching folder: ${folder_name} for user: ${user_id}`); // 디버깅을 위해 로깅 추가
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/${user_id}/${folder_name}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch saved estates: ${res.statusText}`);
      }
      const data = await res.json();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteEstateMutation = useMutation({
    mutationFn: async ({ folderName, estateId }: { folderName: string; estateId: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/remove-estate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user, folder_name: folderName, estate_id: estateId }),
      });
      if (!res.ok) throw new Error("Failed to delete estate from folder");
      return folderName;
    },
    onSuccess: (folderName) => {
      queryClient.invalidateQueries({ queryKey: ["folderContent", user, folderName] });
    },
    onError: (error, variables) => {
      console.error(`폴더 '${variables.folderName}'에서 매물 삭제 실패:`, error);
      alert(`매물 삭제 실패: ${error.message}`);
    },
  });

  // 삭제 버튼 클릭 핸들러
  const handleDeleteEstate = (estateId: string) => {
    deleteEstateMutation.mutate({
      folderName: decodeURIComponent(foldername), // URL 디코딩된 폴더 이름 전달
      estateId: estateId,
    });
  };

  if (isLoading) return <div className="text-center p-4">폴더 내용을 불러오는 중...</div>;
  if (isError) return <div className="text-center p-4 text-red-600">폴더 내용을 불러오는데 실패했습니다.</div>;
  if (!savedEstates || savedEstates.length === 0) {
    return <div className="text-center p-4 text-gray-500">이 폴더에는 저장된 매물이 없습니다.</div>;
  }

  return (
    <div className="p-4">
      {savedEstates?.map((realEstate: Article) => (
        <div key={realEstate._id} className="flex border p-4 mb-3 rounded bg-white shadow">
          <div className="flex flex-col justify-between w-full">
            <div>
              <div className="font-semibold">{realEstate.article_title}</div>
              <div className="text-sm text-gray-600">
                보증금 {realEstate.deposit_fee} / 월세 {realEstate.rent_fee}
              </div>
              <div className="flex gap-2 text-xs mt-2">
                {realEstate.article_short_features === "None"
                  ? []
                  : realEstate.article_short_features.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">{realEstate.agent_office_post}</div>
              <div className="text-xs text-gray-500">{realEstate.dong}</div>
            </div>
            <div>
              <button
                onClick={() => handleDeleteEstate(realEstate._id)}
                disabled={deleteEstateMutation.isPending} // 삭제 중에는 버튼 비활성화
                className={`mt-4 px-3 py-1 rounded text-white text-sm ${
                  deleteEstateMutation.isPending ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {deleteEstateMutation.isPending ? "삭제 중..." : "폴더에서 삭제"}
              </button>
            </div>
          </div>
          <div className="relative w-full h-48 bg-gray-100 rounded ml-4">
            {realEstate.image_url ? (
              <Image
                src={"https://landthumb-phinf.pstatic.net" + realEstate.image_url}
                alt={realEstate.article_title}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <span className="flex items-center justify-center h-full text-sm text-gray-400 bg-gray-200 rounded">
                이미지 없음
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default SavedEstateList;
