"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useReducer, useRef } from "react";
import DepositAndRentInput from "./DepositAndRentInput";
import SelectLocation from "./SelectLocation";
import { selectArticleClassReducer } from "../_lib/selectArticleClassReducer";
import SelectArticleClass from "./SelectArticleClass";

const NavBar = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [depositRange, setDepositRange] = useState<[number, number]>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const minDeposit = Number(params.get("deposit_min")) || 0;
    const maxDeposit = Number(params.get("deposit_max")) || Infinity;
    return [minDeposit, maxDeposit];
  });

  const [monthlyRentRange, setMonthlyRentRange] = useState<[number, number]>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const minRent = Number(params.get("rent_min")) || 0;
    const maxRent = Number(params.get("rent_max")) || Infinity;
    return [minRent, maxRent];
  });
  const [selectedDong, setSelectedDong] = useState<Set<string>>(() => {
    return new Set(searchParams.get("dong")?.split(",") || []);
  });
  const [selectedArticleClass, setSelectedArticleClass] = useReducer(
    selectArticleClassReducer,
    searchParams.get("article_class") ?? "SELECT_ALL"
  );
  const dongMap: { [gu: string]: string[] } = {
    영등포구: [
      "당산동",
      "당산동1가",
      "당산동2가",
      "당산동3가",
      "당산동4가",
      "당산동5가",
      "당산동6가",
      "대림동",
      "도림동",
      "문래동1가",
      "문래동2가",
      "문래동3가",
      "문래동4가",
      "문래동5가",
      "문래동6가",
      "신길동",
      "양평동",
      "양평동1가",
      "양평동2가",
      "양평동3가",
      "양평동4가",
      "양평동5가",
      "양평동6가",
      "여의도동",
      "영등포동",
      "영등포동1가",
      "영등포동2가",
      "영등포동3가",
      "영등포동4가",
      "영등포동5가",
      "영등포동6가",
      "영등포동7가",
      "영등포동8가",
    ],
  };

  const stateToParams = ({
    selectedDong,
    depositRange,
    monthlyRentRange,
    selectedArticleClass,
  }: {
    selectedDong: Set<string>;
    depositRange: [number, number];
    monthlyRentRange: [number, number];
    selectedArticleClass: string;
  }) => {
    const params = new URLSearchParams();
    if (selectedDong.size > 0) {
      params.set("gu", "영등포구");
      params.set("dong", [...selectedDong].join(","));
    }
    params.set("deposit_min", depositRange[0].toString());
    if (depositRange[1] !== Infinity) {
      params.set("deposit_max", depositRange[1].toString());
    }
    params.set("rent_min", monthlyRentRange[0].toString());
    if (monthlyRentRange[1] !== Infinity) {
      params.set("rent_max", monthlyRentRange[1].toString());
    }
    params.set("article_class", selectedArticleClass);
    return params;
  };

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (!hasInitialized) return;
    const params = stateToParams({ selectedDong, depositRange, monthlyRentRange, selectedArticleClass });
    router.replace(`/?${params.toString()}`);
  }, [selectedDong, depositRange, monthlyRentRange, selectedArticleClass, hasInitialized]);
  const resetState = () => {
    setSelectedDong(new Set());
    setDepositRange([0, Infinity]);
    setMonthlyRentRange([0, Infinity]);
    setSelectedArticleClass({ type: "SELECT_ALL" });
  };
  return (
    <div ref={navRef}>
      <header className="min-w-[555px] w-full bg-white shadow-sm border-b">
        <div className="mx-auto px-4 py-1 flex items-center justify-between gap-4">
          <Link href="/" onClick={resetState} className="whitespace-nowrap text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>
        </div>
        <div className="flex justify-start px-4 py-2 flex gap-6">
          <SelectLocation selectedDong={selectedDong} setSelectedDong={setSelectedDong} dongMap={dongMap} />
          <SelectArticleClass
            selectedArticleClass={selectedArticleClass}
            setSelectedArticleClass={setSelectedArticleClass}
          />
          <DepositAndRentInput
            depositRange={depositRange}
            setDepositRange={setDepositRange}
            monthlyRentRange={monthlyRentRange}
            setMonthlyRentRange={setMonthlyRentRange}
          />
        </div>
      </header>
    </div>
  );
};
export default NavBar;
