/** 12 -> "12", 1234 -> "1.2k", 12500 -> "12k". Rounded down, so it never overstates. */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  const k = Math.floor(n / 100) / 10;
  return `${k >= 10 ? Math.floor(k) : k}k`;
}
