import "./globals.css";
import { bricolage, inter, kalam } from "./fonts";

export const metadata = {
  title: "Agaaw — mentorship from people who've done it",
  description:
    "Find a mentor for studying abroad, your career, your business or your research — real people who have already walked the path.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable} ${kalam.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
