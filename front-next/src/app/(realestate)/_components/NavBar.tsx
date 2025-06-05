"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import SearchBar from "./SearchBar";
import FeeSlider from "./FeeSlider";
import SearchLocation from "./SearchLocation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const NavBar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [showSearchLocation, setShowSearchLocation] = useState(true);
  const [depositRange, setDepositRange] = useState<[number, number]>([0, 100000000]);
  const [monthlyRentRange, setMonthlyRentRange] = useState<[number, number]>([0, 500]);
  const [step, setStep] = useState<"city" | "gu" | "dong">("city");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedGu, setSelectedGu] = useState<string | null>(null);
  const [selectedDong, setSelectedDong] = useState<Set<string>>(new Set());
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const router = useRouter();
  const getFolderList = async ({ queryKey }: { queryKey: ["folders", string] }) => {
    const [, userId] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/list?user_id=${userId}`, {});
    if (!res.ok) throw new Error("Failed to fetch folders");
    return res.json();
  };
  const { data: folders } = useQuery({
    queryKey: ["folders", "admin"],
    queryFn: getFolderList,
  });
  const guMap: { [city: string]: string[] } = {
    서울시: ["영등포구"],
  };
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const depositMin = params.get("deposit_min");
    const depositMax = params.get("deposit_max");
    const rentMin = params.get("rent_min");
    const rentMax = params.get("rent_max");

    if (depositMin && depositMax) {
      setDepositRange([Number(depositMin), Number(depositMax)]);
    }
    if (rentMin && rentMax) {
      setMonthlyRentRange([Number(rentMin), Number(rentMax)]);
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowSearchFilter(false);
        setShowFolderSelect(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const searchRealEstate = () => {
    const params = new URLSearchParams();
    params.set("deposit_min", depositRange[0].toString());
    params.set("deposit_max", depositRange[1].toString());
    params.set("rent_min", monthlyRentRange[0].toString());
    params.set("rent_max", monthlyRentRange[1].toString());
    if (selectedGu) {
      params.set("gu", selectedGu);
    }
    if (selectedDong.size > 0) {
      params.set("dong", Array.from(selectedDong).join(","));
    }
    router.replace(`/?${params.toString()}`);
  };

  const queryClient = useQueryClient();

  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "admin", folder_name: folderName }),
      });
      if (!res.ok) throw new Error("Failed to create folder");
      return folderName;
    },
    onMutate: async (newFolderName) => {
      await queryClient.cancelQueries({ queryKey: ["folders", "admin"] });
      const previousFolders = queryClient.getQueryData<string[]>(["folders", "admin"]) ?? [];
      queryClient.setQueryData(["folders", "admin"], (old: string[] = []) => [...old, newFolderName]);
      return { previousFolders };
    },
    onError: (_err, _newFolderName, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(["folders", "admin"], context.previousFolders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", "admin"] });
    },
  });

  return (
    <div ref={navRef}>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="whitespace-nowrap text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchBar depositRange={depositRange} monthlyRentRange={monthlyRentRange} />
          </Suspense>
          <nav className="relative flex items-center gap-3 text-sm">
            <button
              className={`px-3 py-1 border w-20 rounded cursor-pointer ${
                showSearchFilter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              } transition`}
              onClick={() => {
                setShowFolderSelect(false);
                setShowSearchFilter((prev) => !prev);
              }}
            >
              검색 조건
            </button>
            {showSearchFilter && (
              <div className="absolute right-0 top-[50px] flex flex-col items-center gap-2 bg-white border rounded-lg px-3 py-1">
                <div className="flex gap-3 py-2 w-full justify-center  bg-white rounded-t-md">
                  <button
                    className={`px-4 py-2 text-sm w-full font-medium border border-gray-300 rounded-md transition cursor-pointer ${
                      showSearchLocation ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSearchLocation(true);
                      setShowSlider(false);
                    }}
                  >
                    지역 찾기
                  </button>
                  <button
                    className={`px-4 py-2 text-sm w-full font-medium border border-gray-300 rounded-md transition cursor-pointer ${
                      showSlider ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSlider(true);
                      setShowSearchLocation(false);
                    }}
                  >
                    보증금 설정
                  </button>
                </div>

                {showSlider && (
                  <FeeSlider
                    depositRange={depositRange}
                    setDepositRange={setDepositRange}
                    monthlyRentRange={monthlyRentRange}
                    setMonthlyRentRange={setMonthlyRentRange}
                  />
                )}
                {showSearchLocation && (
                  <SearchLocation
                    step={step}
                    setStep={setStep}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    selectedGu={selectedGu}
                    setSelectedGu={setSelectedGu}
                    selectedDong={selectedDong}
                    setSelectedDong={setSelectedDong}
                    guMap={guMap}
                    dongMap={dongMap}
                    searchRealEstate={searchRealEstate}
                    setShowFilter={setShowSearchFilter}
                  />
                )}
              </div>
            )}
            <button
              className={`px-3 py-1 border w-20 rounded cursor-pointer ${
                showFolderSelect ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              } transition`}
              onClick={() => {
                setShowSearchFilter(false);
                setShowFolderSelect((prev) => !prev);
              }}
            >
              폴더 선택
            </button>
            {showFolderSelect && (
              <div className="absolute right-0 top-[50px] w-48 flex flex-col gap-2 bg-white border rounded-lg px-3 py-2 shadow-md">
                {folders &&
                  folders?.folders.map((folder: string, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-800">{folder}</span>
                      <button className="text-xs text-red-500 hover:underline">삭제</button>
                    </div>
                  ))}
                {isAddingFolder ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="폴더 이름"
                      className="border px-2 py-1 text-sm rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-white bg-blue-500 rounded px-2 py-1 hover:bg-blue-600"
                        onClick={async () => {
                          if (!newFolderName.trim()) return;
                          createFolderMutation.mutate(newFolderName);
                          setNewFolderName("");
                          setIsAddingFolder(false);
                        }}
                      >
                        생성
                      </button>
                      <button
                        className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200"
                        onClick={() => {
                          setIsAddingFolder(false);
                          setNewFolderName("");
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="mt-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => setIsAddingFolder(true)}
                  >
                    새 폴더 추가
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};
export default NavBar;
