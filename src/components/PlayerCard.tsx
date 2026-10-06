'use client';

import React from 'react';
import { Player } from '@/types/player';

interface PlayerCardProps {
  player: Player;
  showRuby: boolean;
  onSelect: (player: Player) => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵', BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', DEU: '🇩🇪',
  GBR: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP: '🇪🇸', ITA: '🇮🇹', PRT: '🇵🇹',
  NLD: '🇳🇱', URY: '🇺🇾', COL: '🇨🇴', CHL: '🇨🇱', SWE: '🇸🇪',
  HRV: '🇭🇷', ROU: '🇷🇴', BGR: '🇧🇬', CIV: '🇨🇮', GHA: '🇬🇭',
  CMR: '🇨🇲', KOR: '🇰🇷', IRN: '🇮🇷', SRB: '🇷🇸', DNK: '🇩🇰',
  UKR: '🇺🇦', CZE: '🇨🇿'
};

const POSITION_THEMES: Record<string, { badge: string; border: string; label: string }> = {
  FW: { badge: 'bg-rose-500 text-white', border: 'border-rose-400/40 hover:border-rose-500', label: 'FW (攻)' },
  MF: { badge: 'bg-emerald-500 text-white', border: 'border-emerald-400/40 hover:border-emerald-500', label: 'MF (中)' },
  DF: { badge: 'bg-sky-500 text-white', border: 'border-sky-400/40 hover:border-sky-500', label: 'DF (守)' },
  GK: { badge: 'bg-amber-500 text-slate-900', border: 'border-amber-400/40 hover:border-amber-500', label: 'GK (守護神)' },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, showRuby, onSelect }) => {
  const flag = player.is_women ? '🌸' : (COUNTRY_FLAGS[player.country_code] || '🌐');
  const posTheme = POSITION_THEMES[player.position] || POSITION_THEMES.MF;
  const primaryClub = (player.teams_full && player.teams_full.length > 0)
    ? player.teams_full[0]
    : ((player.teams && player.teams.length > 0) ? player.teams[0] : (player.position_detail || ''));

  return (
    <div
      onClick={() => onSelect(player)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-slate-900/90 p-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer ${posTheme.border} ${player.ballon_dor ? 'border-amber-500/40 shadow-amber-500/10' : ''}`}
      style={{ aspectRatio: '1 / 1.42' }}
    >
      {/* 1. カードヘッダー */}
      <div className="flex items-center justify-between gap-1 z-10">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-xl shrink-0">{flag}</span>
          <span className="text-xs font-semibold text-slate-300 truncate">
            {player.is_women ? '日本女子' : player.country_ja}
          </span>
        </div>
        <span className={`px-2 py-0.5 text-[11px] font-bold tracking-wider rounded-full shadow-sm shrink-0 ${posTheme.badge}`}>
          {player.position}
        </span>
      </div>

      {/* 2. 写真エリア */}
      <div className="relative my-2 w-full flex-1 overflow-hidden rounded-xl bg-slate-800/80 border border-slate-700/50">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name_ja}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-slate-600">
            ⚽
          </div>
        )}
        
        {/* タイトル・栄冠バッジ */}
        {player.ballon_dor ? (
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 rounded bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow-md border border-amber-200">
            <span>🏆</span>
            <span>{player.ballon_dor.is_honorary ? '名誉' : ''}Ballon d&apos;Or {player.ballon_dor.count > 1 ? `×${player.ballon_dor.count}` : ''}</span>
          </div>
        ) : player.world_cup && player.world_cup.is_golden_boot ? (
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 rounded bg-gradient-to-r from-emerald-400 to-teal-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow-md border border-emerald-200">
            <span>⚽</span>
            <span>W杯得点王</span>
          </div>
        ) : player.world_cup && player.world_cup.is_winner ? (
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 rounded bg-gradient-to-r from-yellow-400 to-amber-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow-md border border-yellow-200">
            <span>🏆</span>
            <span>W杯制覇 {(player.world_cup.winner_count ?? 0) > 1 ? `×${player.world_cup.winner_count}` : ''}</span>
          </div>
        ) : player.league_mvp && player.league_mvp.length > 0 ? (
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1 rounded bg-gradient-to-r from-sky-400 to-blue-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow-md border border-sky-200">
            <span>🎖️</span>
            <span>{typeof player.league_mvp[0] === 'string' ? player.league_mvp[0] : 'リーグMVP'}</span>
          </div>
        ) : player.sitelinks && player.sitelinks >= 120 ? (
          <div className="absolute top-1.5 right-1.5 z-20 rounded bg-slate-800/90 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-300 shadow">
            ★ LEGEND
          </div>
        ) : null}

        {/* 生年または背番号 */}
        <div className="absolute bottom-1.5 left-1.5 z-20 flex items-center gap-1 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
          <span>{player.birth_year ? `${player.birth_year}年` : ''}</span>
          {player.jersey_number && (
            <span className="font-black text-emerald-400">#{player.jersey_number}</span>
          )}
        </div>
      </div>

      {/* 3. 選手情報 */}
      <div className="flex flex-col justify-between pt-1">
        <div className="mb-1">
          {showRuby ? (
            <div
              className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug"
              dangerouslySetInnerHTML={{ __html: player.name_ja_ruby }}
            />
          ) : (
            <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
              {player.name_ja}
            </div>
          )}
          <div className="text-[10px] text-slate-400 truncate tracking-wide">
            {player.name_en}
          </div>
        </div>

        {/* 所属クラブ・詳細 */}
        <div className="mt-1 flex items-center justify-between text-[10px] border-t border-slate-800 pt-1.5">
          <span className="text-slate-400 truncate max-w-[70%]">
            {primaryClub}
          </span>
          <span className="font-semibold text-emerald-400 shrink-0">
            {player.position_detail || player.position}
          </span>
        </div>
      </div>
    </div>
  );
};
