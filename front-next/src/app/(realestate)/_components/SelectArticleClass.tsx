import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";

interface Props {
  selectedArticleClass: string;
  setSelectedArticleClass: (action: { type: string }) => void;
}

const SelectArticleClass = ({ selectedArticleClass, setSelectedArticleClass }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const options = [
    { value: "SELECT_ALL", label: "전체" },
    { value: "SELECT_VILLA", label: "빌라" },
    { value: "SELECT_OFFICETEL", label: "오피스텔" },
    { value: "SELECT_ONE_ROOM", label: "원룸" },
  ];

  const selectedLabel = options.find((option) => option.value === selectedArticleClass)?.label;
  const handleSelect = (value: string) => {
    setSelectedArticleClass({ type: value }); // 타입을 명시적으로 지정
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" }, // 숨겨진 상태
    visible: {
      opacity: 1,
      height: "auto", // 높이를 자동으로 맞춰 부드럽게 나타나게 합니다.
      transition: {
        opacity: { duration: 0.2 }, // opacity는 좀 더 빠르게
        height: {
          duration: 0.3,
          ease: "easeOut" as Transition["ease"], // 'easeOut' 문자열을 Transition['ease'] 타입으로 명시적 캐스팅
        },
      },
    },
    exit: {
      // 사라질 때
      opacity: 0,
      height: 0,
      transition: {
        opacity: { duration: 0.2 },
        height: {
          duration: 0.3,
          ease: "easeIn" as Transition["ease"], // 'easeIn' 문자열을 Transition['ease'] 타입으로 명시적 캐스팅
        },
      },
    },
  };

  return (
    <div className="relative inline-block w-48" ref={dropdownRef}>
      <button
        type="button"
        className="
          flex justify-between items-center
          w-full
          border border-gray-300
          rounded-md
          mt-4
          px-4 py-2 pr-3
          text-sm
          shadow-md
          bg-white
          text-gray-800
          hover:border-blue-400
          focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500
          cursor-pointer
        "
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel}</span>
        <svg
          className={`fill-current h-4 w-4 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden" // 컴포넌트가 처음 마운트될 때 hidden 상태
            animate="visible" // isOpen이 true일 때 visible 상태
            exit="exit" // isOpen이 false가 되어 컴포넌트가 사라질 때 exit 상태
            variants={dropdownVariants} // 위에서 정의한 variants 사용
            className="
              absolute z-10 mt-1
              w-full
              bg-white
              border border-gray-300
              rounded-md
              shadow-lg
              focus:outline-none
              text-sm
            "
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`
                  px-4 py-2
                  cursor-pointer
                  transition-colors duration-200 ease-in-out
                  ${
                    selectedArticleClass === option.value
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
                onClick={() => {
                  handleSelect(option.value);
                }}
                role="option"
                aria-selected={selectedArticleClass === option.value}
              >
                {option.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectArticleClass;
