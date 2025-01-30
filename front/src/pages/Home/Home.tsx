import SearchIcon from "@/assets/search.svg?react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    console.log(`🔍 검색어: ${searchQuery}`);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
