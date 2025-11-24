import "./globals.css";
import { inter } from "./fonts";

export const metadata = {
  title: "Agaaw",
  description: "Fly to your Future",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
