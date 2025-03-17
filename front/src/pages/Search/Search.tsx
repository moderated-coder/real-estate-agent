import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
// 필터 다른 디자인
//import FilterList from "@/pages/components/FilterList";

import SearchResults from "@/pages/components/SearchResults";
import SearchBar from "../components/\bSearchBar";
import FilterModal from "../components/FilterModal";
import DownArrow from "@/assets/down_arrow.svg?react";

interface Post {
  postId: number;
  article_price: string;
  article_short_features: string[];
  article_title: string;
}
interface RealEstateResponse {
  results: Post[];
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const getRealEstateDatas = async ({ pageParam }: { pageParam: number }): Promise<RealEstateResponse> => {
    try {
      const response = await fetch(`/search/realestate?q=${query}&cursor=${pageParam}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch real estate listings");

      const data: RealEstateResponse = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching real estate data:", error);
      return { results: [] };
    }
  };

  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["search", query], // 검색어 기반으로 캐싱
    queryFn: getRealEstateDatas,
    initialPageParam: 0,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.results.length < 8) return undefined;
      return lastPage.results[lastPage.results.length - 1].postId;
    },
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView && status !== "pending" && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, status]);

  return (
    <>
      <div style={{ marginTop: "40px" }}></div>
      <SearchBar />
      <div className="filter-bar" style={{ marginTop: "30px" }} onClick={() => setIsOpen(true)}>
        <span>IT 개발 전체</span>
        <DownArrow />
      </div>
      <FilterModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* 필터 다른 디자인 */}
      {/* <FilterList /> */}
      <SearchResults status={status} results={data?.pages.flatMap((page) => page.results) || []} />
      <div ref={ref} style={{ height: 100 }} />
    </>
  );
};

export default Search;
