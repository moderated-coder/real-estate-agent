"use client";
import { useState, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Search from "@/src/assets/icons/search.svg";
interface props {
  depositRange: [number, number];
  monthlyRentRange: [number, number];
}
const SearchBar = ({ depositRange, monthlyRentRange }: props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  // 검색 핸들러
  const handleInput = () => {
    setSearchQuery(searchRef.current?.value || "");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력해주세요!");
      return;
    }
    queryClient.removeQueries({
      queryKey: ["search", searchQuery, depositRange[0], depositRange[1], monthlyRentRange[0], monthlyRentRange[1]],
    });
    const params = new URLSearchParams(searchParams.toString());
    console.log("searchQuery", searchQuery);
    params.set("q", searchQuery);
    params.set("deposit_min", depositRange[0].toString());
    params.set("deposit_max", depositRange[1].toString());
    params.set("rent_min", monthlyRentRange[0].toString());
    params.set("rent_max", monthlyRentRange[1].toString());
    router.replace(`?${params.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
      setSearchQuery(() => "");
    }
  };
  return (
    <div
      className="
    flex items-center justify-between
    w-full  h-[40px]
    px-4 mx-auto mb-5
    border border-[#ddd] rounded-lg
    bg-white hover:bg-[#f5f5f5]
    cursor-pointer text-sm mt-4
  "
    >
      <div className="flex justify-between flex-1">
        <input
          className="flex w-full text-[16px] border-b-8 border-transparent overflow-hidden
          border-none outline-none"
          ref={searchRef}
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
