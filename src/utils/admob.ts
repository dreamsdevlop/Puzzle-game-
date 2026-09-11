/**
 * AdMob Configuration & Cross-Platform Management Utility
 * 
 * Supports:
 * - Google AdMob Mobile IDs (Android / iOS via Capacitor)
 * - Google AdSense / AdMob Web Publisher IDs
 * - Google Official Test Ad Units for safe sandbox testing
 * - app-ads.txt validation
 */

export interface AdMobUnitConfig {
  appName: string;
  publisherId: string;
  appId: string;
  bannerId: string;
  bannerName: string;
  interstitialId: string;
  rewardedId: string;
  rewardedName: string;
}

// Production Google AdMob Units
export const ADMOB_PRODUCTION_CONFIG: AdMobUnitConfig = {
  appName: 'Game puzzle',
  publisherId: 'pub-8857493053340063',
  appId: 'ca-app-pub-8857493053340063~9438377409',
  bannerId: 'ca-app-pub-8857493053340063/5307560708',
  bannerName: 'Banner add',
  interstitialId: 'ca-app-pub-8857493053340063/3042053114',
  rewardedId: 'ca-app-pub-8857493053340063/3042053114',
  rewardedName: 'King reward ads',
};

// Official Google Sample Test Ad Units (safe for development)
export const ADMOB_TEST_CONFIG: AdMobUnitConfig = {
  appName: 'Game puzzle (Test Mode)',
  publisherId: 'pub-3940256099942544',
  appId: 'ca-app-pub-3940256099942544~3347511713',
  bannerId: 'ca-app-pub-3940256099942544/6300978111',
  bannerName: 'Sample Test Banner',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  rewardedName: 'Sample Test Rewarded Video',
};

const TEST_MODE_KEY = '@word_search_admob_test_mode';

export const AdMobManager = {
  getProductionConfig(): AdMobUnitConfig {
    return ADMOB_PRODUCTION_CONFIG;
  },

  isTestMode(): boolean {
    try {
      const stored = localStorage.getItem(TEST_MODE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  },

  setTestMode(enabled: boolean): void {
    try {
      localStorage.setItem(TEST_MODE_KEY, String(enabled));
    } catch {}
  },

  getActiveConfig(): AdMobUnitConfig {
    return this.isTestMode() ? ADMOB_TEST_CONFIG : ADMOB_PRODUCTION_CONFIG;
  },

  /**
   * Initializes native Capacitor AdMob if available in native runtime.
   */
  async initNativeAdMob(): Promise<boolean> {
    try {
      const capacitor = (window as unknown as { Capacitor?: { isPluginAvailable: (name: string) => boolean } })?.Capacitor;
      if (capacitor && capacitor.isPluginAvailable('AdMob')) {
        console.log('[AdMob] Native Capacitor AdMob plugin detected.');
        return true;
      }
    } catch (e) {
      console.warn('[AdMob] Native check skipped:', e);
    }
    return false;
  },

  /**
   * Status check of app-ads.txt
   */
  async checkAppAdsTxt(): Promise<{ exists: boolean; content?: string }> {
    try {
      const res = await fetch('/app-ads.txt');
      if (res.ok) {
        const text = await res.text();
        return { exists: true, content: text.trim() };
      }
    } catch {}
    return { exists: false };
  },
};
