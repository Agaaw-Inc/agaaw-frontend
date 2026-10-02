import { Bricolage_Grotesque } from "next/font/google";

/**
 * The one Agaaw typeface, used for everything — body text, headings,
 * buttons, dashboards. A variable font: no `weight` list, so a single file
 * serves every weight, and the `opsz` axis adapts letterforms to size.
 * Self-hosted by next/font at build time: no request to Google at runtime.
 */
export const brand = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-brand",
});
