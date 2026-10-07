'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Player } from '@/types/player';
import { PlayerCard } from './PlayerCard';
import { PlayerDetailModal } from './PlayerDetailModal';
import Link from 'next/link';

interface PlayerCatalogProps {
  initialPlayers: Player[];
}

const HONORS = [
  { key: 'ALL', label: 'すべて', icon: '⚽' },
  { key: 'WC_WINNER', label: 'W杯優勝', icon: '🏆' },
  { key: 'WC_GOLDEN_BOOT', label: 'W杯得点王', icon: '⚽' },
  { key: 'LEAGUE_MVP', label: '主要リーグMVP', icon: '🎖️' },
  { key: 'BALLON_DOR', label: 'バロンドール', icon: '🏅' },
];

const DECADES = ['ALL', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];

const COUNTRIES = [
  { code: 'ALL', label: 'すべての国', flag: '🌍' },
  { code: 'JPN', label: '日本', flag: '🇯🇵' },
  { code: 'JPN_WOMEN', label: '日本女子', flag: '🌸' },
  { code: 'BRA', label: 'ブラジル', flag: '🇧🇷' },
  { code: 'ARG', label: 'アルゼンチン', flag: '🇦🇷' },
  { code: 'FRA', label: 'フランス', flag: '🇫🇷' },
  { code: 'DEU', label: 'ドイツ', flag: '🇩🇪' },
  { code: 'GBR', label: 'イングランド', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ESP', label: 'スペイン', flag: '🇪🇸' },
  { code: 'ITA', label: 'イタリア', flag: '🇮🇹' },
  { code: 'PRT', label: 'ポルトガル', flag: '🇵🇹' },
  { code: 'NLD', label: 'オランダ', flag: '🇳🇱' },
  { code: 'URY', label: 'ウルグアイ', flag: '🇺🇾' },
];

const POSITIONS = [
  { key: 'ALL', label: 'すべて' },
  { key: 'FW', label: 'FW (攻)' },
  { key: 'MF', label: 'MF (中)' },
  { key: 'DF', label: 'DF (守)' },
  { key: 'GK', label: 'GK (守護神)' },
];

function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s・\-_.\u3000]/g, '');
}

export const PlayerCatalog: React.FC<PlayerCatalogProps> = ({ initialPlayers }) => {
  const [players] = useState<Player[]>(initialPlayers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHonor, setSelectedHonor] = useState('ALL');
  const [selectedDecade, setSelectedDecade] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [showRuby, setShowRuby] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedHonor !== 'ALL' ||
      selectedDecade !== 'ALL' ||
      selectedCountry !== 'ALL' ||
      selectedPosition !== 'ALL'
    );
  }, [searchQuery, selectedHonor, selectedDecade, selectedCountry, selectedPosition]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedHonor('ALL');
    setSelectedDecade('ALL');
    setSelectedCountry('ALL');
    setSelectedPosition('ALL');
  };

  const filteredPlayers = useMemo(() => {
    const rawTokens = searchQuery.replace(/[\u3000]/g, ' ').trim().split(/\s+/).filter((t) => t.length > 0);
    const searchTokens = rawTokens.map(normalizeSearchText);

    return players.filter((p) => {
      // 1. テキスト検索（AND検索・ひらがな/カタカナ相互・スペース/中黒柔軟マッチ）
      if (searchTokens.length > 0) {
        const allMatch = searchTokens.every((token) => {
          if (!token) return true;
          if (p.name_ja && normalizeSearchText(p.name_ja).includes(token)) return true;
          if (p.name_ja_kana && normalizeSearchText(p.name_ja_kana).includes(token)) return true;
          if (p.name_en && normalizeSearchText(p.name_en).includes(token)) return true;
          if (p.nickname && normalizeSearchText(p.nickname).includes(token)) return true;
          if (p.country_ja && normalizeSearchText(p.country_ja).includes(token)) return true;
          if (p.country_code && p.country_code.toLowerCase().includes(token.toLowerCase())) return true;
          if (p.position && p.position.toLowerCase() === token.toLowerCase()) return true;
          if (p.position_detail && normalizeSearchText(p.position_detail).includes(token)) return true;
          if (p.teams && p.teams.some((t) => normalizeSearchText(t).includes(token))) return true;
          if (p.teams_full && p.teams_full.some((t) => normalizeSearchText(t).includes(token))) return true;
          if (p.desc_ja && normalizeSearchText(p.desc_ja).includes(token)) return true;
          if (p.style_summary && normalizeSearchText(p.style_summary).includes(token)) return true;
          return false;
        });
        if (!allMatch) return false;
      }

      // 2. アワード絞り込み
      if (selectedHonor === 'BALLON_DOR') {
        if (!p.ballon_dor) return false;
      } else if (selectedHonor === 'WC_WINNER') {
        if (!p.world_cup || !p.world_cup.is_winner) return false;
      } else if (selectedHonor === 'WC_GOLDEN_BOOT') {
        if (!p.world_cup || !p.world_cup.is_golden_boot) return false;
      } else if (selectedHonor === 'LEAGUE_MVP') {
        if (!p.league_mvp || p.league_mvp.length === 0) return false;
      }

      // 3. 国籍
      if (selectedCountry !== 'ALL') {
        if (selectedCountry === 'JPN_WOMEN') {
          if (!p.is_women) return false;
        } else if (selectedCountry === 'JPN') {
          if (p.country_code !== 'JPN' || p.is_women) return false;
        } else if (selectedCountry === 'GBR') {
          if (p.country_code !== 'GBR' && p.country_code !== 'ENG') return false;
        } else if (p.country_code !== selectedCountry) {
          return false;
        }
      }

      // 4. 年代
      if (selectedDecade !== 'ALL') {
        if (p.active_decade !== parseInt(selectedDecade, 10)) return false;
      }

      // 5. ポジション
      if (selectedPosition !== 'ALL') {
        if (p.position !== selectedPosition) return false;
      }

      return true;
    });
  }, [players, searchQuery, selectedHonor, selectedCountry, selectedDecade, selectedPosition]);

  const activeHonorObj = HONORS.find((h) => h.key === selectedHonor);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white pb-24 font-sans">
      {/* グローバルヘッダー */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full md:w-auto gap-2">
            <div className="flex items-center gap-2 cursor-pointer min-w-0" onClick={handleResetFilters}>
              <span className="text-2xl sm:text-3xl shrink-0">⚽</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white whitespace-nowrap">FootPedia</h1>
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap shrink-0">
                    500 LEGENDS
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[170px] sm:max-w-none">
                  世界のレジェンド＆名選手 500名デジタル名鑑
                </p>
              </div>
            </div>

            {/* スマホ用: ボード盤リンク＆ルビスイッチ */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              <Link
                href="/board"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-bold shadow-sm whitespace-nowrap shrink-0 transition-transform active:scale-95 border border-emerald-400/30"
              >
                <span>⚽</span>
                <span>作戦ボード</span>
              </Link>
              <button
                onClick={() => setShowRuby(!showRuby)}
                className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-2 py-1 text-[11px] text-slate-300 shrink-0 cursor-pointer active:scale-95 select-none"
                title="ふりがな（ルビ）の表示切替"
              >
                <span className="text-[10px] text-slate-400 font-medium">ルビ</span>
                <span className={`w-7 h-3.5 rounded-full relative transition-colors ${showRuby ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                  <span className={`block w-2.5 h-2.5 bg-white rounded-full transition-transform absolute top-0.5 ${showRuby ? 'right-0.5' : 'left-0.5'}`}></span>
                </span>
              </button>
            </div>
          </div>

          {/* 検索窓 & PC用ツール */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-2xl justify-end">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="選手名（漢字/かな/カナ/英）、国、クラブ..."
                className="w-full rounded-full border border-slate-700 bg-slate-900/90 pl-9 pr-9 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
                  title="検索ワードを消去"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 検索・絞り込み全リセットボタン */}
            <button
              onClick={handleResetFilters}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition shrink-0 shadow-sm cursor-pointer border ${
                isFiltered
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700 font-semibold'
              }`}
              title="検索ワードとすべての絞り込みフィルターを初期状態に戻す"
            >
              <span className="text-xs">🔄</span>
              <span className="hidden sm:inline">リセット</span>
            </button>

            {/* PC用: サッカーボード盤リンク */}
            <Link
              href="/board"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full text-xs font-bold transition shadow-md shrink-0 border border-emerald-400/30"
            >
              <span>⚽</span>
              <span>作戦ボード</span>
            </Link>

            {/* PC用ルビスイッチ */}
            <button
              onClick={() => setShowRuby(!showRuby)}
              className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5 shrink-0 cursor-pointer select-none hover:border-slate-700 transition"
            >
              <span className="text-xs font-medium text-slate-300">ふりがな</span>
              <span className={`w-9 h-5 rounded-full relative transition-colors ${showRuby ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${showRuby ? 'translate-x-4' : 'translate-x-1'}`}></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 絞り込みフィルターバー */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mt-4 space-y-2.5">
        {/* ★★★ 栄冠・アワード絞り込みセレクター ★★★ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-amber-400 font-extrabold shrink-0 mr-1 text-[11px] flex items-center gap-1">
            <span>🏆</span>
            <span>アワード:</span>
          </span>
          <div className="flex gap-1.5">
            {HONORS.map((h) => (
              <button
                key={h.key}
                onClick={() => setSelectedHonor(h.key)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition shrink-0 cursor-pointer ${
                  selectedHonor === h.key
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md font-black border border-amber-300'
                    : 'bg-slate-900/80 text-amber-300/80 hover:bg-slate-800 border border-amber-500/30'
                }`}
              >
                <span>{h.icon}</span>
                <span>{h.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 年代セレクター */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold shrink-0 mr-1 text-[11px]">年代:</span>
          <div className="flex gap-1.5">
            {DECADES.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDecade(d)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition shrink-0 cursor-pointer ${
                  selectedDecade === d
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {d === 'ALL' ? '全年代' : `${d}s`}
              </button>
            ))}
          </div>
        </div>

        {/* 国籍セレクター */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold shrink-0 mr-1 text-[11px]">国籍:</span>
          <div className="flex gap-1.5">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c.code)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition shrink-0 cursor-pointer ${
                  selectedCountry === c.code
                    ? 'bg-slate-100 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ポジション & カウンター & 条件クリア */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2.5 gap-2">
          <div className="flex items-center gap-1 text-xs">
            {POSITIONS.map((p) => (
              <button
                key={p.key}
                onClick={() => setSelectedPosition(p.key)}
                className={`rounded-lg px-3 py-1 font-semibold transition cursor-pointer ${
                  selectedPosition === p.key ? 'bg-slate-700 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition font-semibold text-xs cursor-pointer"
                title="すべての絞り込み条件を初期化"
              >
                <span>✕</span>
                <span>条件クリア</span>
              </button>
            )}

            {selectedHonor !== 'ALL' && activeHonorObj && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs">
                {activeHonorObj.icon} {activeHonorObj.label}絞り込み中
              </span>
            )}

            <div>
              表示中: <span className="font-bold text-emerald-400 text-sm">{filteredPlayers.length}</span> / {players.length} 名
            </div>
          </div>
        </div>
      </section>

      {/* 選手カードグリッド */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-5">
        {filteredPlayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-3">⚽</span>
            <p className="text-base font-semibold text-slate-300">該当する選手が見つかりませんでした</p>
            <p className="text-xs text-slate-500 mt-1">検索キーワードを変更するか、フィルターをリセットしてください</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              条件をリセット
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.qid}
                player={player}
                showRuby={showRuby}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>
        )}
      </main>

      {/* 選手詳細モーダル */}
      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer}
          showRuby={showRuby}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      {/* 最上部へ戻るホバーボタン */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center gap-1.5 rounded-full bg-slate-900/95 text-emerald-400 border border-emerald-500/40 px-3.5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="最上部へ戻る"
        aria-label="最上部へ戻る"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-xs font-black tracking-wide">TOP</span>
      </button>
    </div>
  );
};
