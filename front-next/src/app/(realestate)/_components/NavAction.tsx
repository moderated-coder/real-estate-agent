"use client";
import FeeSlider from "./FeeSlider";
import SearchLocation from "./SearchLocation";

interface Props {
  showSearchFilter: boolean;
  setShowSearchFilter: (v: boolean) => void;
  showFolderSelect: boolean;
  setShowFolderSelect: (v: boolean) => void;
  showSlider: boolean;
  setShowSlider: (v: boolean) => void;
  showSearchLocation: boolean;
  setShowSearchLocation: (v: boolean) => void;
  depositRange: [number, number];
  setDepositRange: (range: [number, number]) => void;
  monthlyRentRange: [number, number];
  setMonthlyRentRange: (range: [number, number]) => void;
  step: "city" | "gu" | "dong";
  setStep: (n: "city" | "gu" | "dong") => void;
  selectedCity: string | null;
  setSelectedCity: (c: string | null) => void;
  selectedGu: string | null;
  setSelectedGu: (g: string | null) => void;
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  guMap: { [key: string]: string[] };
  dongMap: { [key: string]: string[] };
  searchRealEstate: () => void;
  folders: { folders: string[] } | undefined;
  isAddingFolder: boolean;
  setIsAddingFolder: (v: boolean) => void;
  newFolderName: string;
  setNewFolderName: (v: string) => void;
  createFolderMutation: any;
}

export default function NavAction({
  showSearchFilter,
  setShowSearchFilter,
  showFolderSelect,
  setShowFolderSelect,
  showSlider,
  setShowSlider,
  showSearchLocation,
  setShowSearchLocation,
  depositRange,
  setDepositRange,
  monthlyRentRange,
  setMonthlyRentRange,
  step,
  setStep,
  selectedCity,
  setSelectedCity,
  selectedGu,
  setSelectedGu,
  selectedDong,
  setSelectedDong,
  guMap,
  dongMap,
  searchRealEstate,
  folders,
  isAddingFolder,
  setIsAddingFolder,
  newFolderName,
  setNewFolderName,
  createFolderMutation,
}: Props) {
  return (
    <nav className="relative flex items-center gap-3 text-sm">
      <button
        className={`px-3 py-1 border w-20 rounded cursor-pointer ${
          showSearchFilter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
        } transition`}
        onClick={() => {
          setShowFolderSelect(false);
          setShowSearchFilter(!showSearchFilter);
        }}
      >
        검색 조건
      </button>

      {showSearchFilter && (
        <div className="absolute right-0 top-[50px] flex flex-col items-center gap-2 bg-white border rounded-lg px-3 py-1">
          <div className="flex gap-3 py-2 w-full justify-center bg-white rounded-t-md">
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
          setShowFolderSelect(!showFolderSelect);
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
  );
}
