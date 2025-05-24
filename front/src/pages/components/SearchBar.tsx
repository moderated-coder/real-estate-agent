import { useState, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Search from "@/assets/search.svg?react";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const textareaRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [_, setSearchParams] = useSearchParams();

  // 검색 핸들러
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setSearchQuery(textareaRef.current.value);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    queryClient.removeQueries({ queryKey: ["search", searchQuery] });
    setSearchParams({ q: searchQuery });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };
  return (
    <div className="filter-bar home-bar">
      <div className="textarea-wrapper">
        <input
          className="search-textarea"
          ref={textareaRef}
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="찾고 싶은 부동산 정보를 입력해주세요"
        />
        <Search style={{ width: "30px" }} onClick={handleSearch} />
      </div>
    </div>
  );
};
export default SearchBar;
