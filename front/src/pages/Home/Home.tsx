import { useState } from "react";

import SearchBar from "../components/\bSearchBar";
import DownArrow from "@/assets/down_arrow.svg?react";
import FilterModal from "../components/FilterModal";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="main-section">
        <div style={{ marginTop: "30px" }}>
          <img alt="Google" height="92" src="./image/googlelog.png" width="272" className="google-logo" />
        </div>

        <div className="filter-bar" style={{ marginTop: "30px" }} onClick={() => setIsOpen(true)}>
          <span>IT 개발 전체</span>
          <DownArrow />
        </div>

        <SearchBar />

        <FilterModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </>
  );
};

export default Home;
