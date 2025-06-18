"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation, useQueryClient 추가
import { Article } from "@/src/app/(realestate)/types/realEstate";
import Image from "next/image";
import * as XLSX from "xlsx";
import { formatMoney } from "@/src/app/(realestate)/_lib/formatMoney";
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

  const handleExportToCSV = () => {
    if (!savedEstates || savedEstates.length === 0) return;
    const dataToExport = savedEstates.map(
      ({
        article_title,
        deposit_fee,
        rent_fee,
        agent_office_post,
        agent_office,
        agent_hp,
        dong,
        gu,
        article_class,
        article_short_description,
        floor,
        direction,
        exclusive_area,
        management_fee,
        possible_move,
        article_regist_date,
      }) => ({
        매물분류: article_title,
        보증금: deposit_fee,
        월세: rent_fee,
        관리비: management_fee,
        중개사무소: agent_office,
        중개사주소: agent_office_post,
        중개사전화: agent_hp?.replace(/\[|\]|'/g, ""),
        구: gu,
        동: dong,
        매물종류: article_class,
        요약설명: article_short_description,
        층: floor,
        방향: direction,
        전용면적: `${exclusive_area}㎡`,
        입주가능일: possible_move,
        등록일: article_regist_date,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "saved_estates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="text-center p-4">폴더 내용을 불러오는 중...</div>;
  if (isError) return <div className="text-center p-4 text-red-600">폴더 내용을 불러오는데 실패했습니다.</div>;
  if (!savedEstates || savedEstates.length === 0) {
    return <div className="text-center p-4 text-gray-500">이 폴더에는 저장된 매물이 없습니다.</div>;
  }

  return (
    <>
      <div className="p-4">
        {savedEstates?.map((realEstate: Article) => (
          <div key={realEstate._id} className="flex border p-4 mb-3 rounded bg-white shadow">
            <div className="flex flex-col justify-between w-full">
              <div>
                <div className="font-semibold">{realEstate.article_title}</div>
                <div className="text-sm text-gray-600">
                  보증금 {formatMoney(realEstate.deposit_fee)} / 월세 {formatMoney(realEstate.rent_fee)}
                </div>
                {/* <div className="flex gap-2 text-xs mt-2">
                {realEstate.article_short_features === "None"
                  ? []
                  : realEstate.article_short_features.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
              </div> */}
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
      <div className="border-t pt-4 flex justify-between items-center">
        <p className="text-sm">
          선택한 매물 <strong>{savedEstates.length}개</strong>
        </p>
        <button onClick={handleExportToCSV} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          CSV로 내보내기
        </button>
      </div>
    </>
  );
};
export default SavedEstateList;
