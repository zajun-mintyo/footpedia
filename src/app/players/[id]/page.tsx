import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Player } from '@/types/player';

// 国旗マップ
const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵', BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', DEU: '🇩🇪',
  GBR: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP: '🇪🇸', ITA: '🇮🇹', PRT: '🇵🇹',
  NLD: '🇳🇱', URY: '🇺🇾', COL: '🇨🇴', CHL: '🇨🇱', SWE: '🇸🇪',
  HRV: '🇭🇷', CRO: '🇭🇷', ROU: '🇷🇴', BGR: '🇧🇬', CIV: '🇨🇮', GHA: '🇬🇭',
  CMR: '🇨🇲', KOR: '🇰🇷', IRN: '🇮🇷', SRB: '🇷🇸', DNK: '🇩🇰',
  UKR: '🇺🇦', CZE: '🇨🇿', POL: '🇵🇱', PRY: '🇵🇾', PAR: '🇵🇾',
  BEL: '🇧🇪', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', NOR: '🇳🇴', AUT: '🇦🇹',
  NGA: '🇳🇬', MEX: '🇲🇽', USA: '🇺🇸', SEN: '🇸🇳', EGY: '🇪🇬'
};

const POSITION_THEMES: Record<string, { badge: string; border: string; label: string }> = {
  FW: { badge: 'bg-rose-500 text-white', border: 'border-rose-400/40 hover:border-rose-500', label: 'FW (フォワード)' },
  MF: { badge: 'bg-emerald-500 text-white', border: 'border-emerald-400/40 hover:border-emerald-500', label: 'MF (ミッドフィールダー)' },
  DF: { badge: 'bg-sky-500 text-white', border: 'border-sky-400/40 hover:border-sky-500', label: 'DF (ディフェンダー)' },
  GK: { badge: 'bg-amber-500 text-slate-900', border: 'border-amber-400/40 hover:border-amber-500', label: 'GK (ゴールキーパー)' },
};

// 全選手データの読み込み
function getAllPlayers(): Player[] {
  const filePath = path.join(process.cwd(), 'public', 'data', 'players.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// 生年月日のフォーマット関数
function formatBirthDate(dateStr?: string, yearNum?: number): string {
  if (dateStr) {
    try {
      const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        return `${match[1]}年${parseInt(match[2], 10)}月${parseInt(match[3], 10)}日`;
      }
    } catch {
      // フォールバック
    }
  }
  if (yearNum) {
    return `${yearNum}年生`;
  }
  return '-';
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

  const clubs = (player.teams_full || player.teams || []).slice(0, 4).join('・');
  const styleText = player.bio_rich || player.style_rich || player.style_summary || player.desc_ja || '';
  const countryLabel = player.is_women ? 'サッカー日本女子代表（なでしこジャパン）' : `${player.country_ja}代表`;

  const title = `${player.name_ja}（${player.name_en}）のプレースタイル・生い立ち・経歴・背番号`;
  const description = `${countryLabel}のレジェンド、${player.name_ja}（${player.position_detail || player.position}）のプレースタイル、生い立ち、所属クラブ遍歴（${clubs || '歴代名門クラブ'}）、身長・利き足・獲得タイトルを徹底解説。${styleText.slice(0, 80)}`;

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
    'サッカー選手名鑑',
    'FootPedia',
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
        : ['/ogp.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | FootPedia`,
      description,
      images: player.image ? [player.image] : ['/ogp.png'],
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

  const clubs = player.teams_full || player.teams || [];
  const flag = player.is_women ? '🌸' : (COUNTRY_FLAGS[player.country_code] || '🌐');
  const countryName = player.is_women ? '日本女子（なでしこジャパン）' : `${player.country_ja} 代表`;
  const birthFormatted = formatBirthDate(player.birth_date, player.birth_year);

  // 関連選手の抽出（1. 同じ国籍の選手、2. 同じ年代・ポジションの選手）
  const sameCountryPlayers = players
    .filter((p) => p.qid !== player.qid && p.country_code === player.country_code && Boolean(p.is_women) === Boolean(player.is_women))
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
    alternateName: [player.name_en, player.name_ja_kana, ...(player.nickname ? [player.nickname] : [])],
    description: player.bio_rich || player.style_rich || player.style_summary || player.desc_ja,
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
                世界のレジェンド＆名選手 {players.length}名デジタル名鑑
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition"
            >
              <span>🔍</span>
              <span>名鑑一覧・検索へ</span>
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
      <nav aria-label="パンくずリスト" className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 pb-2 text-xs text-slate-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-emerald-400 transition">
          FootPedia トップ（選手名鑑）
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300">{player.is_women ? '日本女子' : player.country_ja}</span>
        <span className="text-slate-600">/</span>
        <span className="text-emerald-400 font-bold">{player.name_ja}</span>
      </nav>

      {/* メイン選手プロフィールカード */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 mt-2">
        <article className="w-full flex flex-col md:flex-row overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
          {/* 左カラム: 選手写真＆背番号バッジ */}
          <div className="relative w-full md:w-5/12 bg-slate-950 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[560px] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
            {player.image ? (
              <>
                <img
                  src={player.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                />
                <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-6">
                  <img
                    src={player.image}
                    alt={`${player.name_ja}（${player.name_en}）の写真`}
                    style={{ objectFit: 'contain' }}
                    className="max-h-[380px] md:max-h-[500px] max-w-full h-auto w-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </>
            ) : (
              <div className="text-8xl text-slate-700">⚽</div>
            )}

            {/* 背景巨大背番号 */}
            {player.jersey_number && (
              <div className="pointer-events-none absolute bottom-4 right-4 text-7xl sm:text-9xl font-black text-white/5 select-none leading-none z-10">
                {player.jersey_number}
              </div>
            )}

            {/* 背番号バッジ */}
            {player.jersey_number && (
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center justify-center rounded-2xl bg-slate-950/85 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-1.5 border border-slate-700 shadow-2xl text-emerald-400 font-black text-base sm:text-xl">
                #{player.jersey_number}
              </div>
            )}

            {/* バロンドールトロフィーアイコン */}
            {player.ballon_dor && (
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border border-amber-200">
                <span className="text-sm sm:text-base">🏆</span>
                <span>{player.ballon_dor.count > 1 ? `×${player.ballon_dor.count}` : 'WINNER'}</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none z-20" />

            <div className="absolute bottom-2.5 left-2.5 z-20 rounded-lg bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-[11px] text-slate-400 font-medium">
              Photo: Wikimedia Commons
            </div>
          </div>

          {/* 右カラム: 詳細プロフィール・生い立ち・経歴 */}
          <div className="w-full md:flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              {/* 国籍・ポジションヘッダー */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="font-bold text-slate-200">
                  {flag} {countryName}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-black text-emerald-400 tracking-wider">
                  {player.position} ({player.position_detail || player.position})
                </span>
                {player.active_decade && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 font-medium">
                      {player.active_decade}年代
                    </span>
                  </>
                )}
              </div>

              {/* 選手名＆英名・愛称 */}
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  {player.name_ja}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-slate-400 text-xs sm:text-base font-medium">
                  <span>{player.name_en}</span>
                  {player.nickname && (
                    <>
                      <span className="text-slate-600">/</span>
                      <span className="text-amber-400 font-semibold">愛称: {player.nickname}</span>
                    </>
                  )}
                </div>
              </div>

              {/* プレースタイル・キャリア概要 */}
              <section className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-slate-900/90 p-4 border border-emerald-500/30 shadow-lg">
                <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>PLAY STYLE &amp; CAREER（プレースタイル・キャリア概要）</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {player.bio_rich || player.style_rich || player.style_summary || player.desc_ja || '世界的な名手としてフットボール史に刻まれるレジェンド。'}
                </p>
              </section>

              {/* 生い立ち */}
              {player.early_life && (
                <section className="rounded-2xl bg-gradient-to-r from-teal-950/35 via-slate-900/70 to-slate-900/90 p-4 border border-teal-500/30 shadow-lg">
                  <h2 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <span>📖</span>
                    <span>UPBRINGING &amp; ROOTS（生い立ち・ルーツ）</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {player.early_life}
                  </p>
                </section>
              )}

              {/* 基本スタッツグリッド */}
              <section aria-label="基本プロフィール">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">生年月日</span>
                    <span className="text-xs sm:text-sm font-bold text-white block truncate">
                      {birthFormatted}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">身長</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {player.height ? `${player.height} cm` : '-'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">利き足</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {player.preferred_foot || '-'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">出身地</span>
                    <span className="text-xs sm:text-sm font-bold text-white truncate block">
                      {player.birth_place || player.country_ja}
                    </span>
                  </div>
                </div>
              </section>

              {/* 栄冠・タイトルアワード */}
              {(player.ballon_dor || player.world_cup || player.is_wc2026_jpn || (player.league_mvp && player.league_mvp.length > 0)) && (
                <section className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/80 p-3.5 sm:p-4 border border-amber-500/30">
                  <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>HONORS &amp; AWARDS（獲得主要タイトル・個人賞）</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {player.is_wc2026_jpn && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-blue-400/50">
                        <span className="text-2xl shrink-0">🇯🇵</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-blue-300">
                            2026年 FIFAワールドカップ 日本代表
                          </div>
                          <div className="text-[11px] text-blue-200/90 font-medium truncate">
                            北中米W杯 SAMURAI BLUE 選出 {player.wc2026_number && player.wc2026_number <= 26 ? `(#${player.wc2026_number})` : '(追加招集)'}
                          </div>
                        </div>
                      </div>
                    )}

                    {player.ballon_dor && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-amber-400/50">
                        <span className="text-2xl shrink-0">🏅</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-amber-300">
                            {player.ballon_dor.is_honorary ? 'FIFA 名誉バロンドール' : `バロンドール ×${player.ballon_dor.count}`}
                          </div>
                          <div className="text-[11px] text-amber-200/90 font-medium truncate">
                            {player.ballon_dor.years.join(', ')}年
                          </div>
                          {player.ballon_dor.special && (
                            <div className="text-[10px] text-amber-400 font-semibold mt-0.5">{player.ballon_dor.special}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {player.world_cup && player.world_cup.is_winner && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-yellow-400/50">
                        <span className="text-2xl shrink-0">🏆</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-yellow-300">
                            FIFAワールドカップ 優勝 {(player.world_cup.winner_count ?? 0) > 1 ? `×${player.world_cup.winner_count}` : ''}
                          </div>
                          <div className="text-[11px] text-yellow-200/90 font-medium truncate">
                            {player.world_cup.winner_years?.join(', ')}年 大会制覇
                          </div>
                        </div>
                      </div>
                    )}

                    {player.world_cup && player.world_cup.is_golden_boot && player.world_cup.golden_boot_info && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-400/50">
                        <span className="text-2xl shrink-0">⚽</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-emerald-300">
                            FIFAワールドカップ 得点王（ゴールデンブーツ）
                          </div>
                          <div className="text-[11px] text-emerald-200/90 font-medium">
                            {player.world_cup.golden_boot_info.map((g) => `${g.year}年 (${g.goals}得点)`).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    {player.league_mvp &&
                      player.league_mvp.map((mvp, mIdx) => {
                        if (typeof mvp === 'string') {
                          return (
                            <div key={mIdx} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-pink-400/50">
                              <span className="text-2xl shrink-0">🌸</span>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-black text-pink-300">{mvp}</div>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={mIdx} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-sky-400/50">
                            <span className="text-2xl shrink-0">🎖️</span>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-black text-sky-300">
                                {mvp.league} {mvp.award} {mvp.count && mvp.count > 1 ? `×${mvp.count}` : ''}
                              </div>
                              <div className="text-[11px] text-sky-200/90 font-medium truncate">
                                {mvp.years
                                  ? `${mvp.years.slice(0, 4).join(', ')}${mvp.years.length > 4 ? ` 他計${mvp.count}回` : '年'}`
                                  : mvp.year
                                  ? `${mvp.year}年`
                                  : ''}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </section>
              )}

              {/* 国際Aマッチ成績 */}
              {player.intl_caps !== undefined && player.intl_caps !== null && (
                <section className="rounded-2xl bg-slate-800/80 p-3.5 border border-slate-700/60 shadow-inner">
                  <h2 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <span>📊</span>
                    <span>INTERNATIONAL CAREER（代表通算成績）</span>
                  </h2>
                  <div className="flex items-baseline gap-4 mb-1">
                    <div>
                      <span className="text-2xl font-black text-white">{player.intl_caps}</span>
                      <span className="text-xs text-slate-400 ml-1">試合出場</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-emerald-400">{player.intl_goals ?? 0}</span>
                      <span className="text-xs text-slate-400 ml-1">得点</span>
                    </div>
                  </div>
                  {player.intl_summary && <p className="text-xs text-slate-300 leading-relaxed">{player.intl_summary}</p>}
                </section>
              )}

              {/* 所属クラブ遍歴 */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">所属クラブ遍歴</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    全{clubs.length}クラブ
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {clubs.map((club, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 text-slate-200 text-xs font-medium border border-slate-700/60"
                    >
                      <span className="text-[10px] text-emerald-400 font-bold">{idx + 1}.</span>
                      <span>{club}</span>
                    </span>
                  ))}
                </div>
              </section>
            </div>

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

        {/* 関連レジェンド選手セクション（回遊＆内部リンク強化） */}
        {(sameCountryPlayers.length > 0 || sameEraOrPosPlayers.length > 0) && (
          <section className="mt-10 space-y-8">
            {sameCountryPlayers.length > 0 && (
              <div>
                <h2 className="text-sm sm:text-base font-black text-white mb-3 flex items-center gap-2">
                  <span>{flag}</span>
                  <span>{player.is_women ? '日本女子（なでしこジャパン）' : player.country_ja}の関連レジェンド選手</span>
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
                          <span className="text-slate-400 truncate">{rel.active_decade ? `${rel.active_decade}s` : rel.country_ja}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold ${relTheme.badge}`}>{rel.position}</span>
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
                  <span>同世代（{player.active_decade}年代）・同ポジション（{player.position}）の名選手</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {sameEraOrPosPlayers.map((rel) => {
                    const relTheme = POSITION_THEMES[rel.position] || POSITION_THEMES.MF;
                    const relFlag = rel.is_women ? '🌸' : (COUNTRY_FLAGS[rel.country_code] || '🌐');
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
                          <span className={`px-1.5 py-0.5 rounded font-bold ${relTheme.badge}`}>{rel.position}</span>
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
