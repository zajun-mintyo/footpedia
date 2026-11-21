import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Player } from '@/types/player';
import {
  getPlayerClubs,
  getPlayerFlag,
  getPlayerPrimaryStyle,
  POSITION_THEMES,
} from '@/lib/playerUtils';
import { PlayerProfileDetails, PlayerProfilePhoto } from '@/components/PlayerProfileSections';

// 全選手データの読み込み
function getAllPlayers(): Player[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// ビルド時に全選手の静的パスを生成（SSG）
export async function generateStaticParams() {
  const players = getAllPlayers();
  return players.map((player) => ({
    id: player.qid,
  }));
}

// 選手ごとのSEOメタデータを動的生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const players = getAllPlayers();
  const player = players.find((p) => p.qid === id);

  if (!player) {
    return {
      title: '選手が見つかりません | FootPedia',
    };
  }

  const clubs = getPlayerClubs(player).slice(0, 4).join('・');
  const styleText = getPlayerPrimaryStyle(player);
  const countryLabel = player.is_women
    ? 'サッカー日本女子代表（なでしこジャパン）'
    : `${player.country_ja}代表`;

  const title = `${player.name_ja}（${player.name_en}）のプレースタイル・生い立ち・経歴・背番号`;
  const description = `${countryLabel}の名手、${player.name_ja}（${player.position_detail || player.position}）のプレースタイル、生い立ち、所属クラブ遍歴（${clubs || '歴代名門クラブ'}）、身長・利き足・獲得タイトルを徹底解説。${styleText.slice(0, 80)}`;

  const keywords = [
    player.name_ja,
    player.name_en,
    player.name_ja_kana,
    ...(player.nickname ? [player.nickname] : []),
    `${player.name_ja} プレースタイル`,
    `${player.name_ja} 生い立ち`,
    `${player.name_ja} 経歴`,
    `${player.name_ja} 利き足`,
    `${player.name_ja} 身長`,
    player.country_ja,
    player.position_detail || player.position,
    'サッカー選手図鑑',
    'サッカー選手一覧',
    'サッカー選手名鑑',
    'FootPedia',
    'フットペディア',
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://footpedia-weld.vercel.app/players/${player.qid}`,
    },
    openGraph: {
      title: `${title} | FootPedia`,
      description,
      url: `https://footpedia-weld.vercel.app/players/${player.qid}`,
      siteName: 'FootPedia',
      type: 'profile',
      locale: 'ja_JP',
      images: player.image
        ? [
            {
              url: player.image,
              alt: `${player.name_ja}（${player.name_en}）`,
            },
          ]
        : ['/ogp.png?v=553'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | FootPedia`,
      description,
      images: player.image ? [player.image] : ['/ogp.png?v=553'],
    },
  };
}

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const players = getAllPlayers();
  const player = players.find((p) => p.qid === id);

  if (!player) {
    notFound();
  }

  const flag = getPlayerFlag(player);

  // 関連選手の抽出（1. 同じ国籍の選手、2. 同じ年代・ポジションの選手）
  const sameCountryPlayers = players
    .filter(
      (p) =>
        p.qid !== player.qid &&
        p.country_code === player.country_code &&
        Boolean(p.is_women) === Boolean(player.is_women)
    )
    .slice(0, 5);

  const sameEraOrPosPlayers = players
    .filter(
      (p) =>
        p.qid !== player.qid &&
        !sameCountryPlayers.some((sc) => sc.qid === p.qid) &&
        (p.active_decade === player.active_decade || p.position === player.position)
    )
    .slice(0, 5);

  // Google検索エンジン向け JSON-LD 構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name_ja,
    alternateName: [
      player.name_en,
      player.name_ja_kana,
      ...(player.nickname ? [player.nickname] : []),
    ],
    description: getPlayerPrimaryStyle(player),
    birthDate: player.birth_date || (player.birth_year ? `${player.birth_year}` : undefined),
    birthPlace: player.birth_place || player.country_ja,
    nationality: player.country_ja,
    height: player.height ? `${player.height} cm` : undefined,
    image: player.image || undefined,
    jobTitle: `サッカー選手 (${player.position_detail || player.position})`,
    url: `https://footpedia-weld.vercel.app/players/${player.qid}`,
    sameAs: player.wiki_url ? [player.wiki_url] : undefined,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white pb-20 font-sans">
      {/* 構造化データ出力 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* グローバルナビゲーションヘッダー */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 min-w-0 group">
            <span className="text-2xl sm:text-3xl shrink-0">⚽</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition whitespace-nowrap">
                  FootPedia
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0">
                  {players.length} LEGENDS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
                世界のレジェンド＆日本代表 サッカー選手図鑑・選手一覧（{players.length}名）
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition"
            >
              <span>🔍</span>
              <span>選手図鑑・一覧へ</span>
            </Link>
            <Link
              href="/board"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-bold transition shadow-md border border-emerald-400/30"
            >
              <span>⚽</span>
              <span>作戦ボード</span>
            </Link>
          </div>
        </div>
      </header>

      {/* パンくずリスト */}
      <nav
        aria-label="パンくずリスト"
        className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-2 text-xs text-slate-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap"
      >
        <Link href="/" className="hover:text-emerald-400 transition">
          FootPedia トップ（サッカー選手図鑑・選手一覧）
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300">{player.is_women ? '日本女子' : player.country_ja}</span>
        <span className="text-slate-600">/</span>
        <span className="text-emerald-400 font-bold">{player.name_ja}</span>
      </nav>

      {/* メイン選手プロフィールカード（モーダルと100%画一的な構成） */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-2">
        <article className="w-full flex flex-col md:flex-row overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
          {/* 左カラム: 共通選手写真＆バッジ */}
          <PlayerProfilePhoto player={player} variant="page" />

          {/* 右カラム: 共通プロフィール詳細＋アクションバー */}
          <div className="w-full md:flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between">
            <PlayerProfileDetails player={player} headingLevel="h1" />

            {/* フッターアクションバー */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
                >
                  <span>←</span>
                  <span>選手名鑑一覧に戻る</span>
                </Link>
                <Link
                  href="/board"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition"
                >
                  <span>⚽</span>
                  <span>作戦ボードでこの選手を配置する</span>
                </Link>
              </div>

              {player.wiki_url && (
                <a
                  href={player.wiki_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <span>Wikipediaで詳細を見る</span>
                  <span className="text-sm">↗</span>
                </a>
              )}
            </div>
          </div>
        </article>

        {/* 関連レジェンド選手セクション */}
        {(sameCountryPlayers.length > 0 || sameEraOrPosPlayers.length > 0) && (
          <section className="mt-10 space-y-8">
            {sameCountryPlayers.length > 0 && (
              <div>
                <h2 className="text-sm sm:text-base font-black text-white mb-3 flex items-center gap-2">
                  <span>{flag}</span>
                  <span>
                    {player.is_women ? '日本女子（なでしこジャパン）' : player.country_ja}
                    の関連レジェンド選手
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {sameCountryPlayers.map((rel) => {
                    const relTheme = POSITION_THEMES[rel.position] || POSITION_THEMES.MF;
                    return (
                      <Link
                        key={rel.qid}
                        href={`/players/${rel.qid}`}
                        className={`group flex flex-col justify-between rounded-xl border bg-slate-900/90 p-3 transition hover:-translate-y-1 hover:shadow-lg ${relTheme.border}`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-2">
                          <span className="text-slate-400 truncate">
                            {rel.active_decade ? `${rel.active_decade}s` : rel.country_ja}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${relTheme.badge}`}>
                            {rel.position}
                          </span>
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition truncate">
                          {rel.name_ja}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{rel.name_en}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {sameEraOrPosPlayers.length > 0 && (
              <div>
                <h2 className="text-sm sm:text-base font-black text-white mb-3 flex items-center gap-2">
                  <span>⚽</span>
                  <span>
                    同世代（{player.active_decade}年代）・同ポジション（{player.position}）の名選手
                  </span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {sameEraOrPosPlayers.map((rel) => {
                    const relTheme = POSITION_THEMES[rel.position] || POSITION_THEMES.MF;
                    const relFlag = getPlayerFlag(rel);
                    return (
                      <Link
                        key={rel.qid}
                        href={`/players/${rel.qid}`}
                        className={`group flex flex-col justify-between rounded-xl border bg-slate-900/90 p-3 transition hover:-translate-y-1 hover:shadow-lg ${relTheme.border}`}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-2">
                          <span className="text-slate-300 truncate">
                            {relFlag} {rel.is_women ? '日本女子' : rel.country_ja}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${relTheme.badge}`}>
                            {rel.position}
                          </span>
                        </div>
                        <div className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-400 transition truncate">
                          {rel.name_ja}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{rel.name_en}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
