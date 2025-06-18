interface Props {
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  dongMap: { [gu: string]: string[] };
}
const SelectLocation = ({ selectedDong, setSelectedDong, dongMap }: Props) => {
  return (
    <div className=" ">
      <section className="px-4 py-4 rounded-b">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-1 text-gray-700 ">
          {(dongMap["영등포구"] || []).map((dong) => (
            <li
              key={dong}
              className={`cursor-pointer box-border text-xs hover:text-blue-600 px-1 py-1 min-w-0 max-w-full ${
                selectedDong.has(dong) ? "bg-blue-200 text-blue-500 rounded" : ""
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
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedDong.size > 0 &&
          Array.from(selectedDong).map((dong) => (
            <div key={dong} className="text-xs text-gray-600 mb-1 bg-gray-100 p-2 rounded">
              {dong}
            </div>
          ))}
      </div>
    </div>
  );
};
export default SelectLocation;
