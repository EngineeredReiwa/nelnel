import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nel-chan Timeline | Interactive Cat Behavior Demo",
  description: "Interactive timeline demo showing Nel-chan's daily activities, emotions, and behavior patterns with real-time data visualization.",
  openGraph: {
    title: "Nel-chan Timeline | Interactive Cat Behavior Demo",
    description: "Interactive timeline demo showing Nel-chan's daily activities, emotions, and behavior patterns with real-time data visualization.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}