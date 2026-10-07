export interface BallonDorInfo {
  count: number;
  years: number[];
  special?: string;
  is_honorary?: boolean;
}

export interface GoldenBootDetail {
  year: number;
  goals: number;
  tournament?: string;
}

export interface WorldCupHonors {
  is_winner?: boolean;
  winner_years?: number[];
  winner_count?: number;
  is_golden_boot?: boolean;
  golden_boot_info?: GoldenBootDetail[];
}

export interface LeagueMvpInfo {
  league?: string;
  award?: string;
  years?: number[];
  year?: number;
  count?: number;
}

export interface Player {
  qid: string;
  name_ja: string;
  name_en: string;
  desc_ja?: string;
  birth_date?: string;
  birth_year?: number;
  active_decade?: number;
  country_code: string;
  country_ja: string;
  position: 'FW' | 'MF' | 'DF' | 'GK';
  position_detail?: string;
  image?: string;
  teams: string[];
  teams_full?: string[];
  sitelinks?: number;
  name_ja_ruby: string;
  name_ja_kana: string;
  is_women?: boolean;
  // エンリッチ項目
  ballon_dor?: BallonDorInfo | null;
  world_cup?: WorldCupHonors | null;
  league_mvp?: (LeagueMvpInfo | string)[] | null;
  height?: number | null;
  preferred_foot?: string;
  jersey_number?: number | null;
  wiki_url?: string;
  style_summary?: string;
  // リッチ詳細項目
  nickname?: string;
  birth_place?: string;
  intl_caps?: number | null;
  intl_goals?: number | null;
  intl_summary?: string;
  style_rich?: string;
  bio_rich?: string;
}
