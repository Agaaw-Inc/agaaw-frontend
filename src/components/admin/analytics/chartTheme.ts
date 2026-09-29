/**
 * Chart colors and formatters for the admin dashboard.
 *
 * Colors come from the validated categorical palette, used in fixed order.
 * The set {blue, aqua, orange} passes every colorblind-separation check even
 * when all three share a chart (checked with the dataviz palette validator).
 * Aqua sits below 3:1 contrast on white, so every chart that uses it also
 * offers a table view and a legend — color is never the only way to read it.
 *
 * Brand teal (#0f766e) was tested too and fails the chroma floor (it reads as
 * gray next to other series), so data marks don't use it.
 */
export const SERIES = {
  blue: "#2a78d6",
  aqua: "#1baf7a",
  orange: "#eb6834",
} as const;

/** Recessive chrome: hairline grid and muted axis text. */
export const CHROME = {
  grid: "#eef0f2",
  axisText: "#6b7280",
} as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "2026-09-27" → "Sep 27" (daily) or "Sep '26" (monthly). Parsed by hand so
 * the browser's own timezone can't shift the date — the server already cut
 * the bucket in Bangladesh time.
 */
export function bucketLabel(bucket: string, unit: "day" | "month"): string {
  const [y, m, d] = bucket.split("-").map(Number);
  return unit === "day" ? `${MONTHS[m - 1]} ${d}` : `${MONTHS[m - 1]} '${String(y).slice(2)}`;
}

export function bucketLabelLong(bucket: string, unit: "day" | "month"): string {
  const [y, m, d] = bucket.split("-").map(Number);
  return unit === "day" ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`;
}

/** Full taka amount for tiles, tooltips and tables: ৳1,349.10 / ৳900. */
export function taka(value: string | number): string {
  const n = Number(value) || 0;
  const hasPaisa = Math.round(n * 100) % 100 !== 0;
  return `৳${n.toLocaleString("en-US", { minimumFractionDigits: hasPaisa ? 2 : 0, maximumFractionDigits: 2 })}`;
}

/** Short taka for axis ticks: ৳950, ৳1.2k, ৳3.4L (lakh) — the unit Bangladesh reads money in. */
export function takaShort(value: number): string {
  const n = Math.abs(value);
  if (n >= 10_000_000) return `৳${trim(value / 10_000_000)}Cr`;
  if (n >= 100_000) return `৳${trim(value / 100_000)}L`;
  if (n >= 1_000) return `৳${trim(value / 1_000)}k`;
  return `৳${Math.round(value)}`;
}

function trim(n: number) {
  return n.toFixed(1).replace(/\.0$/, "");
}

export function count(value: number): string {
  return value.toLocaleString("en-US");
}
