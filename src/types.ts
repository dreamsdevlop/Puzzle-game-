export type GameMode = 'classic' | 'time';

export type Screen = 'home' | 'category_select' | 'mode_select' | 'game' | 'results';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  words: string[];
}

export interface GridCoord {
  row: number;
  col: number;
}

export interface PlacedWord {
  word: string;
  start: GridCoord;
  end: GridCoord;
  direction: [number, number]; // [dRow, dCol]
  coords: GridCoord[];
}

export interface FoundWord {
  word: string;
  color: string;
  coords: GridCoord[];
}

export interface WordColor {
  name: string;
  hex: string;
  bgRgba: string;
  textClass: string;
  borderClass: string;
}

export interface AdMobConfig {
  appId: string;
  interstitialId: string;
  rewardedId: string;
  interstitialFrequencyCap: number; // every 2nd eligible trigger
  interstitialMinIntervalSeconds: number; // 60 seconds
}
