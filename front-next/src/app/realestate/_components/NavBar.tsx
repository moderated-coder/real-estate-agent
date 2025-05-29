"use client";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [showSlider, setShowSlider] = useState(false);
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <button className="px-3 py-1 border rounded hover:bg-gray-100">월세</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-100">전세</button>

            <button
              className="px-3 py-1 border rounded hover:bg-gray-100"
              onClick={() => setShowSlider((prev) => !prev)}
            >
              보증금 설정
            </button>

            <input type="text" placeholder="지역 또는 건물 검색" className="border rounded px-2 py-1 text-sm w-40" />
          </nav>
        </div>
      </header>

      {showSlider && (
        <div className="absolute top-[70px] left-0 w-full z-40">
          <section className="max-w-6xl mx-auto px-4 py-4 bg-white border-b shadow-md rounded-b">
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-1 font-semibold text-sm">보증금 (전세금)</div>
                <div className="text-xs text-gray-600 mb-2">₩3,000,000 ~ ₩35,000,000</div>
                <div className="flex items-center gap-2">
                  <input type="range" min={0} max={50000} defaultValue={3000} step={800} className="custom-range" />
                  <input type="range" min={0} max={50000} defaultValue={35000} step={800} className="custom-range" />
                </div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-sm">월세</div>
                <div className="text-xs text-gray-600 mb-2">₩0 ~ ₩1,000,000</div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    defaultValue={0}
                    step={50}
                    className="custom-range shadow-custom"
                  />
                  <input type="range" min={0} max={1000} defaultValue={1000} step={50} className="custom-range" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
export default NavBar;
