"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useRef } from "react";
import EstateItemCard from "./EstateItemCard";
import getRealEstateDatas from "../_lib/getRealEstateDatas";

export default function RealEstateClient({
  gu,
  dong,
  deposit_min,
  deposit_max,
  rent_min,
  rent_max,
}: {
  gu?: string | string[];
  dong?: string[];
  deposit_min?: string | string[];
  deposit_max?: string | string[];
  rent_min?: string | string[];
  rent_max?: string | string[];
}) {
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
  gu?: string | string[];
  dong?: string[];
  deposit_min?: string | string[];
  deposit_max?: string | string[];
  rent_min?: string | string[];
  rent_max?: string | string[];
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
        <Suspense key={item._id} fallback={<p>Loading...</p>}>
          <EstateItemCard key={item._id} realEstate={item} />
        </Suspense>
      ))}
      <div ref={observerRef} className="h-10"></div>
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
