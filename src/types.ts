export type GameMode = 'classic' | 'time' | 'daily';

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

export interface DailyChallengeDef {
  isDaily: true;
  dateKey: string; // 'YYYY-MM-DD'
  formattedDate: string; // e.g. 'Friday, Sep 11'
  dayOfWeek: string;
  theme: string;
  emoji: string;
  tier: DifficultyTier;
  gridSize: number;
  words: string[];
  allowedDirections: [number, number][];
  brainPerk: string;
  targetSeconds: number;
  coinReward: number;
  sequenceId: string;
}

export interface DailyChallengeRecord {
  dateKey: string;
  completed: boolean;
  score: number;
  timeTakenSeconds: number;
  stars: number;
  completedAt: number;
}

export interface DailyStreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
  totalCompleted: number;
  isCompletedToday: boolean;
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

export type ShopTab = 'wallpapers' | 'tile_themes';

export interface GameWallpaper {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number; // 0 for default
  previewGradient: string;
  backgroundCssLight: string;
  backgroundCssDark: string;
  cardBgClass: string;
  accentColor: string;
  textColorLight?: string;
  textColorDark?: string;
  badge?: string;
  rarity?: 'standard' | 'rare' | 'legendary' | 'mythic';
}

export interface TileTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number; // 0 for default
  previewBg: string;
  tileBgClass: string;
  tileTextClass: string;
  tileBorderClass: string;
  gridContainerClass: string;
  selectedBgClass: string;
  selectedTextClass: string;
  highlightGlow: string;
  badge?: string;
  rarity?: 'standard' | 'rare' | 'legendary' | 'mythic';
}

export interface CustomizationState {
  equippedWallpaperId: string;
  equippedTileThemeId: string;
  purchasedWallpaperIds: string[];
  purchasedTileThemeIds: string[];
}
