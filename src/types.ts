export type GameMode = 'classic' | 'time';

export type Screen = 'home' | 'category_select' | 'level_map' | 'mode_select' | 'game' | 'results';

export type Theme = 'light' | 'dark';

export type MusicTrackId = 'zen' | 'ocean' | 'lofi' | 'celestial' | 'rain';

export interface MusicTrack {
  id: MusicTrackId;
  name: string;
  emoji: string;
  description: string;
  vibe: string;
}

export interface AudioSettings {
  sfxEnabled: boolean;
  sfxVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  currentTrackId: MusicTrackId;
  hapticsEnabled: boolean;
}

export type DifficultyTier = 'Warm-Up' | 'Pattern Hunter' | 'Focus & Flow' | 'Synapse Surge' | 'Cognitive Master' | 'Genius Mind';

export interface LevelDef {
  levelNumber: number;
  title: string;
  theme: string;
  emoji: string;
  tier: DifficultyTier;
  stage: number;
  gridSize: number;
  words: string[];
  allowedDirections: [number, number][];
  brainPerk: string;
  targetSeconds: number; // reference for 3 stars
  coinReward: number;
  milestone?: boolean;
}

export interface LevelStarRecord {
  stars: number; // 1, 2, or 3
  bestScore: number;
  bestTimeSeconds: number;
  completedAt: number;
}

export interface BrainStats {
  sharpnessRating: number; // e.g. 100 - 300+
  brainRank: string; // e.g. "Novice Observer", "Pattern Hunter", etc.
  totalWordsFound: number;
  bestCombo: number;
  levelsCompletedCount: number;
  threeStarCount: number;
}

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
