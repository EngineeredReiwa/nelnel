import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nelnel - Cat Activity Monitor",
  description: "Monitor your cat's daily activities with Nel-chan",
  icons: {
    icon: "/favicon.ico", // ← ✅ import せずにURLで指定、これでOK
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gradient-to-br from-blue-50 to-pink-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}