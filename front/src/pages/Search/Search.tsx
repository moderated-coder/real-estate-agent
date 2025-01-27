import { useState, useEffect, useRef } from "react";

import SearchIcon from "@/assets/search.svg?react";
import CancelIcon from "@/assets/cancel.svg?react";

const Search = () => {
  const [whitSpace, setWhitSpace] = useState<string>("normal");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
    startX.current = event.clientX;
    scrollLeft.current = tagListRef.current?.scrollLeft || 0;
    document.body.style.cursor = "grabbing";
    console.log("down", scrollLeft);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !tagListRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const x = event.clientX;
    const walk = x - startX.current;
    tagListRef.current.scrollLeft = scrollLeft.current - walk;
    console.log("move", tagListRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
    console.log("up", scrollLeft);
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
            <li key={i} className="tag-list">
              필터 {i + 1}
            </li>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
