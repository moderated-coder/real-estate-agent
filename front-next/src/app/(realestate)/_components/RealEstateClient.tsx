"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import EstateItemCard from "./EstateItemCard";
import getRealEstateDatas from "../_lib/getRealEstateDatas";

export default function RealEstateClient() {
  const searchParams = useSearchParams();

  const gu = searchParams.get("gu") ?? "";
  const dong = searchParams.get("dong") ?? undefined;
  const deposit_min = searchParams.get("deposit_min") ?? "";
  const deposit_max = searchParams.get("deposit_max") ?? "";
  const rent_min = searchParams.get("rent_min") ?? "";
  const rent_max = searchParams.get("rent_max") ?? "";

  return (
    <RealEstateData
      gu={gu}
      dong={dong}
      deposit_min={deposit_min}
      deposit_max={deposit_max}
      rent_min={rent_min}
      rent_max={rent_max}
    />
  );
}

function RealEstateData(props: {
  gu: string;
  dong?: string;
  deposit_min: string;
  deposit_max: string;
  rent_min: string;
  rent_max: string;
}) {
  const { gu, dong, deposit_min, deposit_max, rent_min, rent_max } = props;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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
    <div>
      {allListings.map((item) => (
        <EstateItemCard key={item._id} realEstateList={[item]} />
      ))}
      <div ref={observerRef} className="h-10"></div>
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
