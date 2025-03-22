import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import SearchResults from "@/pages/components/SearchResults";
import SearchBar from "../components/SearchBar";
import FilterModal from "../components/FilterModal";
import DownArrow from "@/assets/down_arrow.svg?react";
import { VirtuosoGrid } from "react-virtuoso";
import useFilterTagsStore from "@/store/useFilterTag";
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

  const { filterTags } = useFilterTagsStore();
  // 데이터를 불러오는 함수
  const getRealEstateDatas = async ({ pageParam }: { pageParam: number }): Promise<RealEstateResponse> => {
    try {
      const params = new URLSearchParams();
      params.set("q", query);
      filterTags.forEach((tag) => {
        params.append(tag.categoryName, tag.subcategoryName);
      });

      const response = await fetch(`/search/realestate?${params.toString()}&cursor=${pageParam}`, {
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
          <span>부동산 검색 조건</span>
          <DownArrow />
        </div>
        <FilterModal isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="grid-wrapper">
          <VirtuosoGrid
            data={results}
            useWindowScroll
            endReached={loadMore}
            listClassName="grid-container"
            itemContent={(index, post) => (
              <div key={index} className="grid-item">
                <SearchResults key={post.postId} status={status} post={post} />
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
