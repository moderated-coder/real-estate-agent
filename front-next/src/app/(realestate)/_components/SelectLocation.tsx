interface Props {
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  dongMap: { [gu: string]: string[] };
}
const SelectLocation = ({ selectedDong, setSelectedDong, dongMap }: Props) => {
  return (
    <div className="min-w-[522px] ">
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedDong.size > 0 &&
          Array.from(selectedDong).map((dong) => (
            <div key={dong} className="text-xs text-gray-600 mb-1 bg-gray-100 p-2 rounded">
              {dong}
            </div>
          ))}
      </div>
      <section className="mx-auto px-4 py-4  rounded-b">
        <ul className="grid grid-cols-7 gap-1 text-gray-700 max-h-[300px] ">
          {(dongMap["영등포구"] || []).map((dong) => (
            <li
              key={dong}
              className={`cursor-pointer text-xs hover:text-blue-600 px-1 py-1 ${
                selectedDong.has(dong) ? "bg-blue-200 text-blue-500 rounded " : ""
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
      </section>
    </div>
  );
};
export default SelectLocation;
