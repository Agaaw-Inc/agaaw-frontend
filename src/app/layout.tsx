import "./globals.css";
import { brand } from "./fonts";

export const metadata = {
  title: "Agaaw — study abroad with people who've done it",
  description:
    "Find scholarships, country guides and mentors who have already studied abroad — real people who have walked the path, with payments protected until the work is done.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={brand.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
