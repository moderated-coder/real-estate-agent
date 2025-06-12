"use client";
import { useState, useRef, useEffect } from "react";
interface Props {
  depositRange: [number, number];
  setDepositRange: (range: [number, number]) => void;
  monthlyRentRange: [number, number];
  setMonthlyRentRange: (range: [number, number]) => void;
}
const formatMoney = (val: number) => {
  if (val === Infinity) return "";
  if (val === 0) return "0";

  const billion = Math.floor(val / 10000);
  const remainder = val % 10000;
  const thousand = Math.floor(remainder / 1000);
  const rest = remainder % 1000;

  const parts = [];
  if (billion > 0) parts.push(`${billion}억`);
  if (thousand > 0) parts.push(`${thousand}천`);
  if (rest > 0) parts.push(`${rest}만`);

  return parts.join(" ");
};

const DepositAndRentInput = ({ depositRange, setDepositRange, monthlyRentRange, setMonthlyRentRange }: Props) => {
  const [toggle, setToggle] = useState({ minDeposit: false, maxDeposit: false, minRent: false, maxRent: false });

  const [tempDepositMin, setTempDepositMin] = useState(depositRange[0]);
  const [tempDepositMax, setTempDepositMax] = useState(depositRange[1]);
  const [tempMonthlyMin, setTempMonthlyMin] = useState(monthlyRentRange[0]);
  const [tempMonthlyMax, setTempMonthlyMax] = useState(monthlyRentRange[1]);

  const depositMinRef = useRef<HTMLInputElement>(null);
  const depositMaxRef = useRef<HTMLInputElement>(null);
  const monthlyRentMinRef = useRef<HTMLInputElement>(null);
  const monthlyRentMaxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempDepositMin(depositRange[0]);
    setTempDepositMax(depositRange[1]);
  }, [depositRange]);

  useEffect(() => {
    setTempMonthlyMin(monthlyRentRange[0]);
    setTempMonthlyMax(monthlyRentRange[1]);
  }, [monthlyRentRange]);

  return (
    <section className="mx-auto px-4 py-4 bg-white rounded-b">
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-1 font-semibold text-sm">보증금 (전세금)</div>
          <div className="text-xs text-gray-600 mb-2">
            ₩{depositRange[0] === 0 ? "최소 보증금" : formatMoney(depositRange[0])} ~ ₩
            {depositRange[1] === Infinity ? "최대 보증금" : formatMoney(depositRange[1])}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.max(0, tempDepositMin - 100);
                  setTempDepositMin(newVal);
                  setDepositRange([newVal, tempDepositMax]);
                }}
              >
                -
              </button>
              {toggle.minDeposit ? (
                <input
                  type="text"
                  max={230000}
                  placeholder="최소 보증금"
                  value={tempDepositMin === 0 ? "" : tempDepositMin}
                  ref={depositMinRef}
                  onBlur={() => {
                    if (tempDepositMin > tempDepositMax) {
                      setDepositRange([tempDepositMin, tempDepositMin]);
                      setTempDepositMax(tempDepositMin);
                    } else {
                      setDepositRange([tempDepositMin, tempDepositMax]);
                    }
                    setToggle((prev) => ({ ...prev, minDeposit: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempDepositMin(val > 230000 ? 230000 : val);
                  }}
                  className="border rounded px-2 py-1 w-32 focus:outline-none"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:outline-none"
                  value={depositRange[0] === 0 ? "최소 보증금" : formatMoney(depositRange[0])}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, minDeposit: true }));
                    setTimeout(() => depositMinRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.min(230000, tempDepositMin + 100);
                  setTempDepositMin(newVal);
                  setDepositRange([newVal, tempDepositMax]);
                }}
              >
                +
              </button>
            </div>
            <span>~</span>
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.max(0, (tempDepositMax === Infinity ? 230000 : tempDepositMax) - 100);
                  setTempDepositMax(newVal);
                  setDepositRange([tempDepositMin, newVal]);
                }}
              >
                -
              </button>
              {toggle.maxDeposit ? (
                <input
                  type="text"
                  max={230000}
                  placeholder="최대 보증금"
                  value={tempDepositMax === Infinity ? "" : tempDepositMax}
                  ref={depositMaxRef}
                  onBlur={() => {
                    let finalValue = tempDepositMax > 230000 ? Infinity : tempDepositMax;
                    if (finalValue < tempDepositMin) {
                      setDepositRange([finalValue, finalValue]);
                      setTempDepositMin(finalValue);
                    } else {
                      setDepositRange([tempDepositMin, finalValue]);
                    }

                    setToggle((prev) => ({ ...prev, maxDeposit: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempDepositMax(val);
                    if (val === 0) {
                      setDepositRange([depositRange[0], Infinity]);
                    }
                  }}
                  className="border rounded px-2 py-1 w-32 focus:outline-none"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:outline-none"
                  value={depositRange[1] === Infinity ? "최대 보증금" : formatMoney(depositRange[1])}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, maxDeposit: true }));
                    setTimeout(() => depositMaxRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const currentVal = tempDepositMax === Infinity ? 230000 : tempDepositMax;
                  let newVal = currentVal + 100;
                  if (newVal > 230000) {
                    newVal = Infinity;
                  }
                  setTempDepositMax(newVal);
                  setDepositRange([tempDepositMin, newVal]);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-1 font-semibold text-sm">월세</div>
          <div className="text-xs text-gray-600 mb-2">
            ₩{monthlyRentRange[0] === 0 ? "최소 월세" : formatMoney(monthlyRentRange[0])} ~ ₩
            {monthlyRentRange[1] === Infinity ? "최대 월세" : formatMoney(monthlyRentRange[1])}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.max(0, tempMonthlyMin - 100);
                  setTempMonthlyMin(newVal);
                  setMonthlyRentRange([newVal, tempMonthlyMax]);
                }}
              >
                -
              </button>
              {toggle.minRent ? (
                <input
                  ref={monthlyRentMinRef}
                  type="text"
                  max={230000}
                  placeholder="최소 월세"
                  value={tempMonthlyMin === 0 ? "" : tempMonthlyMin}
                  onBlur={() => {
                    if (tempMonthlyMin > tempMonthlyMax) {
                      setMonthlyRentRange([tempMonthlyMin, tempMonthlyMin]);
                      setTempMonthlyMax(tempMonthlyMin);
                    } else {
                      setMonthlyRentRange([tempMonthlyMin, tempMonthlyMax]);
                    }
                    setToggle((prev) => ({ ...prev, minRent: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempMonthlyMin(val > 230000 ? 230000 : val);
                  }}
                  className="border rounded px-2 py-1 w-32 focus:outline-none"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:outline-none"
                  value={monthlyRentRange[0] === 0 ? "최소 월세" : formatMoney(monthlyRentRange[0])}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, minRent: true }));
                    setTimeout(() => monthlyRentMinRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.min(230000, tempMonthlyMin + 100);
                  setTempMonthlyMin(newVal);
                  setMonthlyRentRange([newVal, tempMonthlyMax]);
                }}
              >
                +
              </button>
            </div>
            <span>~</span>
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const currentVal = tempMonthlyMax === Infinity ? 230000 : tempMonthlyMax;
                  const newVal = Math.max(0, currentVal - 100);
                  setTempMonthlyMax(newVal);
                  setMonthlyRentRange([tempMonthlyMin, newVal]);
                }}
              >
                -
              </button>
              {toggle.maxRent ? (
                <input
                  ref={monthlyRentMaxRef}
                  type="text"
                  max={230000}
                  placeholder="최대 월세"
                  value={tempMonthlyMax === Infinity ? "" : tempMonthlyMax}
                  onBlur={() => {
                    let finalValue = tempMonthlyMax > 230000 ? Infinity : tempMonthlyMax;
                    if (finalValue < tempMonthlyMin) {
                      setMonthlyRentRange([finalValue, finalValue]);
                      setTempMonthlyMin(finalValue);
                    } else {
                      setMonthlyRentRange([tempMonthlyMin, finalValue]);
                    }
                    setToggle((prev) => ({ ...prev, maxRent: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempMonthlyMax(val);
                    if (val === 0) {
                      setMonthlyRentRange([monthlyRentRange[0], Infinity]);
                    }
                  }}
                  className="border rounded px-2 py-1 w-32 focus:outline-none"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:outline-none"
                  value={monthlyRentRange[1] === Infinity ? "최대 월세" : formatMoney(monthlyRentRange[1])}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, maxRent: true }));
                    setTimeout(() => monthlyRentMaxRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const currentVal = tempMonthlyMax === 0 ? 0 : tempMonthlyMax;
                  let newVal = currentVal + 100;
                  if (newVal > 230000) {
                    newVal = Infinity;
                  }
                  setTempMonthlyMax(newVal);
                  setMonthlyRentRange([tempMonthlyMin, newVal]);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepositAndRentInput;
