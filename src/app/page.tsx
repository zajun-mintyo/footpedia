import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { Player } from '@/types/player';
import { PlayerCatalog } from '@/components/PlayerCatalog';

export const metadata: Metadata = {
  title: 'Footpedia（フットペディア）- 歴代サッカーレジェンド500名名鑑 & 戦術ボード',
  description: '世界歴代サッカースター500名の詳細プロフィール（ふりがなルビ付き、プレースタイル、獲得タイトル、背番号）を網羅した国内最大級のサッカー百科事典＆タクティクスボードアプリ。',
  keywords: ['サッカー', '選手名鑑', '歴代レジェンド', 'バロンドール', 'ワールドカップ', 'なでしこジャパン', '戦術ボード', '作戦盤'],
  openGraph: {
    title: 'Footpedia - 歴代サッカーレジェンド500名名鑑',
    description: '世界歴代サッカースター500名の詳細プロフィール＆無料作戦盤アプリ',
    type: 'website',
  },
};

function getPlayers(): Player[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default function HomePage() {
  const players = getPlayers();
  return <PlayerCatalog initialPlayers={players} />;
}
