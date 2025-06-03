"use client";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import EstateItemCard from "./_components/EstateItemCard";

export interface Article {
  _id: string;
  article_id: string;
  article_title: string;
  article_short_description: string;
  article_short_features: string[] | "None";
  article_regist_date: string;
  agent_office_post: string;
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

interface RealEstateResponse {
  total_count: number;
  real_estate_list: Article[];
  nextPage: string | null;
}

const getRealEstateDatas = async ({
  pageParam,
  queryKey,
}: {
  pageParam: string;
  queryKey: readonly [
    "search",
    {
      readonly gu: string;
      readonly dong?: string;
      readonly deposit_min: string;
      readonly deposit_max: string;
      readonly rent_min: string;
      readonly rent_max: string;
    }
  ];
}): Promise<RealEstateResponse> => {
  const [, { gu, deposit_min, deposit_max, rent_min, rent_max, dong }] = queryKey;
  const url = new URL("http://localhost:8000/get_articles");
  url.searchParams.append("gu", gu);
  if (dong) {
    url.searchParams.append("dong", dong);
  }
  url.searchParams.append("deposit_min", deposit_min);
  url.searchParams.append("deposit_max", deposit_max);
  url.searchParams.append("rent_min", rent_min);
  url.searchParams.append("rent_max", rent_max);
  url.searchParams.append("cursor", pageParam.toString());
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch real estate listings");
  return await response.json();
};

export default function RealEstate() {
  const searchParams = useSearchParams();
  const gu = searchParams.get("gu") || "";
  const dong = searchParams.get("dong") || undefined;
  const deposit_min = searchParams.get("deposit_min") || "";
  const deposit_max = searchParams.get("deposit_max") || "";
  const rent_min = searchParams.get("rent_min") || "";
  const rent_max = searchParams.get("rent_max") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
    queryKey: ["search", { gu, deposit_min, deposit_max, rent_min, rent_max, dong }] as const,
    queryFn: getRealEstateDatas,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: "1",
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const allListings = data?.pages.flatMap((page) => page.real_estate_list) ?? [];

  return (
    <>
      <div>
        {allListings.map((item) => (
          <EstateItemCard key={item._id} realEstateList={[item]} />
        ))}
        <div ref={observerRef} className="h-10"></div>
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </>
  );
}
