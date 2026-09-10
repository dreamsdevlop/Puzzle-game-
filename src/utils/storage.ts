/**
 * Storage manager mimicking AsyncStorage behavior for offline persistent data:
 * - coins (starts at 300)
 * - completedLevels (array of category IDs)
 * - highScores
 * - soundEnabled
 * - adFrequencyState
 */

const STORAGE_KEYS = {
  COINS: '@word_search_coins',
  COMPLETED_LEVELS: '@word_search_completed_levels',
  HIGH_SCORES: '@word_search_high_scores',
  SOUND_ENABLED: '@word_search_sound_enabled',
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
