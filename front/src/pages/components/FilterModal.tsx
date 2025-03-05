import { useState, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

const realEstateCategories = [
  {
    id: "oneRoom",
    name: "원룸",
    subCategories: ["보증금 300~500만원", "보증금 500~1000만원", "보증금 1000~2000만원", "보증금 2000만원 이상"],
  },
  {
    id: "monthlyRent",
    name: "월세 가격대",
    subCategories: ["월세 35만원 이하", "월세 35~45만원", "월세 45~50만원", "월세 50만원 이상"],
  },
  {
    id: "maintenanceFee",
    name: "관리비",
    subCategories: ["관리비 8만원 이하", "관리비 8~10만원", "관리비 10만원 이상"],
  },
  {
    id: "location",
    name: "지역",
    subCategories: ["관악구", "금천구", "구로구", "동작구", "영등포구"],
  },
  {
    id: "orientation",
    name: "방향",
    subCategories: ["남서향", "남동향", "북향", "동향", "서향"],
  },
  {
    id: "moveIn",
    name: "입주 가능 여부",
    subCategories: ["즉시 입주 가능", "협의 후 입주"],
  },
  {
    id: "special",
    name: "특징",
    subCategories: ["화장실 한 개", "융자금 적은", "소형 평수", "세대 분리"],
  },
];
interface filterTagType {
  id: string;
  subcategory: string;
}
interface props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const FilterModal = ({ isOpen, setIsOpen }: props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>("");
  const [filterTag, setFilterTag] = useState<filterTagType[]>([]);
  // 필터 리스트 클릭 핸들러 (직군 선택 시 변경)
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryName(categoryName);
  };
  const renderCategory = () => {
    if (selectedCategory === null) {
      return (
        <ul key="main-list" className="filter-list">
          {realEstateCategories.map((category) => (
            <li
              key={category.id}
              className="filter-item"
              onClick={() => handleCategoryClick(category.id, category.name)}
            >
              <button className="filter-button">{category.name}</button>
              <span className="arrow">{">"}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul key="sub-list" className="sub-filter-list">
          {realEstateCategories
            .find((category) => category.id === selectedCategory)
            ?.subCategories.map((subItem, index) => (
              <li
                key={index}
                className="sub-filter-item"
                onClick={() => {
                  if (selectedCategoryName === null) return;

                  if (
                    !filterTag.some((filter) => filter.id === selectedCategoryName && filter.subcategory === subItem)
                  ) {
                    // 추가
                    setFilterTag((prev) => [...prev, { id: selectedCategoryName, subcategory: subItem }]);
                  } else {
                    // 제거
                    setFilterTag((prev) =>
                      prev.filter((filter) => filter.id !== selectedCategoryName || filter.subcategory !== subItem)
                    );
                  }
                }}
              >
                <input
                  type="checkbox"
                  id={subItem}
                  checked={filterTag.some(
                    (filter) => filter.id === selectedCategoryName && filter.subcategory === subItem
                  )}
                />
                <label htmlFor={subItem}>{subItem}</label>
              </li>
            ))}
        </ul>
      );
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            console.log("hi");
            setIsOpen(false);
          }}
        >
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
                <span
                  className="arrow"
                  style={{ marginRight: "30px" }}
                  onClick={() => {
                    setSelectedCategoryName(null);
                    setSelectedCategory(null);
                  }}
                >
                  {"<"}
                </span>
              )}
              <h2>{selectedCategoryName ? selectedCategoryName : "부동산 선택"}</h2>
            </div>

            {renderCategory()}
            {/* 필터링 정리 */}
            <div className="active-filters">
              {filterTag.map((tag) => {
                return (
                  <div className="active-filter-tag">
                    <span>
                      {tag.id}.{tag.subcategory}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* 하단 버튼 */}
            <div className="modal-footer">
              <button
                className="reset-btn"
                onClick={() => {
                  setSelectedCategoryName(null);
                  setSelectedCategory(null);
                }}
              >
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
  );
};
export default FilterModal;
