"use client";
import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";
const NavBar = () => {
  const [showSlider, setShowSlider] = useState(false);
  const [depositRange, setDepositRange] = useState<[number, number]>([3500, 60000]);
  const [monthlyRentRange, setMonthlyRentRange] = useState<[number, number]>([0, 100000]);
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="whitespace-nowrap text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>
          <SearchBar depositRange={depositRange} monthlyRentRange={monthlyRentRange} />
          <nav className="flex items-center gap-3 text-sm">
            <button className="px-3 py-1 w-fit whitespace-nowrap border rounded hover:bg-gray-100">월세</button>
            <button className="px-3 py-1 w-fit whitespace-nowrap border rounded hover:bg-gray-100">전세</button>

            <button
              className="px-3 py-1 w-fit whitespace-nowrap border rounded hover:bg-gray-100"
              onClick={() => setShowSlider((prev) => !prev)}
            >
              보증금 설정
            </button>
          </nav>
        </div>
      </header>

      {showSlider && (
        <div className="absolute top-[120px] left-0 w-full z-40">
          <section className="max-w-6xl mx-auto px-4 py-4 bg-white border-b shadow-md rounded-b">
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-1 font-semibold text-sm">보증금 (전세금)</div>
                <div className="text-xs text-gray-600 mb-2">
                  ₩{depositRange[0]} ~ ₩{depositRange[1]}
                </div>
                <div className="relative w-full h-2 bg-gray-300 rounded mt-4">
                  <div
                    className="absolute h-2 bg-blue-500 rounded"
                    style={{
                      left: `${(depositRange[0] / 100000) * 100}%`,
                      width: `${((depositRange[1] - depositRange[0]) / 100000) * 100}%`,
                    }}
                  ></div>

                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={500}
                    value={depositRange[0]}
                    onChange={(e) => {
                      const val = Math.min(+e.target.value, depositRange[1] - 500);
                      setDepositRange([val, depositRange[1]]);
                    }}
                    className="custom-range "
                  />
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={500}
                    value={depositRange[1]}
                    onChange={(e) => {
                      const val = Math.max(+e.target.value, depositRange[0] + 500);
                      setDepositRange([depositRange[0], val]);
                    }}
                    className="custom-range bg-transparent pointer-events-none z-10"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 font-semibold text-sm">월세</div>
                <div className="text-xs text-gray-600 mb-2">
                  ₩{monthlyRentRange[0]} ~ ₩{monthlyRentRange[1]}
                </div>
                <div className="relative w-full h-2 bg-gray-300 rounded mt-4">
                  <div
                    className="absolute h-2 bg-blue-500 rounded"
                    style={{
                      left: `${(monthlyRentRange[0] / 100000) * 100}%`,
                      width: `${((monthlyRentRange[1] - monthlyRentRange[0]) / 100000) * 100}%`,
                    }}
                  ></div>

                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={500}
                    value={monthlyRentRange[0]}
                    onChange={(e) => {
                      const val = Math.min(+e.target.value, monthlyRentRange[1] - 500);
                      setMonthlyRentRange([val, monthlyRentRange[1]]);
                    }}
                    className="custom-range "
                  />
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={500}
                    value={monthlyRentRange[1]}
                    onChange={(e) => {
                      const val = Math.max(+e.target.value, monthlyRentRange[0] + 500);
                      setMonthlyRentRange([monthlyRentRange[0], val]);
                    }}
                    className="custom-range bg-transparent pointer-events-none z-10"
                  />
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
