interface Props {
  step: "city" | "gu" | "dong";
  setStep: (step: "city" | "gu" | "dong") => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedGu: string | null;
  setSelectedGu: (gu: string | null) => void;
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  guMap: { [city: string]: string[] };
  dongMap: { [gu: string]: string[] };
  searchRealEstate: () => void;
  setShowFilter: (showFilter: boolean) => void;
}
const SearchLocation = ({
  step,
  setStep,
  setSelectedCity,
  selectedCity,
  setSelectedGu,
  selectedGu,
  selectedDong,
  setSelectedDong,
  guMap,
  dongMap,
  searchRealEstate,
  setShowFilter,
}: Props) => {
  const locationParts = [selectedCity, selectedGu].filter(Boolean);
  return (
    <div className="w-100 z-40">
      <section className="max-w-6xl mx-auto px-4 py-4  rounded-b">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">지역 찾기</h2>
          <div>
            <div className="mb-1 font-semibold text-sm">현재 선택된 지역</div>
            <div className="text-xs text-gray-600 mb-2">
              {locationParts.map((part, index) => (
                <span key={part}>
                  {index > 0 && " > "}
                  {part}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedDong.size > 0 &&
                Array.from(selectedDong).map((dong) => (
                  <div key={dong} className="text-xs text-gray-600 mb-1 bg-gray-100 p-2 rounded">
                    {dong}
                  </div>
                ))}
            </div>
          </div>
          {step === "city" && (
            <>
              <p className="text-sm text-gray-600">시/도를 선택하세요.</p>
              <button
                className="text-left border rounded px-3 py-2 hover:bg-gray-50"
                onClick={() => {
                  setStep("gu");
                  setSelectedCity("서울시");
                }}
              >
                서울시
              </button>
            </>
          )}
          {step === "gu" && (
            <>
              <p className="text-sm text-gray-600">구를 선택하세요.</p>
              <ul className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                {guMap["서울시"].map((gu) => (
                  <li
                    key={gu}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      setSelectedGu(gu);
                      setStep("dong");
                    }}
                  >
                    {gu}
                  </li>
                ))}
              </ul>
              <button
                className="text-xs text-gray-500 mt-2 cursor-pointer hover:text-green-500"
                onClick={() => {
                  setStep("city");
                  setSelectedGu(null);
                }}
              >
                ← 시/도로 돌아가기
              </button>
            </>
          )}
          {step === "dong" && selectedGu && (
            <>
              <p className="text-sm text-gray-600">{selectedGu}의 동을 선택하세요.</p>
              <ul className="grid grid-cols-3 gap-1 text-sm text-gray-700 max-h-[300px] overflow-y-auto pr-2">
                {(dongMap[selectedGu] || []).map((dong) => (
                  <li
                    key={dong}
                    className={`cursor-pointer hover:text-blue-600 px-1 py-1 ${
                      selectedDong.has(dong) ? "bg-blue-200 text-blue-500 rounded w-fit " : ""
                    }`}
                    onClick={() => {
                      setSelectedDong((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(dong)) {
                          newSet.delete(dong);
                        } else {
                          newSet.add(dong);
                        }
                        return newSet;
                      });
                    }}
                  >
                    {dong}
                  </li>
                ))}
              </ul>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 cursor-pointer"
                onClick={() => {
                  searchRealEstate();
                  setShowFilter(false);
                }}
              >
                {selectedDong.size > 0 ? "선택한 동 검색하기" : `${selectedGu} 전체 검색하기`}
              </button>
              <button
                className="text-xs text-gray-500 mt-2 cursor-pointer hover:text-green-500"
                onClick={() => {
                  setSelectedDong(new Set());
                  setStep("gu");
                }}
              >
                ← 구로 돌아가기
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
export default SearchLocation;
