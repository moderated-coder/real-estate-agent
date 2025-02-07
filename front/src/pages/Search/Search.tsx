import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "@/assets/search.svg?react";
import CancelIcon from "@/assets/cancel.svg?react";
import { useSearchParams } from "react-router-dom";
interface FilterQuery {
  filter1: Boolean;
  filter2: Boolean;
  filter3: Boolean;
  filter4: Boolean;
  filter5: Boolean;
  filter6: Boolean;
  filter7: Boolean;
  filter8: Boolean;
  filter9: Boolean;
  filter10: Boolean;
}
const Search = () => {
  const [whitSpace, setWhitSpace] = useState<string>("normal");
  const [colors, setColors] = useState<boolean[]>(Array(10).fill(false));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isMoving = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [filterQuery, setFilterQuery] = useState<FilterQuery>({
    filter1: true,
    filter2: true,
    filter3: false,
    filter4: false,
    filter5: false,
    filter6: false,
    filter7: false,
    filter8: false,
    filter9: false,
    filter10: false,
  });
  interface RealEstateItem {
    article_price: string;
    article_short_features: string[];
    article_title: string;
    공급면적: string;
    전용면적: string;
    층: string;
    향: string;
    "방/욕실": string;
    복층여부: string;
    입주가능일: string;
  }
  interface RealEstateResponse {
    results: RealEstateItem[]; // 여기에 실제 데이터 타입을 명시하면 더 좋습니다!
    message?: string;
    error?: string;
  }
  const getRealEstateListings = async (query: string): Promise<RealEstateResponse | null> => {
    try {
      console.log(query);
      const params = new URLSearchParams({ q: query });
      console.log(decodeURIComponent(params.toString()));
      const response = await fetch(`/search/realestate?${decodeURIComponent(params.toString())}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        // HTTP 상태 코드가 200이 아닌 경우
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to fetch real estate listings");
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error fetching real estate listings:", error);
      return null;
    }
  };
  const { status, data: realEstateResults } = useQuery({
    queryKey: ["search", query],
    queryFn: () => getRealEstateListings(query!),
    enabled: !!query, // query가 존재할 때만 실행
    retry: 10,
  });
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", calTextareaHeight);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", calTextareaHeight);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (searchBarRef.current?.contains(event.target as Node)) {
      return setWhitSpace("pre-line");
    }
    return setWhitSpace("nowrap");
  };

  const calTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    isDragging.current = true;
    isMoving.current = false;
    startX.current = event.clientX;
    scrollLeft.current = tagListRef.current?.scrollLeft || 0;
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !tagListRef.current) return;
    isMoving.current = true;
    event.preventDefault();
    event.stopPropagation();
    const x = event.clientX;
    const walk = x - startX.current;
    tagListRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";

    setTimeout(() => {
      isMoving.current = false;
    }, 10);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = event.touches[0].clientX; // 터치 시작 위치
    scrollLeft.current = tagListRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !tagListRef.current) return;

    const x = event.touches[0].clientX; // 현재 터치 위치
    const walk = x - startX.current; // 이동 거리 계산
    tagListRef.current.scrollLeft = scrollLeft.current - walk; // 스크롤 이동
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const clickFilter = (index: number) => {
    if (!isMoving.current) {
      setColors((prevColor) => prevColor.map((color, i) => (i == index ? !color : color)));
      setFilterQuery((prevFilterQuery: FilterQuery) => {
        const key = `filter${index + 1}` as keyof FilterQuery;
        return {
          ...prevFilterQuery,
          [key]: !prevFilterQuery[key],
        };
      });
  };
  const renderdContent = useMemo(() => {
    if (status === "pending") {
      return <span>Loading...</span>;
    }

    if (status === "error") {
      return <span>Error</span>;
    }

    if (status === "success" && realEstateResults?.results?.length) {
      return (
        <div className="real-estate-container">
          {realEstateResults.results.map((realEstateResult, index) => (
            <div className="real-estate-card" key={index}>
              <img
                src="/image/sampleRoom.jpg" /* 실제 이미지 URL로 변경 */
                alt={realEstateResult.article_title}
                className="real-estate-thumbnail"
              />
              <div className="real-estate-content">
                <h3 className="real-estate-title">{realEstateResult.article_title}</h3>
                <p className="real-estate-price">{realEstateResult.article_price.toLocaleString()} KRW</p>
                <div className="real-estate-features">
                  {realEstateResult.article_short_features.map((feature: string) => (
                    <p key={feature}>{feature}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null; // 데이터가 없을 경우 null 반환
  }, [status, realEstateResults]); // `status`와 `realEstateResults`가 변경될 때만 재계산됨
  return (
    <>
      <div ref={searchBarRef} className="search-bar">
        <div className="icon-wrpper" style={{ paddingRight: "13px", paddingLeft: "14px" }}>
          <img src="/image/logo.svg" />
        </div>
        <form>
          <div className="textarea-wrapper">
            <textarea
              className="search-textarea"
              ref={textareaRef}
              onInput={calTextareaHeight}
              rows={1}
              placeholder="Type something here..."
              style={{ whiteSpace: whitSpace }}
            />
          </div>
          <div className="icon-wrpper">
            <span style={{ color: "rgb(94, 94, 94)" }}>
              <CancelIcon />
            </span>
          </div>
          <span className="line"></span>
          <span>
            <SearchIcon width="24" height="24" />
          </span>
        </form>
      </div>
      <div className="tag-list-scrolling">
        <div
          className="tag-list-wrapper"
          ref={tagListRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart} // 터치 시작
          onTouchMove={handleTouchMove} // 터치 이동
          onTouchEnd={handleTouchEnd} // 터치 종료
        >
          {Array.from({ length: 10 }, (_, i) => (
            <li
              key={i}
              className="tag-list"
              onClick={() => clickFilter(i)}
              style={{ backgroundColor: colors[i] ? "black" : "white", color: colors[i] ? "white" : "black" }}
            >
              필터 {i + 1}
            </li>
          ))}
        </div>
      </div>
      <div>{renderdContent}</div>
    </>
  );
};

export default Search;
