'use client';

import React from 'react';
import { Player } from '@/types/player';

interface PlayerDetailModalProps {
  player: Player | null;
  showRuby: boolean;
  onClose: () => void;
}

const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵', BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', DEU: '🇩🇪',
  GBR: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ESP: '🇪🇸', ITA: '🇮🇹', PRT: '🇵🇹',
  NLD: '🇳🇱', URY: '🇺🇾', COL: '🇨🇴', CHL: '🇨🇱', SWE: '🇸🇪',
  HRV: '🇭🇷', ROU: '🇷🇴', BGR: '🇧🇬', CIV: '🇨🇮', GHA: '🇬🇭',
  CMR: '🇨🇲', KOR: '🇰🇷', IRN: '🇮🇷', SRB: '🇷🇸', DNK: '🇩🇰',
  UKR: '🇺🇦', CZE: '🇨🇿'
};

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, showRuby, onClose }) => {
  if (!player) return null;

  const clubs = player.teams_full || player.teams || [];
  const flag = player.is_women ? '🌸' : (COUNTRY_FLAGS[player.country_code] || '🌐');
  const countryName = player.is_women ? '日本女子（なでしこジャパン）' : `${player.country_ja} 代表`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[1230px] my-auto overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* クローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-600/50 shadow-lg text-lg"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row">
          {/* 左カラム: 選手写真＆背番号 */}
          <div className="relative md:w-5/12 bg-slate-950 flex flex-col items-center justify-center min-h-[340px] md:min-h-[560px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
            {player.image ? (
              <img
                src={player.image}
                alt={player.name_ja}
                className="h-full w-full object-cover object-top max-h-[560px]"
              />
            ) : (
              <div className="text-8xl text-slate-700">⚽</div>
            )}

            {/* 背景巨大背番号 */}
            {player.jersey_number && (
              <div className="pointer-events-none absolute bottom-4 right-4 text-8xl sm:text-9xl font-black text-white/5 select-none leading-none">
                {player.jersey_number}
              </div>
            )}

            {/* 背番号バッジ */}
            {player.jersey_number && (
              <div className="absolute top-5 left-5 flex items-center justify-center rounded-2xl bg-slate-950/85 backdrop-blur-md px-4 py-1.5 border border-slate-700 shadow-2xl text-emerald-400 font-black text-xl">
                #{player.jersey_number}
              </div>
            )}

            {/* バロンドールトロフィーアイコン */}
            {player.ballon_dor && (
              <div className="absolute top-5 right-18 flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 backdrop-blur-md px-3.5 py-1.5 text-slate-950 font-black text-sm shadow-2xl border border-amber-200">
                <span className="text-base">🏆</span>
                <span>{player.ballon_dor.count > 1 ? `×${player.ballon_dor.count}` : 'WINNER'}</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[11px] text-slate-400 font-medium">
              Photo: Wikimedia Commons
            </div>
          </div>

          {/* 右カラム: 詳細プロフィール */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between max-h-[88vh] overflow-y-auto">
            <div className="space-y-4">
              
              {/* 国籍・ポジションヘッダー */}
              <div className="flex items-center gap-2.5 text-sm">
                <span className="font-bold text-slate-200">
                  {flag} {countryName}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-black text-emerald-400 tracking-wider">
                  {player.position} ({player.position_detail || player.position})
                </span>
              </div>

              {/* 選手名＆英名・愛称 */}
              <div>
                {showRuby ? (
                  <div
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
                    dangerouslySetInnerHTML={{ __html: player.name_ja_ruby }}
                  />
                ) : (
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                    {player.name_ja}
                  </h2>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-400 text-sm sm:text-base font-medium">
                  <span>{player.name_en}</span>
                  {player.nickname && (
                    <>
                      <span className="text-slate-600">/</span>
                      <span className="text-amber-400 font-semibold">愛称: {player.nickname}</span>
                    </>
                  )}
                </div>
              </div>

              {/* プレースタイル・詳細解説 */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900/60 to-slate-900/80 p-4 border border-emerald-500/30 shadow-lg">
                <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>PLAY STYLE &amp; PROFILE</span>
                </div>
                <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {player.style_rich || player.style_summary || player.desc_ja || '世界的名手としてサッカー史にその名を刻むレジェンド。'}
                </div>
              </div>

              {/* 基本スタッツグリッド */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">生年月日 / 年齢</span>
                  <span className="text-sm font-bold text-white">
                    {player.birth_date ? player.birth_date.slice(0, 10) : (player.birth_year ? `${player.birth_year}年生` : '-')}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">身長</span>
                  <span className="text-sm font-bold text-white">
                    {player.height ? `${player.height} cm` : '-'}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">利き足</span>
                  <span className="text-sm font-bold text-white">
                    {player.preferred_foot || '-'}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">出身地</span>
                  <span className="text-sm font-bold text-white truncate block">
                    {player.birth_place || player.country_ja}
                  </span>
                </div>
              </div>

              {/* 栄冠・タイトルアワード */}
              {(player.ballon_dor || player.world_cup || (player.league_mvp && player.league_mvp.length > 0)) && (
                <div className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/80 p-4 border border-amber-500/30">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span>🏆</span>
                    <span>HONORS &amp; AWARDS（獲得主要タイトル・個人賞）</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* バロンドール */}
                    {player.ballon_dor && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-amber-400/50">
                        <span className="text-2xl shrink-0">🏅</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-amber-300">
                            {player.ballon_dor.is_honorary ? "FIFA 名誉バロンドール" : `バロンドール ×${player.ballon_dor.count}`}
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

                    {/* W杯優勝 */}
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

                    {/* W杯得点王 */}
                    {player.world_cup && player.world_cup.is_golden_boot && player.world_cup.golden_boot_info && (
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-400/50">
                        <span className="text-2xl shrink-0">⚽</span>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-black text-emerald-300">
                            FIFAワールドカップ 得点王（ゴールデンブーツ）
                          </div>
                          <div className="text-[11px] text-emerald-200/90 font-medium">
                            {player.world_cup.golden_boot_info.map(g => `${g.year}年 (${g.goals}得点)`).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* リーグ最優秀選手（MVP）/ 国民栄誉賞等 */}
                    {player.league_mvp && player.league_mvp.map((mvp, mIdx) => {
                      if (typeof mvp === 'string') {
                        return (
                          <div key={mIdx} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-pink-400/50">
                            <span className="text-2xl shrink-0">🌸</span>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-black text-pink-300">
                                {mvp}
                              </div>
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
                              {mvp.years ? `${mvp.years.slice(0, 4).join(', ')}${mvp.years.length > 4 ? ` 他計${mvp.count}回` : '年'}` : (mvp.year ? `${mvp.year}年` : '')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 国際Aマッチ成績 */}
              {player.intl_caps !== undefined && player.intl_caps !== null && (
                <div className="rounded-2xl bg-slate-800/80 p-3.5 border border-slate-700/60 shadow-inner">
                  <div className="text-xs font-black text-sky-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>📊</span>
                      <span>INTERNATIONAL CAREER（代表通算成績）</span>
                    </div>
                  </div>
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
                  {player.intl_summary && (
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {player.intl_summary}
                    </div>
                  )}
                </div>
              )}

              {/* 所属クラブ遍歴 */}
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">
                  主要所属クラブ遍歴
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {clubs.map((club, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60"
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* モーダルフッター（Wikipediaリンク等） */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Footpedia 歴代レジェンド名鑑
              </span>
              {player.wiki_url && (
                <a
                  href={player.wiki_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition font-semibold"
                >
                  <span>Wikipediaで詳細を見る</span>
                  <span>↗</span>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
