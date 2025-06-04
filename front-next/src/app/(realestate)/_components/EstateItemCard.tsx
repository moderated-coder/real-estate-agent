"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Article } from "@/src/app/(realestate)/types/realEstate";
export default function EstateItemCard({ realEstateList }: { realEstateList: Article[] }) {
  const queryClient = useQueryClient();

  const saveEstate = async (_id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save/estate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estateId: _id }),
    });
    if (!res.ok) throw new Error("저장 실패");
    return res.json();
  };

  const { mutate } = useMutation({
    mutationFn: saveEstate,
    onSuccess: () => {
      alert("리스트에 추가되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["savedRealEstates"] });
    },
    onError: (error) => {
      console.error("저장 실패", error);
      alert("저장 실패");
    },
  });

  const saveRealEstateItem = (_id: string) => {
    mutate(_id);
  };
  return (
    <div>
      {realEstateList?.map((item) => (
        <div key={item._id} className="flex border p-4 mb-3 rounded bg-white shadow">
          <div className="flex flex-col justify-between w-600 ">
            <div>
              <div className="font-semibold">{item.article_title}</div>
              <div className="text-sm text-gray-600">
                보증금 {item.deposit_fee} / 월세 {item.rent_fee}
              </div>
              <div className="flex gap-2 text-xs mt-2">
                {item.article_short_features === "None"
                  ? [].map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))
                  : item.article_short_features.map((tag) => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">{item.agent_office_post}</div>
            </div>
            <div>
              <button
                className="bg-blue-600 text-sm text-white px-2 py-1 rounded cursor-pointer"
                onClick={() => saveRealEstateItem(item._id)}
              >
                리스트에 추가
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-48 overflow-hidden bg-gray-100 rounded">
            {item.image_url ? (
              <Image
                src={"https://landthumb-phinf.pstatic.net" + item.image_url}
                alt={item.article_title}
                width={200}
                height={150}
                className="object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">이미지 없음</span> // 또는 그냥 빈 태그로 둬도 됨
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
