import React from 'react';
import { Player } from '@/types/player';
import {
  formatBirthDate,
  getCountryDisplayName,
  getPlayerClubs,
  getPlayerFlag,
  getPlayerPrimaryStyle,
} from '@/lib/playerUtils';

interface PlayerProfilePhotoProps {
  player: Player;
  variant: 'modal' | 'page';
}

/**
 * モーダル・個別ページ共通の選手写真カラム
 * レイアウト・バッジ位置・クレジット表記を完全に統一する
 */
export const PlayerProfilePhoto: React.FC<PlayerProfilePhotoProps> = ({ player, variant }) => {
  const isModal = variant === 'modal';

  return (
    <div
      className={
        isModal
          ? 'relative w-full md:w-5/12 bg-slate-950 flex flex-col items-center justify-center h-[340px] xs:h-[380px] sm:h-[420px] md:h-full min-h-[320px] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80 min-w-0'
          : 'relative w-full md:w-5/12 bg-slate-950 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[560px] shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80'
      }
    >
      {player.image ? (
        <>
          {/* 背景アンビエントぼかし */}
          <img
            src={player.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
          />
          {/* メイン写真（見切れゼロの全表示） */}
          <div className={isModal ? 'relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4' : 'relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-6'}>
            <img
              src={player.image}
              alt={`${player.name_ja}（${player.name_en}）の写真`}
              style={{ objectFit: 'contain' }}
              className={
                isModal
                  ? 'max-h-full max-w-full h-auto w-auto object-contain drop-shadow-2xl'
                  : 'max-h-[380px] md:max-h-[500px] max-w-full h-auto w-auto object-contain drop-shadow-2xl'
              }
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
        <div
          className={`absolute top-3 sm:top-5 z-20 flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border border-amber-200 ${
            isModal ? 'right-14 sm:right-20' : 'right-3 sm:right-5'
          }`}
        >
          <span className="text-sm sm:text-base">🏆</span>
          <span>{player.ballon_dor.count > 1 ? `×${player.ballon_dor.count}` : 'WINNER'}</span>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none z-20" />

      <div className="absolute bottom-2.5 left-2.5 z-20 rounded-lg bg-black/75 backdrop-blur-sm px-2.5 py-1 text-[10px] sm:text-[11px] text-slate-400 font-medium">
        Photo: Wikimedia Commons
      </div>
    </div>
  );
};

interface PlayerProfileDetailsProps {
  player: Player;
  headingLevel?: 'h1' | 'h2';
}

/**
 * モーダル・個別ページ共通の選手詳細プロフィール本文
 * セクション順序・見出し・余白・空データの扱いを100%画一化する
 */
export const PlayerProfileDetails: React.FC<PlayerProfileDetailsProps> = ({
  player,
  headingLevel = 'h2',
}) => {
  const clubs = getPlayerClubs(player);
  const flag = getPlayerFlag(player);
  const countryName = getCountryDisplayName(player);
  const birthFormatted = formatBirthDate(player.birth_date, player.birth_year);
  const primaryStyle = getPlayerPrimaryStyle(player);
  const hasHonors = Boolean(
    player.ballon_dor ||
      player.world_cup ||
      player.is_wc2026_jpn ||
      (player.league_mvp && player.league_mvp.length > 0)
  );

  const TitleTag = headingLevel;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. 国籍・ポジション・年代ヘッダー */}
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
            <span className="text-slate-400 font-medium">{player.active_decade}年代</span>
          </>
        )}
      </div>

      {/* 2. 選手名＆英名・愛称 */}
      <div>
        <TitleTag className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight select-text">
          {player.name_ja}
        </TitleTag>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-slate-400 text-xs sm:text-base font-medium select-text">
          <span>{player.name_en}</span>
          {player.nickname && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-amber-400 font-semibold">愛称: {player.nickname}</span>
            </>
          )}
        </div>
      </div>

      {/* 3. プレースタイル・キャリア概要 */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-slate-900/90 p-4 border border-emerald-500/30 shadow-lg">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <span>⚡</span>
          <span>PLAY STYLE &amp; CAREER（プレースタイル・キャリア概要）</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal select-text">
          {primaryStyle}
        </p>
      </section>

      {/* 4. 生い立ち・ルーツ（データがある選手のみ画一的に表示し、不自然な空枠を防止） */}
      {player.early_life && player.early_life.trim().length > 0 && (
        <section className="rounded-2xl bg-gradient-to-r from-teal-950/35 via-slate-900/70 to-slate-900/90 p-4 border border-teal-500/30 shadow-lg">
          <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span>📖</span>
            <span>UPBRINGING &amp; ROOTS（生い立ち・ルーツ）</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal select-text">
            {player.early_life}
          </p>
        </section>
      )}

      {/* 5. 基本スタッツグリッド（生年月日・身長・利き足・出身地） */}
      <section aria-label="基本プロフィール">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">
              生年月日
            </span>
            <span className="text-xs sm:text-sm font-bold text-white block truncate">
              {birthFormatted}
            </span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">
              身長
            </span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {player.height ? `${player.height} cm` : '-'}
            </span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">
              利き足
            </span>
            <span className="text-xs sm:text-sm font-bold text-white">
              {player.preferred_foot || '-'}
            </span>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5">
              出身地
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate block">
              {player.birth_place || player.country_ja}
            </span>
          </div>
        </div>
      </section>

      {/* 6. 栄冠・タイトルアワード（該当選手のみ） */}
      {hasHonors && (
        <section className="rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-900/80 p-3.5 sm:p-4 border border-amber-500/30">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span>🏆</span>
            <span>HONORS &amp; AWARDS（獲得主要タイトル・個人賞）</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* 2026年ワールドカップ日本代表 */}
            {player.is_wc2026_jpn && (
              <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-blue-400/50">
                <span className="text-2xl shrink-0">🇯🇵</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-blue-300">
                    2026年 FIFAワールドカップ 日本代表
                  </div>
                  <div className="text-[11px] text-blue-200/90 font-medium truncate">
                    北中米W杯 SAMURAI BLUE 選出{' '}
                    {player.wc2026_number && player.wc2026_number <= 26
                      ? `(#${player.wc2026_number})`
                      : '(追加招集)'}
                  </div>
                </div>
              </div>
            )}

            {/* バロンドール */}
            {player.ballon_dor && (
              <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-amber-400/50">
                <span className="text-2xl shrink-0">🏅</span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black text-amber-300">
                    {player.ballon_dor.is_honorary
                      ? 'FIFA 名誉バロンドール'
                      : `バロンドール ×${player.ballon_dor.count}`}
                  </div>
                  <div className="text-[11px] text-amber-200/90 font-medium truncate">
                    {player.ballon_dor.years.join(', ')}年
                  </div>
                  {player.ballon_dor.special && (
                    <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                      {player.ballon_dor.special}
                    </div>
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
                    FIFAワールドカップ 優勝{' '}
                    {(player.world_cup.winner_count ?? 0) > 1
                      ? `×${player.world_cup.winner_count}`
                      : ''}
                  </div>
                  <div className="text-[11px] text-yellow-200/90 font-medium truncate">
                    {player.world_cup.winner_years?.join(', ')}年 大会制覇
                  </div>
                </div>
              </div>
            )}

            {/* W杯得点王 */}
            {player.world_cup &&
              player.world_cup.is_golden_boot &&
              player.world_cup.golden_boot_info && (
                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-400/50">
                  <span className="text-2xl shrink-0">⚽</span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-emerald-300">
                      FIFAワールドカップ 得点王（ゴールデンブーツ）
                    </div>
                    <div className="text-[11px] text-emerald-200/90 font-medium">
                      {player.world_cup.golden_boot_info
                        .map((g) => `${g.year}年 (${g.goals}得点)`)
                        .join(', ')}
                    </div>
                  </div>
                </div>
              )}

            {/* リーグ最優秀選手（MVP）/ 国民栄誉賞等 */}
            {player.league_mvp &&
              player.league_mvp.map((mvp, mIdx) => {
                if (typeof mvp === 'string') {
                  return (
                    <div
                      key={mIdx}
                      className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-pink-400/50"
                    >
                      <span className="text-2xl shrink-0">🌸</span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-pink-300">{mvp}</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={mIdx}
                    className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-sky-400/50"
                  >
                    <span className="text-2xl shrink-0">🎖️</span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-black text-sky-300">
                        {mvp.league} {mvp.award}{' '}
                        {mvp.count && mvp.count > 1 ? `×${mvp.count}` : ''}
                      </div>
                      <div className="text-[11px] text-sky-200/90 font-medium truncate">
                        {mvp.years
                          ? `${mvp.years.slice(0, 4).join(', ')}${
                              mvp.years.length > 4 ? ` 他計${mvp.count}回` : '年'
                            }`
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

      {/* 7. 国際Aマッチ成績（記録がある場合） */}
      {player.intl_caps !== undefined && player.intl_caps !== null && (
        <section className="rounded-2xl bg-slate-800/80 p-3.5 border border-slate-700/60 shadow-inner">
          <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span>📊</span>
            <span>INTERNATIONAL CAREER（代表通算成績）</span>
          </h3>
          <div className="flex items-baseline gap-4 mb-1">
            <div>
              <span className="text-2xl font-black text-white">{player.intl_caps}</span>
              <span className="text-xs text-slate-400 ml-1">試合出場</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-400">
                {player.intl_goals ?? 0}
              </span>
              <span className="text-xs text-slate-400 ml-1">得点</span>
            </div>
          </div>
          {player.intl_summary && (
            <p className="text-xs text-slate-300 leading-relaxed">{player.intl_summary}</p>
          )}
        </section>
      )}

      {/* 8. 所属クラブ遍歴（プロデビュー〜最新所属の時系列順） */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            所属クラブ遍歴（トップチーム）
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            全{clubs.length}クラブ
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {clubs.map((club, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-medium border border-slate-700/60 transition"
            >
              <span className="text-[10px] text-emerald-400 font-bold">{idx + 1}.</span>
              <span>{club}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};
