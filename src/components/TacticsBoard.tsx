'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Player } from '@/types/player';

interface TacticsBoardProps {
  initialPlayers: Player[];
}

interface PlacedPlayer {
  id: string; // unique placement id
  qid: string;
  name: string;
  number: number;
  position: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  team: 'home' | 'away';
}

const DEFAULT_FORMATIONS: Record<string, { x: number; y: number; num: number; pos: string }[]> = {
  '4-3-3': [
    { x: 50, y: 88, num: 1, pos: 'GK' },
    { x: 15, y: 70, num: 2, pos: 'LB' },
    { x: 38, y: 74, num: 4, pos: 'CB' },
    { x: 62, y: 74, num: 5, pos: 'CB' },
    { x: 85, y: 70, num: 3, pos: 'RB' },
    { x: 50, y: 55, num: 6, pos: 'DM' },
    { x: 32, y: 44, num: 8, pos: 'CM' },
    { x: 68, y: 44, num: 10, pos: 'AM' },
    { x: 18, y: 22, num: 11, pos: 'LW' },
    { x: 50, y: 16, num: 9, pos: 'CF' },
    { x: 82, y: 22, num: 7, pos: 'RW' },
  ],
  '4-4-2': [
    { x: 50, y: 88, num: 1, pos: 'GK' },
    { x: 15, y: 70, num: 2, pos: 'LB' },
    { x: 38, y: 74, num: 4, pos: 'CB' },
    { x: 62, y: 74, num: 5, pos: 'CB' },
    { x: 85, y: 70, num: 3, pos: 'RB' },
    { x: 15, y: 45, num: 11, pos: 'LM' },
    { x: 38, y: 50, num: 6, pos: 'CM' },
    { x: 62, y: 50, num: 8, pos: 'CM' },
    { x: 85, y: 45, num: 7, pos: 'RM' },
    { x: 36, y: 18, num: 9, pos: 'CF' },
    { x: 64, y: 18, num: 10, pos: 'CF' },
  ],
  '3-5-2': [
    { x: 50, y: 88, num: 1, pos: 'GK' },
    { x: 26, y: 74, num: 3, pos: 'CB' },
    { x: 50, y: 76, num: 4, pos: 'CB' },
    { x: 74, y: 74, num: 5, pos: 'CB' },
    { x: 10, y: 46, num: 2, pos: 'LWB' },
    { x: 35, y: 52, num: 6, pos: 'CM' },
    { x: 65, y: 52, num: 8, pos: 'CM' },
    { x: 90, y: 46, num: 7, pos: 'RWB' },
    { x: 50, y: 35, num: 10, pos: 'AM' },
    { x: 36, y: 18, num: 9, pos: 'CF' },
    { x: 64, y: 18, num: 11, pos: 'CF' },
  ]
};

export const TacticsBoard: React.FC<TacticsBoardProps> = ({ initialPlayers }) => {
  const [formation, setFormation] = useState<string>('4-3-3');
  const [boardPlayers, setBoardPlayers] = useState<PlacedPlayer[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const [searchWord, setSearchWord] = useState('');
  const [selectedDrawerPlayer, setSelectedDrawerPlayer] = useState<Player | null>(null);

  // 初期フォーメーション配置
  useEffect(() => {
    const defaultPos = DEFAULT_FORMATIONS[formation] || DEFAULT_FORMATIONS['4-3-3'];
    const newPlaced: PlacedPlayer[] = defaultPos.map((pos, idx) => {
      // 500名の中からポジションの合う選手を適宜選ぶ
      const sample = initialPlayers[idx % initialPlayers.length];
      return {
        id: `starter-${idx}`,
        qid: sample.qid,
        name: sample.name_ja.split('・').pop() || sample.name_ja,
        number: sample.jersey_number || pos.num,
        position: pos.pos,
        x: pos.x,
        y: pos.y,
        team: 'home',
      };
    });
    setBoardPlayers(newPlaced);
  }, [formation, initialPlayers]);

  const handlePointerDown = (id: string) => {
    setDraggedPlayer(id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggedPlayer || !pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setBoardPlayers(prev => prev.map(p => p.id === draggedPlayer ? { ...p, x, y } : p));
  };

  const handlePointerUp = () => {
    setDraggedPlayer(null);
  };

  const filteredCandidates = useMemo(() => {
    if (!searchWord) return initialPlayers.slice(0, 30);
    return initialPlayers.filter(p => 
      p.name_ja.includes(searchWord) || 
      p.country_ja.includes(searchWord) ||
      (p.teams && p.teams.some(t => t.includes(searchWord)))
    ).slice(0, 30);
  }, [searchWord, initialPlayers]);

  const replaceStarterWith = (candidate: Player) => {
    if (!selectedDrawerPlayer) return;
    setBoardPlayers(prev => prev.map(p => {
      if (p.qid === selectedDrawerPlayer.qid) {
        return {
          ...p,
          qid: candidate.qid,
          name: candidate.name_ja.split('・').pop() || candidate.name_ja,
          number: candidate.jersey_number || p.number,
        };
      }
      return p;
    }));
    setSelectedDrawerPlayer(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* ツールバー */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition border border-slate-700"
          >
            <span>←</span>
            <span>選手名鑑へ戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <span className="font-black text-sm text-white">サッカーボード盤</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">フォーメーション:</label>
          <select
            value={formation}
            onChange={(e) => setFormation(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-emerald-400 focus:outline-none"
          >
            <option value="4-3-3">4-3-3 (攻撃型)</option>
            <option value="4-4-2">4-4-2 (クラシック)</option>
            <option value="3-5-2">3-5-2 (中盤支配型)</option>
          </select>
        </div>
      </header>

      {/* メインエリア：ピッチと選手ドロワー */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* サッカーピッチ */}
        <div 
          className="flex-1 relative flex items-center justify-center p-2 sm:p-4 bg-slate-950 overflow-hidden"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div
            ref={pitchRef}
            className="relative w-full max-w-[620px] rounded-2xl shadow-2xl border-4 border-white/80 overflow-hidden"
            style={{
              aspectRatio: '68 / 105',
              background: 'repeating-linear-gradient(to bottom, #1b5e20 0px, #1b5e20 40px, #2e7d32 40px, #2e7d32 80px)'
            }}
          >
            {/* 白線マーキング */}
            <div className="absolute inset-2 border-2 border-white/80 pointer-events-none rounded-lg" />
            {/* センターサークル */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/80 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/80 -translate-y-1/2 pointer-events-none" />
            {/* ペナルティエリア上 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/80 pointer-events-none" />
            {/* ペナルティエリア下 */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/80 pointer-events-none" />

            {/* 配置された選手たち */}
            {boardPlayers.map(p => {
              const fullData = initialPlayers.find(ip => ip.qid === p.qid);
              return (
                <div
                  key={p.id}
                  onPointerDown={() => handlePointerDown(p.id)}
                  onClick={() => setSelectedDrawerPlayer(fullData || null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex flex-col items-center group transition-transform ${draggedPlayer === p.id ? 'scale-110 z-30' : 'z-20'}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 text-white font-black text-sm border-2 border-white shadow-xl group-hover:border-emerald-400">
                    {p.number}
                    {p.position && (
                      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-amber-400 text-[9px] font-black text-slate-950 border border-slate-900 shadow">
                        {p.position}
                      </span>
                    )}
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-white shadow border border-slate-700/80 whitespace-nowrap max-w-[80px] truncate">
                    {p.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右サイドバー：控え・選手交代候補リスト */}
        <aside className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col h-60 md:h-full shrink-0">
          <div className="p-3 border-b border-slate-800">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1.5">
              ⚽ 選手入れ替え・ベンチ
            </h3>
            {selectedDrawerPlayer ? (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs mb-2">
                <span className="text-slate-400">選択中: </span>
                <span className="font-bold text-white">{selectedDrawerPlayer.name_ja}</span>
                <span className="text-emerald-400 ml-1">（下の一覧から交代選手をクリック）</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 mb-2">
                ピッチ上の選手をクリックして選択し、下の控え選手と交代できます。
              </p>
            )}
            <input
              type="text"
              placeholder="選手名・国籍で検索..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredCandidates.map(candidate => (
              <div
                key={candidate.qid}
                onClick={() => selectedDrawerPlayer && replaceStarterWith(candidate)}
                className={`flex items-center justify-between p-2 rounded-xl border bg-slate-800/60 hover:bg-slate-700/80 transition cursor-pointer ${selectedDrawerPlayer ? 'hover:border-emerald-400 border-slate-700' : 'border-slate-800'}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                    {candidate.image ? (
                      <img src={candidate.image} alt={candidate.name_ja} className="w-full h-full object-cover" />
                    ) : (
                      '⚽'
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{candidate.name_ja}</div>
                    <div className="text-[10px] text-slate-400">{candidate.country_ja} • {candidate.position}</div>
                  </div>
                </div>

                {selectedDrawerPlayer && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black shrink-0">
                    交代
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
