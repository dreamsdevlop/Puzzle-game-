/**
 * Storage manager mimicking AsyncStorage behavior for offline persistent data:
 * - coins (starts at 300)
 * - completedLevels (array of category IDs)
 * - highScores
 * - soundEnabled
 * - adFrequencyState
 */

import { LevelStarRecord, Theme } from '../types.ts';

const STORAGE_KEYS = {
  COINS: '@word_search_coins',
  COMPLETED_LEVELS: '@word_search_completed_levels',
  LEVEL_PROGRESS: '@word_search_level_progress',
  CLAIMED_MILESTONES: '@word_search_claimed_milestones',
  HIGH_SCORES: '@word_search_high_scores',
  SOUND_ENABLED: '@word_search_sound_enabled',
  THEME: '@word_search_theme',
  AD_STATE: '@word_search_ad_state',
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
};
