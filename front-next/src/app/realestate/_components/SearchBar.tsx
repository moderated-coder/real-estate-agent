"use client";
import { useState, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Search from "@/src/assets/icons/search.svg";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const textareaRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  // 검색 핸들러
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    queryClient.removeQueries({ queryKey: ["search", searchQuery] });
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchQuery);
    router.replace(`?${params.toString()}`);
    setSearchQuery(() => "");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };
  return (
    <div
      className="
    flex items-center justify-between
    w-full max-w-[600px] h-[40px]
    px-4 mx-auto mb-5
    border border-[#ddd] rounded-lg
    bg-white hover:bg-[#f5f5f5]
    cursor-pointer text-sm mt-4
  "
    >
      <div className="flex justify-between flex-1">
        <input
          className="flex w-full [font-family:Arial,_Apple_SD_Gothic_Neo,_sans-serif]
          leading-[22px] text-[16px] border-b-8 border-transparent overflow-hidden
          border-none outline-none"
          ref={textareaRef}
          value={searchQuery}
          onChange={(e) => handleInput(e)}
          onKeyDown={handleKeyDown}
          placeholder="찾고 싶은 부동산 정보를 입력해주세요"
        />
        <Search onClick={handleSearch} style={{ width: "30px" }} />
      </div>
    </div>
  );
};
export default SearchBar;
