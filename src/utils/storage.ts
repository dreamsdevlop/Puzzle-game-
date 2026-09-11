/**
 * Storage manager mimicking AsyncStorage behavior for offline persistent data:
 * - coins (starts at 300)
 * - completedLevels (array of category IDs)
 * - highScores
 * - soundEnabled
 * - adFrequencyState
 */

import { AudioSettings, DailyChallengeRecord, DailyStreakInfo, LevelStarRecord, MusicTrackId, Theme } from '../types.ts';

const STORAGE_KEYS = {
  COINS: '@word_search_coins',
  COMPLETED_LEVELS: '@word_search_completed_levels',
  LEVEL_PROGRESS: '@word_search_level_progress',
  CLAIMED_MILESTONES: '@word_search_claimed_milestones',
  HIGH_SCORES: '@word_search_high_scores',
  SOUND_ENABLED: '@word_search_sound_enabled',
  SFX_VOLUME: '@word_search_sfx_volume',
  MUSIC_ENABLED: '@word_search_music_enabled',
  MUSIC_VOLUME: '@word_search_music_volume',
  MUSIC_TRACK: '@word_search_music_track',
  HAPTICS_ENABLED: '@word_search_haptics_enabled',
  THEME: '@word_search_theme',
  AD_STATE: '@word_search_ad_state',
  DAILY_RECORDS: '@word_search_daily_records',
  DAILY_STREAK: '@word_search_daily_streak',
};

export interface AdState {
  triggerCount: number;
  lastInterstitialTimestamp: number;
}

export const Storage = {
  getCoins(): number {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COINS);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        return isNaN(parsed) ? 300 : parsed;
      }
    } catch {
      // fallback
    }
    return 300;
  },

  setCoins(coins: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
    } catch {
      // fallback
    }
  },

  addCoins(amount: number): number {
    const current = this.getCoins();
    const updated = Math.max(0, current + amount);
    this.setCoins(updated);
    return updated;
  },

  getLevelProgress(): Record<number, LevelStarRecord> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEVEL_PROGRESS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  },

  getHighestUnlockedLevel(): number {
    const progress = this.getLevelProgress();
    const completedLevelNumbers = Object.keys(progress).map((k) => parseInt(k, 10));
    if (completedLevelNumbers.length === 0) return 1;
    const maxCompleted = Math.max(...completedLevelNumbers);
    return maxCompleted + 1;
  },

  saveLevelProgress(
    levelNumber: number,
    stars: number,
    score: number,
    timeSeconds: number,
  ): { isNewLevel: boolean; newStarsEarned: number } {
    const progress = this.getLevelProgress();
    const existing = progress[levelNumber];
    const isNewLevel = !existing;
    const prevStars = existing ? existing.stars : 0;
    const newStarsEarned = Math.max(0, stars - prevStars);

    const updatedRecord: LevelStarRecord = {
      stars: Math.max(prevStars, stars),
      bestScore: Math.max(existing?.bestScore || 0, score),
      bestTimeSeconds: existing
        ? Math.min(existing.bestTimeSeconds, timeSeconds)
        : timeSeconds,
      completedAt: Date.now(),
    };

    progress[levelNumber] = updatedRecord;

    try {
      localStorage.setItem(STORAGE_KEYS.LEVEL_PROGRESS, JSON.stringify(progress));
    } catch {
      // fallback
    }

    return { isNewLevel, newStarsEarned };
  },

  getClaimedMilestones(): number[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMED_MILESTONES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  },

  claimMilestone(levelNumber: number): number[] {
    const claimed = this.getClaimedMilestones();
    if (!claimed.includes(levelNumber)) {
      const updated = [...claimed, levelNumber];
      try {
        localStorage.setItem(STORAGE_KEYS.CLAIMED_MILESTONES, JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    }
    return claimed;
  },

  getCompletedLevels(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  },

  markLevelCompleted(categoryId: string): string[] {
    const list = this.getCompletedLevels();
    if (!list.includes(categoryId)) {
      const updated = [...list, categoryId];
      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(updated));
      } catch {
        // fallback
      }
      return updated;
    }
    return list;
  },

  getSoundEnabled(): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // fallback
    }
    return true;
  },

  setSoundEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled.toString());
    } catch {
      // fallback
    }
  },

  getSfxVolume(): number {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SFX_VOLUME);
      if (saved !== null) {
        const val = parseFloat(saved);
        return isNaN(val) ? 0.75 : Math.max(0, Math.min(1, val));
      }
    } catch {
      // fallback
    }
    return 0.75;
  },

  setSfxVolume(volume: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SFX_VOLUME, volume.toString());
    } catch {
      // fallback
    }
  },

  getMusicEnabled(): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MUSIC_ENABLED);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // fallback
    }
    return true; // Default to relaxing background music enabled
  },

  setMusicEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_ENABLED, enabled.toString());
    } catch {
      // fallback
    }
  },

  getMusicVolume(): number {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME);
      if (saved !== null) {
        const val = parseFloat(saved);
        return isNaN(val) ? 0.4 : Math.max(0, Math.min(1, val));
      }
    } catch {
      // fallback
    }
    return 0.4;
  },

  setMusicVolume(volume: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, volume.toString());
    } catch {
      // fallback
    }
  },

  getMusicTrack(): MusicTrackId {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MUSIC_TRACK) as MusicTrackId;
      if (saved && ['zen', 'ocean', 'lofi', 'celestial', 'rain'].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'zen';
  },

  setMusicTrack(track: MusicTrackId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_TRACK, track);
    } catch {
      // fallback
    }
  },

  getHapticsEnabled(): boolean {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // fallback
    }
    return true;
  },

  setHapticsEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, enabled.toString());
    } catch {
      // fallback
    }
  },

  getAudioSettings(): AudioSettings {
    return {
      sfxEnabled: this.getSoundEnabled(),
      sfxVolume: this.getSfxVolume(),
      musicEnabled: this.getMusicEnabled(),
      musicVolume: this.getMusicVolume(),
      currentTrackId: this.getMusicTrack(),
      hapticsEnabled: this.getHapticsEnabled(),
    };
  },

  getTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  },

  setTheme(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // fallback
    }
  },

  getAdState(): AdState {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AD_STATE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      triggerCount: 0,
      lastInterstitialTimestamp: 0,
    };
  },

  setAdState(state: AdState): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AD_STATE, JSON.stringify(state));
    } catch {
      // fallback
    }
  },

  /**
   * Evaluates if interstitial ad should show:
   * "show every 2nd eligible trigger, minimum 60-second interval"
   */
  shouldShowInterstitial(): boolean {
    const state = this.getAdState();
    const newCount = state.triggerCount + 1;
    const now = Date.now();
    const elapsedSeconds = (now - state.lastInterstitialTimestamp) / 1000;

    const isEvery2nd = newCount % 2 === 0;
    const meetsInterval = state.lastInterstitialTimestamp === 0 || elapsedSeconds >= 60;

    if (isEvery2nd && meetsInterval) {
      this.setAdState({
        triggerCount: newCount,
        lastInterstitialTimestamp: now,
      });
      return true;
    }

    this.setAdState({
      triggerCount: newCount,
      lastInterstitialTimestamp: state.lastInterstitialTimestamp,
    });
    return false;
  },

  // ==================== DAILY CHALLENGE PERSISTENCE ====================
  getDailyRecords(): Record<string, DailyChallengeRecord> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  },

  getDailyRecord(dateKey: string): DailyChallengeRecord | null {
    const records = this.getDailyRecords();
    return records[dateKey] || null;
  },

  getDailyStreak(todayDateKey: string): DailyStreakInfo {
    let currentStreak = 0;
    let bestStreak = 0;
    let lastCompletedDate: string | null = null;
    let totalCompleted = 0;

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DAILY_STREAK);
      if (raw) {
        const parsed = JSON.parse(raw);
        currentStreak = typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0;
        bestStreak = typeof parsed.bestStreak === 'number' ? parsed.bestStreak : 0;
        lastCompletedDate = parsed.lastCompletedDate || null;
        totalCompleted = typeof parsed.totalCompleted === 'number' ? parsed.totalCompleted : 0;
      }
    } catch {
      // fallback
    }

    // Determine if today is completed or streak has lapsed
    let isCompletedToday = false;
    if (lastCompletedDate === todayDateKey) {
      isCompletedToday = true;
    } else if (lastCompletedDate) {
      // Check if lastCompletedDate was yesterday
      const [y, m, d] = todayDateKey.split('-').map(Number);
      const yesterday = new Date(y, m - 1, d);
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (lastCompletedDate !== yKey) {
        // Streak lapsed since it wasn't completed yesterday
        currentStreak = 0;
      }
    }

    return {
      currentStreak,
      bestStreak,
      lastCompletedDate,
      totalCompleted,
      isCompletedToday,
    };
  },

  saveDailyCompletion(record: DailyChallengeRecord): {
    streak: number;
    isFirstToday: boolean;
    bonusCoins: number;
  } {
    const todayKey = record.dateKey;
    const records = this.getDailyRecords();
    const existing = records[todayKey];
    const isFirstToday = !existing || !existing.completed;

    // Save or update record with best score/time
    records[todayKey] = {
      dateKey: todayKey,
      completed: true,
      score: Math.max(existing?.score || 0, record.score),
      timeTakenSeconds: existing
        ? Math.min(existing.timeTakenSeconds, record.timeTakenSeconds)
        : record.timeTakenSeconds,
      stars: Math.max(existing?.stars || 0, record.stars),
      completedAt: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
    } catch {
      // fallback
    }

    // Compute streak update
    const currentStreakInfo = this.getDailyStreak(todayKey);
    let newStreak = currentStreakInfo.currentStreak;
    let bonusCoins = 0;

    if (isFirstToday) {
      if (currentStreakInfo.lastCompletedDate) {
        const [y, m, d] = todayKey.split('-').map(Number);
        const yesterday = new Date(y, m - 1, d);
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

        if (currentStreakInfo.lastCompletedDate === yKey) {
          newStreak = currentStreakInfo.currentStreak + 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const updatedBestStreak = Math.max(currentStreakInfo.bestStreak, newStreak);
      const updatedTotal = currentStreakInfo.totalCompleted + 1;

      try {
        localStorage.setItem(
          STORAGE_KEYS.DAILY_STREAK,
          JSON.stringify({
            currentStreak: newStreak,
            bestStreak: updatedBestStreak,
            lastCompletedDate: todayKey,
            totalCompleted: updatedTotal,
          }),
        );
      } catch {
        // fallback
      }

      // Base daily reward (120 coins) + streak bonus (10 coins per day up to 100 extra)
      bonusCoins = 120 + Math.min(100, newStreak * 10);
      this.addCoins(bonusCoins);
    }

    return {
      streak: newStreak,
      isFirstToday,
      bonusCoins,
    };
  },
};
