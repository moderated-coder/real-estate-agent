import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@/assets/search.svg?react";
import DownArrow from "@/assets/down_arrow.svg?react";

const jobCategories = [
  {
    id: "it",
    name: "IT 개발 전체",
    subCategories: [
      "백엔드 개발자",
      "프론트엔드 개발자",
      "크로스플랫폼 앱 개발자",
      "iOS 개발자",
      "안드로이드 개발자",
      "DevOps / SRE",
      "QA·테스트 엔지니어",
      "시스템·네트워크 관리자",
      "개발 매니저",
    ],
  },
  {
    id: "it",
    name: "IT 개발 전체",
    subCategories: [
      "백엔드 개발자",
      "프론트엔드 개발자",
      "크로스플랫폼 앱 개발자",
      "iOS 개발자",
      "안드로이드 개발자",
      "DevOps / SRE",
      "QA·테스트 엔지니어",
      "시스템·네트워크 관리자",
      "개발 매니저",
    ],
  },
  {
    id: "it",
    name: "IT 개발 전체",
    subCategories: [
      "백엔드 개발자",
      "프론트엔드 개발자",
      "크로스플랫폼 앱 개발자",
      "iOS 개발자",
      "안드로이드 개발자",
      "DevOps / SRE",
      "QA·테스트 엔지니어",
      "시스템·네트워크 관리자",
      "개발 매니저",
    ],
  },
  {
    id: "it",
    name: "IT 개발 전체",
    subCategories: [
      "백엔드 개발자",
      "프론트엔드 개발자",
      "크로스플랫폼 앱 개발자",
      "iOS 개발자",
      "안드로이드 개발자",
      "DevOps / SRE",
      "QA·테스트 엔지니어",
      "시스템·네트워크 관리자",
      "개발 매니저",
    ],
  },
  {
    id: "marketing",
    name: "마케팅·광고·홍보",
    subCategories: ["디지털 마케팅", "브랜드 마케팅", "PR·홍보"],
  },
  {
    id: "design",
    name: "디자인",
    subCategories: ["UX/UI 디자이너", "그래픽 디자이너", "영상 편집자"],
  },
];

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };

  // 필터 리스트 클릭 핸들러 (직군 선택 시 변경)
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  const renderCategory = () => {
    if (selectedCategory === null) {
      return (
        <ul key="main-list" className="filter-list">
          {jobCategories.map((category) => (
            <li key={category.id} className="filter-item">
              <button className="filter-button" onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </button>
              <span className="arrow">{">"}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul key="sub-list" className="sub-filter-list">
          {jobCategories
            .find((category) => category.id === selectedCategory)
            ?.subCategories.map((subItem, index) => (
              <li key={index} className="sub-filter-item">
                <input type="checkbox" id={subItem} />
                <label htmlFor={subItem}>{subItem}</label>
              </li>
            ))}
        </ul>
      );
    }
  };

  return (
    <>
      <div className="main-section">
        <img alt="Google" height="92" src="./image/googlelog.png" width="272" className="google-logo" />

        <div className="filter-bar" onClick={() => setIsOpen(true)}>
          <span>IT 개발 전체</span>
          <DownArrow />
        </div>

        <div className="search-bar home-bar">
          <div className="icon-wrapper">
            <span className="icon">
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
                rows={1}
                placeholder="Type something here..."
              />
            </form>
          </div>
        </div>

        {/* 모달 */}
        <AnimatePresence>
          {isOpen && (
            <div className="modal-overlay" onClick={() => setIsOpen(false)}>
              <motion.div
                className="modal"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
              >
                {/* 모달 헤더 */}
                <div className="modal-header">
                  {selectedCategory && (
                    <span className="arrow" style={{ marginRight: "30px" }} onClick={() => setSelectedCategory(null)}>
                      {"<"}
                    </span>
                  )}
                  <h2>직군 선택</h2>
                </div>

                <AnimatePresence mode="wait">{renderCategory()}</AnimatePresence>

                {/* 하단 버튼 */}
                <div className="modal-footer">
                  <button className="reset-btn" onClick={() => setSelectedCategory(null)}>
                    <span className="no-autolink">초기화</span>
                  </button>
                  <button className="apply-btn" onClick={() => setIsOpen(false)}>
                    <span>적용</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;
