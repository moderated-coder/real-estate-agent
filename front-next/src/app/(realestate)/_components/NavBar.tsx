"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
// import SearchBar from "./SearchBar";
import DepositAndRentInput from "./DepositAndRentInput";
import SelectLocation from "./SelectLocation";
// import { getFolderList } from "@/src/lib/api";
// import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import NavAction from "./NavAction";

const NavBar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  // const [showSlider, setShowSlider] = useState(false);
  // const [showSearchLocation, setShowSearchLocation] = useState(true);
  const [depositRange, setDepositRange] = useState<[number, number]>([0, Infinity]);
  const [monthlyRentRange, setMonthlyRentRange] = useState<[number, number]>([0, Infinity]);
  // const [step, setStep] = useState<"city" | "gu" | "dong">("city");
  // const [selectedCity, setSelectedCity] = useState<string | null>(null);
  // const [selectedGu, setSelectedGu] = useState<string | null>(null);
  const [selectedDong, setSelectedDong] = useState<Set<string>>(new Set());
  // const [showSearchFilter, setShowSearchFilter] = useState(false);
  // const [showFolderSelect, setShowFolderSelect] = useState(false);
  // const [isAddingFolder, setIsAddingFolder] = useState(false);
  // const [newFolderName, setNewFolderName] = useState("");
  const router = useRouter();

  // const { data: folders } = useQuery({
  //   queryKey: ["folders", "admin"],
  //   queryFn: getFolderList,
  // });
  // const guMap: { [city: string]: string[] } = {
  //   서울시: [
  //     "강남구",
  //     "강동구",
  //     "강북구",
  //     "강서구",
  //     "관악구",
  //     "광진구",
  //     "구로구",
  //     "금천구",
  //     "노원구",
  //     "도봉구",
  //     "동대문구",
  //     "동작구",
  //     "마포구",
  //     "서대문구",
  //     "서초구",
  //     "성동구",
  //     "성북구",
  //     "송파구",
  //     "양천구",
  //     "영등포구",
  //     "용산구",
  //     "은평구",
  //     "종로구",
  //     "중구",
  //     "중랑구",
  //   ],
  // };
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
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (navRef.current && !navRef.current.contains(event.target as Node)) {
  //       setShowSearchFilter(false);
  //       setShowFolderSelect(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDong.size > 0) {
      params.set("gu", "영등포구");
      params.set("dong", [...selectedDong].join(","));
      params.set("deposit_min", depositRange[0].toString());
      if (monthlyRentRange[1] !== Infinity) {
        params.set("rent_max", monthlyRentRange[1].toString());
      }
      params.set("rent_min", monthlyRentRange[0].toString());
      if (depositRange[1] !== Infinity) {
        params.set("deposit_max", depositRange[1].toString());
      }
    }
    router.replace(`/?${params.toString()}`);
  }, [selectedDong, depositRange, monthlyRentRange]);

  // const searchRealEstate = () => {
  //   const params = new URLSearchParams();
  //   params.set("deposit_min", depositRange[0].toString());
  //   params.set("deposit_max", depositRange[1].toString());
  //   params.set("rent_min", monthlyRentRange[0].toString());
  //   params.set("rent_max", monthlyRentRange[1].toString());
  //   if (selectedGu) {
  //     params.set("gu", selectedGu);
  //   }
  //   if (selectedDong.size > 0) {
  //     params.set("dong", Array.from(selectedDong).join(","));
  //   }
  //   router.replace(`/?${params.toString()}`);
  // };

  // const queryClient = useQueryClient();

  // const createFolderMutation = useMutation({
  //   mutationFn: async (folderName: string) => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ user_id: "admin", folder_name: folderName }),
  //     });
  //     if (!res.ok) throw new Error("Failed to create folder");
  //     return folderName;
  //   },
  //   onMutate: async (newFolderName) => {
  //     await queryClient.cancelQueries({ queryKey: ["folders", "admin"] });
  //     const previousFolders = queryClient.getQueryData<{ folders: string[] }>(["folders", "admin"]) ?? { folders: [] };
  //     queryClient.setQueryData(["folders", "admin"], (old: { folders: string[] } = { folders: [] }) => ({
  //       folders: [...old.folders, newFolderName],
  //     }));
  //     return { previousFolders };
  //   },
  //   onError: (_err, _newFolderName, context) => {
  //     if (context?.previousFolders) {
  //       queryClient.setQueryData(["folders", "admin"], context.previousFolders);
  //     }
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["folders", "admin"] });
  //   },
  // });

  return (
    <div ref={navRef}>
      <header className="min-w-[555px] w-full bg-white shadow-sm border-b">
        <div className="mx-auto px-4 py-1 flex items-center justify-between gap-4">
          <Link href="/" className="whitespace-nowrap text-lg font-bold text-blue-600">
            부동산 리스트
          </Link>
          {/* <Suspense fallback={<div>Loading...</div>}>
            <SearchBar depositRange={depositRange} monthlyRentRange={monthlyRentRange} />
          </Suspense>
          <NavAction
            showSearchFilter={showSearchFilter}
            setShowSearchFilter={setShowSearchFilter}
            showFolderSelect={showFolderSelect}
            setShowFolderSelect={setShowFolderSelect}
            showSlider={showSlider}
            setShowSlider={setShowSlider}
            showSearchLocation={showSearchLocation}
            setShowSearchLocation={setShowSearchLocation}
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
            depositRange={depositRange}
            setDepositRange={setDepositRange}
            monthlyRentRange={monthlyRentRange}
            setMonthlyRentRange={setMonthlyRentRange}
            folders={folders}
            isAddingFolder={isAddingFolder}
            setIsAddingFolder={setIsAddingFolder}
            newFolderName={newFolderName}
            setNewFolderName={setNewFolderName}
            createFolderMutation={createFolderMutation}
          /> */}
        </div>
        <div className="mx-auto px-4 py-2 flex gap-2">
          <SelectLocation selectedDong={selectedDong} setSelectedDong={setSelectedDong} dongMap={dongMap} />

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
