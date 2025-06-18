"use client";
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import EstateItemCard from "./EstateItemCard";
import getRealEstateDatas from "../_lib/getRealEstateDatas";
import LoadingSpinner from "@/src/app/_components/LoadingSpinner";
import { Article } from "@/src/app/(realestate)/types/realEstate";
import Toolbar from "../_components/Toolbar";

export default function RealEstateClient({
  gu,
  dong,
  deposit_min,
  deposit_max,
  rent_min,
  rent_max,
}: {
  gu?: string;
  dong?: string;
  deposit_min?: string;
  deposit_max?: string;
  rent_min?: string;
  rent_max?: string;
}) {
  const [selectedEstateIds, setSelectedEstateIds] = useState<Set<string>>(new Set());

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["search", { gu, deposit_min, deposit_max, rent_min, rent_max, dong }] as const,
    queryFn: ({ pageParam = "1", queryKey }) => {
      const [, filters] = queryKey;
      return getRealEstateDatas({ pageParam, filters });
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: "1",
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });
  const allListings = data?.pages.flatMap((page) => page.real_estate_list) ?? [];
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const handleSelectEstate = (id: string, isChecked: boolean) => {
    setSelectedEstateIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (isChecked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  };

  const handleSelectAllFromToolbar = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = new Set(allListings.map((estate) => estate._id));
      setSelectedEstateIds(allIds);
    } else {
      setSelectedEstateIds(new Set());
    }
  };

  const allItemsSelected = allListings.length > 0 && selectedEstateIds.size === allListings.length;

  return (
    <div className="flex justify-between px-4 pt-4 pb-10">
      <div className="relative w-full p-4">
        {isFetching && !isFetchingNextPage && <LoadingSpinner />}
        {allListings.length === 0 ? (
          <p className="text-gray-600 text-sm mb-4">원하는 동을 눌러서 검색하세요</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">부동산 목록</h1>

            <p className="text-gray-600 text-sm mb-4">
              체크박스를 선택하여 내 리스트에 담을 매물을 한 번에 저장하세요.
            </p>

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              {allListings.map((item: Article) => (
                <EstateItemCard
                  key={item._id}
                  realEstate={item}
                  isSelected={selectedEstateIds.has(item._id)}
                  onSelect={handleSelectEstate}
                />
              ))}
            </div>
            <div ref={observerRef} className="h-10"></div>
          </>
        )}
      </div>
      <Toolbar
        selectedCount={selectedEstateIds.size}
        allListingsCount={allListings.length}
        onSelectAll={handleSelectAllFromToolbar}
        allItemsSelected={allItemsSelected}
        selectedEstateIds={selectedEstateIds}
        onClearSelection={() => setSelectedEstateIds(new Set())}
      />
    </div>
  );
}
