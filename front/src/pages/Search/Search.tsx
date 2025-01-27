import { useState, useEffect, useRef } from "react";

import SearchIcon from "@/assets/search.svg?react";
import CancelIcon from "@/assets/cancel.svg?react";
const Search = () => {
  const [whitSpace, setWhitSpace] = useState<string>("normal");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
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
      // 높이 초기화 (스크롤 높이를 정확히 계산하기 위해)
      textareaRef.current.style.height = "auto";
      // 스크롤 높이에 맞게 textarea 높이 설정
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
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
              rows={1} // 최소 높이를 1줄로 설정
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
        <div className="tag-list">
          <ul className="">
            <li>위치</li>
            <li>종류</li>
            <li>종류</li>
            <li>종류</li>
            <li>종류</li>
            <li>종류</li>
            <li>종류</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Search;
