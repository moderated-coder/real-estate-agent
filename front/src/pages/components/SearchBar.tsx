import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const textareaRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
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
    navigate(`/search?q=${searchQuery}`);
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
        <form>
          <input
            className="search-textarea"
            ref={textareaRef}
            value={searchQuery}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="찾고 싶은 부동산 정보를 입력해주세요"
          />
        </form>
      </div>
    </div>
  );
};
export default SearchBar;
