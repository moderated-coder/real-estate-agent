"use client";
interface Props {
  depositRange: [number, number];
  setDepositRange: (range: [number, number]) => void;
  monthlyRentRange: [number, number];
  setMonthlyRentRange: (range: [number, number]) => void;
}
const FeeSlider = ({ depositRange, setDepositRange, monthlyRentRange, setMonthlyRentRange }: Props) => {
  return (
    <div className="w-100 z-40">
      <section className="max-w-6xl mx-auto px-4 py-4 bg-white rounded-b">
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
                  left: `${(monthlyRentRange[0] / 2000) * 100}%`,
                  width: `${((monthlyRentRange[1] - monthlyRentRange[0]) / 2000) * 100}%`,
                }}
              ></div>

              <input
                type="range"
                min={0}
                max={2000}
                step={10}
                value={monthlyRentRange[0]}
                onChange={(e) => {
                  const val = Math.min(+e.target.value, monthlyRentRange[1] - 10);
                  setMonthlyRentRange([val, monthlyRentRange[1]]);
                }}
                className="custom-range "
              />
              <input
                type="range"
                min={0}
                max={2000}
                step={10}
                value={monthlyRentRange[1]}
                onChange={(e) => {
                  const val = Math.max(+e.target.value, monthlyRentRange[0] + 10);
                  setMonthlyRentRange([monthlyRentRange[0], val]);
                }}
                className="custom-range bg-transparent pointer-events-none z-10"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeeSlider;
