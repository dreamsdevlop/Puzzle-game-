/// <reference types="vite/client" />

import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

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

export const ADMOB_PRODUCTION_CONFIG: AdMobUnitConfig = {
  appName: 'Game puzzle',
  publisherId: 'pub-8857493053340063',
  appId: 'ca-app-pub-8857493053340063~9438377409',
  bannerId: 'ca-app-pub-8857493053340063/5307560708',
  bannerName: 'Banner ad',
  interstitialId: 'ca-app-pub-8857493053340063/3042053114',
  rewardedId: import.meta.env.VITE_ADMOB_REWARDED_ID || '',
  rewardedName: 'Rewarded ad',
};

export const ADMOB_TEST_CONFIG: AdMobUnitConfig = {
  appName: 'Game puzzle (Test Mode)',
  publisherId: 'pub-3940256099942544',
  appId: 'ca-app-pub-3940256099942544~3347511713',
  bannerId: 'ca-app-pub-3940256099942544/6300978111',
  bannerName: 'Sample test banner',
  interstitialId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedId: 'ca-app-pub-3940256099942544/5224354917',
  rewardedName: 'Sample test rewarded ad',
};

const TEST_MODE_KEY = '@word_search_admob_test_mode';
let initialized = false;
let consentReady = false;
let bannerVisible = false;

const isNative = () => Capacitor.isNativePlatform();

const isBuildTestMode = () => import.meta.env.VITE_ADMOB_TEST_MODE === 'true' || import.meta.env.DEV;

async function ensureReady(): Promise<boolean> {
  if (!isNative()) return false;
  if (initialized && consentReady) return true;

  try {
    const consentInfo = await AdMob.requestConsentInfo();
    let currentConsent = consentInfo;
    if (
      currentConsent.isConsentFormAvailable &&
      currentConsent.status === AdmobConsentStatus.REQUIRED
    ) {
      currentConsent = await AdMob.showConsentForm();
    }

    if (!currentConsent.canRequestAds) return false;

    await AdMob.initialize({
      initializeForTesting: isBuildTestMode() || AdMobManager.isTestMode(),
      testingDevices: ['EMULATOR'],
    });
    initialized = true;
    consentReady = true;
    return true;
  } catch (error) {
    console.warn('[AdMob] Initialization skipped:', error);
    return false;
  }
}

export const AdMobManager = {
  getProductionConfig(): AdMobUnitConfig {
    return ADMOB_PRODUCTION_CONFIG;
  },

  isTestMode(): boolean {
    try {
      return isBuildTestMode() || localStorage.getItem(TEST_MODE_KEY) === 'true';
    } catch {
      return isBuildTestMode();
    }
  },

  setTestMode(enabled: boolean): void {
    try {
      localStorage.setItem(TEST_MODE_KEY, String(enabled));
    } catch {
      // Native ad configuration still falls back to build-time mode.
    }
  },

  getActiveConfig(): AdMobUnitConfig {
    return this.isTestMode() ? ADMOB_TEST_CONFIG : ADMOB_PRODUCTION_CONFIG;
  },

  isNative,

  async initialize(): Promise<boolean> {
    return ensureReady();
  },

  async showBanner(): Promise<boolean> {
    if (!(await ensureReady())) return false;
    try {
      await AdMob.showBanner({
        adId: this.getActiveConfig().bannerId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
      bannerVisible = true;
      return true;
    } catch (error) {
      console.warn('[AdMob] Banner unavailable:', error);
      return false;
    }
  },

  async hideBanner(): Promise<void> {
    if (!isNative() || !bannerVisible) return;
    try {
      await AdMob.hideBanner();
      bannerVisible = false;
    } catch (error) {
      console.warn('[AdMob] Banner hide failed:', error);
    }
  },

  async removeBanner(): Promise<void> {
    if (!isNative()) return;
    try {
      await AdMob.removeBanner();
      bannerVisible = false;
    } catch (error) {
      console.warn('[AdMob] Banner removal failed:', error);
    }
  },

  async showInterstitial(): Promise<boolean> {
    if (!(await ensureReady())) return false;
    try {
      const adId = this.getActiveConfig().interstitialId;
      await AdMob.prepareInterstitial({ adId });
      await AdMob.showInterstitial({ adId });
      return true;
    } catch (error) {
      console.warn('[AdMob] Interstitial unavailable:', error);
      return false;
    }
  },

  async showRewarded(): Promise<boolean> {
    if (!(await ensureReady())) return false;
    try {
      const adId = this.getActiveConfig().rewardedId;
      if (!adId) return false;
      await AdMob.prepareRewardVideoAd({ adId });
      await AdMob.showRewardVideoAd({ adId });
      return true;
    } catch (error) {
      console.warn('[AdMob] Rewarded ad unavailable:', error);
      return false;
    }
  },

  async showPrivacyOptions(): Promise<void> {
    if (!isNative()) return;
    try {
      await AdMob.showPrivacyOptionsForm();
    } catch (error) {
      console.warn('[AdMob] Privacy options unavailable:', error);
    }
  },

  async checkAppAdsTxt(): Promise<{ exists: boolean; content?: string }> {
    try {
      const res = await fetch('/app-ads.txt');
      if (res.ok) return { exists: true, content: (await res.text()).trim() };
    } catch {
      // app-ads.txt is optional for native-only builds.
    }
    return { exists: false };
  },
};
