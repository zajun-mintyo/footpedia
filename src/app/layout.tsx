import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://footpedia-weld.vercel.app'),
  title: {
    default: "FootPedia - 歴代サッカーレジェンド500名名鑑＆作戦ボード",
    template: "%s | FootPedia",
  },
  description: "世界歴代サッカースター500名の詳細プロフィール（ふりがなルビ・獲得タイトル・背番号）を網羅した国内最大級の名鑑＆ブラウザで動く無料タクティクス作戦ボード。",
  keywords: ["サッカー", "選手名鑑", "レジェンド", "バロンドール", "ワールドカップ", "なでしこジャパン", "作戦盤", "戦術ボード", "FootPedia"],
  openGraph: {
    title: "FootPedia - 歴代サッカーレジェンド500名名鑑＆作戦ボード",
    description: "世界歴代サッカースター500名の詳細プロフィール＆無料作戦盤アプリ",
    url: "https://footpedia-weld.vercel.app",
    siteName: "FootPedia",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "FootPedia - 歴代サッカーレジェンド500名名鑑＆作戦ボード",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FootPedia - 歴代サッカーレジェンド500名名鑑＆作戦ボード",
    description: "世界歴代サッカースター500名の詳細プロフィール＆無料作戦盤アプリ",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
