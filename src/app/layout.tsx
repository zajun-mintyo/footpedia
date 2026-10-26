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
    default: "FootPedia（フットペディア）| サッカー選手図鑑・歴代レジェンド＆日本代表選手一覧（558名名鑑＆作戦盤）",
    template: "%s | FootPedia（サッカー選手図鑑）",
  },
  description: "海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑・選手名鑑「FootPedia（フットペディア）」。2026年ワールドカップ日本代表（SAMURAI BLUE）、バロンドール受賞者、なでしこジャパンの生い立ち・プレースタイル・所属クラブ遍歴から、ブラウザで動く無料サッカー作戦盤まで完全収録。",
  keywords: ["FootPedia", "フットペディア", "サッカー選手 図鑑", "サッカー選手図鑑", "サッカー選手 一覧", "サッカー選手一覧", "サッカー 選手名鑑", "海外サッカー選手 一覧", "歴代サッカー選手", "2026年ワールドカップ日本代表", "SAMURAI BLUE", "森保ジャパン", "バロンドール", "ワールドカップ", "なでしこジャパン", "サッカー 作戦盤 無料", "戦術ボード", "フォーメーション作成"],
  openGraph: {
    title: "FootPedia（フットペディア）| サッカー選手図鑑・歴代サッカー選手一覧（558名名鑑＆作戦盤）",
    description: "海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑＆無料サッカー作戦盤アプリ",
    url: "https://footpedia-weld.vercel.app",
    siteName: "FootPedia（フットペディア）",
    images: [
      {
        url: "/ogp.png?v=558",
        width: 1200,
        height: 630,
        alt: "FootPedia（フットペディア）- サッカー選手図鑑・歴代サッカー選手一覧＆作戦ボード",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FootPedia（フットペディア）| サッカー選手図鑑・歴代サッカー選手一覧（558名名鑑＆作戦盤）",
    description: "海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑＆無料サッカー作戦盤アプリ",
    images: ["/ogp.png?v=558"],
  },
  verification: {
    google: "PWyl9wiPWp7WS5DrfHowmNdz6buiN8XAjaBnfAn-Ulg",
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
