'use client';

import React from 'react';
import Link from 'next/link';
import { Player } from '@/types/player';
import { PlayerProfileDetails, PlayerProfilePhoto } from './PlayerProfileSections';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[95vw] sm:max-w-2xl md:max-w-[1230px] h-[92dvh] md:h-[88vh] max-h-[92dvh] md:max-h-[88vh] flex flex-col md:flex-row overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 常時アクセス可能なクローズボタン */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-40 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white transition border border-slate-600/70 shadow-2xl text-base sm:text-lg cursor-pointer active:scale-90"
          title="閉じる"
          aria-label="閉じる"
        >
          ✕
        </button>

        {/* モバイル時は全体スクロール、PC時は左写真固定＋右カラムスクロール */}
        <div className="block md:flex md:flex-row w-full h-full overflow-y-auto overflow-x-hidden md:overflow-hidden overscroll-contain min-w-0">
          {/* 左カラム: 共通選手写真＆バッジ */}
          <PlayerProfilePhoto player={player} variant="modal" />

          {/* 右カラム: 共通プロフィール詳細＋フッター */}
          <div className="w-full md:flex-1 md:h-full md:overflow-y-auto md:overscroll-contain p-4 sm:p-7 md:p-8 flex flex-col justify-between pb-24 md:pb-8 min-w-0 max-w-full md:overflow-x-hidden">
            <PlayerProfileDetails player={player} headingLevel="h2" />

            {/* モーダルフッター */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium order-2 sm:order-1">
                FootPedia 歴代レジェンド名鑑
              </span>
              <div className="order-1 sm:order-2 flex flex-wrap items-center gap-2">
                <Link
                  href={`/players/${player.qid}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
                >
                  <span>🔗</span>
                  <span>個別ページを開く</span>
                </Link>
                {player.wiki_url && (
                  <a
                    href={player.wiki_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
                  >
                    <span>Wikipediaで詳細を見る</span>
                    <span className="text-sm">↗</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
