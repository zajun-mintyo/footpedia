import { Player } from '@/types/player';

// 全収録国＋互換コードを網羅した統一国旗マップ
export const COUNTRY_FLAGS: Record<string, string> = {
  JPN: '🇯🇵',
  BRA: '🇧🇷',
  ARG: '🇦🇷',
  FRA: '🇫🇷',
  DEU: '🇩🇪',
  GBR: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  NIR: '🇬🇧',
  ESP: '🇪🇸',
  ITA: '🇮🇹',
  PRT: '🇵🇹',
  NLD: '🇳🇱',
  URY: '🇺🇾',
  COL: '🇨🇴',
  CHL: '🇨🇱',
  SWE: '🇸🇪',
  HRV: '🇭🇷',
  CRO: '🇭🇷',
  ROU: '🇷🇴',
  BGR: '🇧🇬',
  CIV: '🇨🇮',
  GHA: '🇬🇭',
  CMR: '🇨🇲',
  KOR: '🇰🇷',
  IRN: '🇮🇷',
  SRB: '🇷🇸',
  DNK: '🇩🇰',
  UKR: '🇺🇦',
  CZE: '🇨🇿',
  POL: '🇵🇱',
  PRY: '🇵🇾',
  PAR: '🇵🇾',
  BEL: '🇧🇪',
  NOR: '🇳🇴',
  AUT: '🇦🇹',
  NGA: '🇳🇬',
  MEX: '🇲🇽',
  USA: '🇺🇸',
  SEN: '🇸🇳',
  EGY: '🇪🇬',
  LBR: '🇱🇷',
  DZA: '🇩🇿',
  GAB: '🇬🇦',
  MAR: '🇲🇦',
  CRI: '🇨🇷',
  RUS: '🇷🇺',
  TUR: '🇹🇷',
  BIH: '🇧🇦',
};

// 全画面共通のポジションカラーテーマ
export const POSITION_THEMES: Record<string, { badge: string; border: string; label: string }> = {
  FW: {
    badge: 'bg-rose-500 text-white',
    border: 'border-rose-400/40 hover:border-rose-500',
    label: 'FW (フォワード)',
  },
  MF: {
    badge: 'bg-emerald-500 text-white',
    border: 'border-emerald-400/40 hover:border-emerald-500',
    label: 'MF (ミッドフィールダー)',
  },
  DF: {
    badge: 'bg-sky-500 text-white',
    border: 'border-sky-400/40 hover:border-sky-500',
    label: 'DF (ディフェンダー)',
  },
  GK: {
    badge: 'bg-amber-500 text-slate-900',
    border: 'border-amber-400/40 hover:border-amber-500',
    label: 'GK (ゴールキーパー)',
  },
};

// 生年月日の統一フォーマット
export function formatBirthDate(dateStr?: string, yearNum?: number): string {
  if (dateStr) {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}年${parseInt(match[2], 10)}月${parseInt(match[3], 10)}日`;
    }
  }
  if (yearNum) {
    return `${yearNum}年生`;
  }
  return '-';
}

// 選手の国旗アイコン取得
export function getPlayerFlag(player: Player): string {
  if (player.is_women) return '🌸';
  return COUNTRY_FLAGS[player.country_code] || '🌐';
}

// 選手の代表表記名取得
export function getCountryDisplayName(player: Player): string {
  if (player.is_women) return '日本女子（なでしこジャパン）';
  return `${player.country_ja} 代表`;
}

// 選手の所属クラブ遍歴配列取得
export function getPlayerClubs(player: Player): string[] {
  return player.teams_full || player.teams || [];
}

// 選手のプレースタイル・キャリア概要テキスト取得
export function getPlayerPrimaryStyle(player: Player): string {
  return (
    player.bio_rich ||
    player.style_rich ||
    player.style_summary ||
    player.desc_ja ||
    '世界的な名手としてフットボール史に刻まれるレジェンド。'
  );
}
