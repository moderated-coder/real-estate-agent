import Image from "next/image";
import { Article } from "../page";
export default function EstateItemCard({ data }: { data: Article[] }) {
  return (
    <div>
      {data?.map((item) => (
        <div key={item._id} className="flex border p-4 mb-3 rounded bg-white shadow">
          <div className="w-600 ">
            <div className="font-semibold">{item.article_title}</div>
            <div className="text-sm text-gray-600">
              보증금 {item.deposit_fee} / 월세 {item.rent_fee}
            </div>
            <div className="flex gap-2 text-xs mt-2">
              {item.article_short_features.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
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
