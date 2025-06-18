export const formatMoney = (val: number) => {
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
