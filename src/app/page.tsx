import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { Player } from '@/types/player';
import { PlayerCatalog } from '@/components/PlayerCatalog';

export const metadata: Metadata = {
  title: 'FootPedia（フットペディア）| サッカー選手図鑑・歴代レジェンド＆日本代表選手一覧（558名名鑑＆作戦盤）',
  description: '海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑・選手名鑑「FootPedia（フットペディア）」。2026年ワールドカップ日本代表（SAMURAI BLUE）、バロンドール受賞者、ワールドカップ優勝・得点王、なでしこジャパンの詳細プロフィール（生い立ち・プレースタイル・所属クラブ遍歴）と無料サッカー作戦盤アプリを提供。',
  keywords: ['FootPedia', 'フットペディア', 'サッカー選手 図鑑', 'サッカー選手図鑑', 'サッカー選手 一覧', 'サッカー選手一覧', 'サッカー 選手名鑑', '海外サッカー選手 一覧', '歴代サッカー選手', '2026年ワールドカップ日本代表', 'SAMURAI BLUE', '森保ジャパン', 'バロンドール', 'ワールドカップ', 'なでしこジャパン', '戦術ボード', 'サッカー 作戦盤 無料', 'フォーメーション'],
  alternates: {
    canonical: 'https://footpedia-weld.vercel.app',
  },
  openGraph: {
    title: 'FootPedia（フットペディア）| サッカー選手図鑑・歴代サッカー選手一覧（558名名鑑＆作戦盤）',
    description: '海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑＆ブラウザで動く無料作戦盤アプリ',
    url: 'https://footpedia-weld.vercel.app',
    type: 'website',
    images: ['/ogp.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FootPedia（フットペディア）| サッカー選手図鑑・歴代サッカー選手一覧（558名名鑑＆作戦盤）',
    description: '海外・日本の歴代サッカー選手一覧（558名）を網羅したWebサッカー選手図鑑＆ブラウザで動く無料作戦盤アプリ',
    images: ['/ogp.png'],
  },
};

function getPlayers(): Player[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function HomePage() {
  const players = getPlayers();

  // Google検索向け WebSite & CollectionPage JSON-LD 構造化データ
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FootPedia（フットペディア）',
      alternateName: [
        'FootPedia',
        'Footpedia',
        'フットペディア',
        'サッカー選手図鑑 FootPedia',
        'サッカー選手一覧・選手名鑑 FootPedia',
      ],
      url: 'https://footpedia-weld.vercel.app',
      description:
        '海外・日本の歴代サッカー選手一覧（558名）を収録したWebサッカー選手図鑑・デジタル選手名鑑＆無料サッカー作戦盤アプリ。',
      inLanguage: 'ja-JP',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'サッカー選手図鑑・歴代サッカー選手一覧（全558名）| FootPedia',
      url: 'https://footpedia-weld.vercel.app',
      description:
        '2026年ワールドカップ日本代表（SAMURAI BLUE）、バロンドール受賞者、ワールドカップ優勝・得点王、なでしこジャパンなど海外・日本の有名サッカー選手558名を一覧・検索できるデジタルサッカー選手図鑑。',
      isPartOf: {
        '@type': 'WebSite',
        name: 'FootPedia（フットペディア）',
        url: 'https://footpedia-weld.vercel.app',
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlayerCatalog initialPlayers={players} />
    </>
  );
}
