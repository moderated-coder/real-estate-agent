"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import EstateItemCard from "./_components/EstateItemCard";
export interface Article {
  _id: string;
  article_title: string;
  article_short_description: string;
  article_short_features: string[];
  article_regist_date: string;
  deposit_fee: number;
  rent_fee: number;
  management_fee: string;
  gu: string;
  dong: string;
  floor: string;
  exclusive_area: string;
  direction: string;
  transaction_type: string;
  image_url: string | null;
  tag_list: string[];
}

// 데이터를 불러오는 함수
const getRealEstateDatas = async ({
  pageParam,
  queryKey,
}: {
  pageParam: number;
  queryKey: string[];
}): Promise<Article[]> => {
  const [, query] = queryKey;

  const url = new URL("http://localhost:8000/get_articles_by_sort");
  url.searchParams.append("sort_key", "deposit_fee_asc");
  url.searchParams.append("page", pageParam.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch real estate listings");
  const res = await response.json();
  return res;
};

export default function RealEstate() {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query, page],
    queryFn: () => getRealEstateDatas({ pageParam: page, queryKey: ["search", query] }),
  });

  return (
    <>
      <div className="flex justify-center my-4 gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          이전
        </button>
        <span className="px-3 py-1 border rounded bg-gray-100 font-semibold">{page}</span>
        <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => p + 1)}>
          다음
        </button>
      </div>
      {data && <EstateItemCard data={data} />}
    </>
  );
}
