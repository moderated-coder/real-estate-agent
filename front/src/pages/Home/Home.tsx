import SearchIcon from "@/assets/search.svg?react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
let url = "/search?q=house&category=apartment&k=ca";
const Home = () => {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  const navigate = useNavigate();
  const handleInput = () => {
    if (textareaRef.current) {
      // 높이 초기화 (스크롤 높이를 정확히 계산하기 위해)
      textareaRef.current.style.height = "auto";
      // 스크롤 높이에 맞게 textarea 높이 설정
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setSearchQuery(textareaRef.current.value);
    }
  };
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    Object.entries(filterQuery).forEach(([key, value]) => {
      if (value) {
        params.set(key, "true"); // 필터가 true인 경우만 추가
      }
    });
    console.log(params.toString());
    navigate(`/search?${params.toString()}`);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // 엔터 입력 방지
      handleSearch();
    }
  };
  return (
    <>
      <div className="main-section">
        <img
          alt="Google"
          height="92"
          src="./image/googlelog.png"
          width="272"
          data-csiid="gRqXZ_SmJaqz0-kPy-q-wQs_1"
          data-atf="1"
          style={{ margin: "100px", marginBottom: "50px" }}
        />
        <div className="search-bar home-bar">
          <div className="icon-warpper">
            <span style={{ color: "#9AA0A6" }}>
              <SearchIcon />
            </span>
          </div>

          <div className="textarea-wrapper">
            <form>
              <textarea
                className="search-textarea"
                ref={textareaRef}
                value={searchQuery}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1} // 최소 높이를 1줄로 설정
                placeholder="Type something here..."
                style={{ paddingTop: "11px" }}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
