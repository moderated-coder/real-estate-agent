import SearchIcon from "@/assets/search.svg?react";
import React, { useRef } from "react";
const Home = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    if (textareaRef.current) {
      // 높이 초기화 (스크롤 높이를 정확히 계산하기 위해)
      textareaRef.current.style.height = "auto";
      // 스크롤 높이에 맞게 textarea 높이 설정
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
            <textarea
              className="search-textarea"
              ref={textareaRef}
              onInput={handleInput}
              rows={1} // 최소 높이를 1줄로 설정
              placeholder="Type something here..."
              style={{ paddingTop: "11px" }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
