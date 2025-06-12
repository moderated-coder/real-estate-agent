"use client";
import { Article } from "@/src/app/(realestate)/types/realEstate";
import Image from "next/image";

interface EstateItemCardProps {
  realEstate: Article;
  isSelected: boolean;
  onSelect: (id: string, isChecked: boolean) => void;
}

export default function EstateItemCard({ realEstate, isSelected, onSelect }: EstateItemCardProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(realEstate._id, e.target.checked);
  };

  return (
    <div>
      <div
        key={realEstate._id}
        className={`flex border p-4 mb-3 rounded shadow ${isSelected ? "bg-blue-50 border-blue-300" : "bg-white"}`}
      >
        <div className="flex items-start mr-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded-sm cursor-pointer" // cursor-pointer 추가
          />
          {isSelected && (
            <span className="ml-2 mt-0.5 text-blue-600 text-xs font-medium whitespace-nowrap">저장 대기</span>
          )}
        </div>

        <div className="flex flex-col justify-between w-full">
          <div>
            <div className="font-semibold">{realEstate.article_title}</div>
            <div className="text-sm text-gray-600">
              보증금 {realEstate.deposit_fee} / 월세 {realEstate.rent_fee}
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
        </div>
        <div className="relative w-full h-48 bg-gray-100 rounded ml-4">
          {realEstate.image_url ? (
            <Image
              src={"https://landthumb-phinf.pstatic.net" + realEstate.image_url}
              alt={realEstate.article_title}
              fill
              style={{ objectFit: "contain" }} // 이미지가 잘리지 않고 비율 유지하며 모두 보이도록
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
    </div>
  );
}
