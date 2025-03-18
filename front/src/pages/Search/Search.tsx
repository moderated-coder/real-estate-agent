import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

import SearchResults from "@/pages/components/SearchResults";
import SearchBar from "../components/SearchBar";
import FilterModal from "../components/FilterModal";
import DownArrow from "@/assets/down_arrow.svg?react";
import { VirtuosoGrid } from "react-virtuoso";
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

  // 데이터를 불러오는 함수
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

  // React Query의 무한 스크롤 쿼리 사용
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

  // Virtuoso의 `endReached` 콜백을 활용해 추가 데이터 로드
  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  // 데이터를 평탄화하여 리스트 형태로 변환
  const results = data?.pages.flatMap((page) => page.results) || [];

  return (
    <>
      <div style={{ minHeight: "100vh", height: "auto" }}>
        <SearchBar />
        <div className="filter-bar" style={{ marginTop: "30px" }} onClick={() => setIsOpen(true)}>
          <span>IT 개발 전체</span>
          <DownArrow />
        </div>
        <FilterModal isOpen={isOpen} setIsOpen={setIsOpen} />

        <VirtuosoGrid
          data={results}
          useWindowScroll
          endReached={loadMore}
          listClassName="grid-container"
          itemContent={(index, post) => (
            <div className="grid-item">
              <SearchResults key={post.postId} status={status} results={post} />
            </div>
          )}
        />
      </div>

      <style>
        {`
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
            padding: 16px;
          }
          .grid-item {
            width: 100%;
          }
        `}
      </style>
    </>
  );
};

export default Search;
