/// <reference types="vite/client" />

import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

export interface AdMobUnitConfig {
  appName: string;
  publisherId: string;
  appId: string;
  bannerId: string;
  bannerFallbackId?: string;
  bannerName: string;
  interstitialId: string;
  rewardedId: string;
  rewardedName: string;
}

export const ADMOB_PRODUCTION_CONFIG: AdMobUnitConfig = {
  appName: 'Game puzzle',
  publisherId: 'pub-8857493053340063',
  appId: 'ca-app-pub-8857493053340063~9438377409',
  bannerId: 'ca-app-pub-8857493053340063/5636350884',
  bannerFallbackId: 'ca-app-pub-8857493053340063/5307560708',
  bannerName: 'Puzzle Game Banner',
  interstitialId: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID || '',
  rewardedId: import.meta.env.VITE_ADMOB_REWARDED_ID || 'ca-app-pub-8857493053340063/3042053114',
  rewardedName: 'Puzzle Game Rewarded Ad',
};

let initialized = false;
let consentReady = false;
let bannerVisible = false;
let diagnosticsAttached = false;

const isNative = () => Capacitor.isNativePlatform();

async function attachDiagnostics(): Promise<void> {
  if (!isNative() || diagnosticsAttached) return;
  diagnosticsAttached = true;
  const addListener = AdMob.addListener.bind(AdMob) as (
    eventName: string,
    listener: (payload?: unknown) => void,
  ) => Promise<unknown>;

  await addListener(BannerAdPluginEvents.Loaded, (info) => {
    console.info('[AdMob] Banner loaded:', info);
  });
  await addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
    console.warn('[AdMob] Banner failed to load:', error);
  });
  await addListener(BannerAdPluginEvents.AdImpression, (data) => {
    console.info('[AdMob] Banner impression:', data);
  });
  await addListener(RewardAdPluginEvents.Loaded, (info) => {
    console.info('[AdMob] Rewarded ad loaded:', info);
  });
  await addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
    console.warn('[AdMob] Rewarded ad failed to load:', error);
  });
  await addListener(RewardAdPluginEvents.FailedToShow, (error) => {
    console.warn('[AdMob] Rewarded ad failed to show:', error);
  });
  await addListener(RewardAdPluginEvents.Rewarded, (reward) => {
    console.info('[AdMob] Reward earned:', reward);
  });
}

async function ensureReady(): Promise<boolean> {
  if (!isNative()) return false;
  if (initialized && consentReady) return true;

  try {
    await attachDiagnostics();
    if (!initialized) {
      await AdMob.initialize({
        initializeForTesting: false,
      });
      initialized = true;
    }

    const consentInfo = await AdMob.requestConsentInfo();
    let currentConsent = consentInfo;
    if (
      currentConsent.isConsentFormAvailable &&
      currentConsent.status === AdmobConsentStatus.REQUIRED
    ) {
      currentConsent = await AdMob.showConsentForm();
    }

    if (!currentConsent.canRequestAds) return false;

    consentReady = true;
    return true;
  } catch (error) {
    console.warn('[AdMob] Initialization skipped:', error);
    return false;
  }
}

export const AdMobManager = {
  getActiveConfig(): AdMobUnitConfig {
    return ADMOB_PRODUCTION_CONFIG;
  },

  isNative,

  async initialize(): Promise<boolean> {
    return ensureReady();
  },

  async showBanner(): Promise<boolean> {
    if (!(await ensureReady())) return false;
    const bannerIds = [
      ADMOB_PRODUCTION_CONFIG.bannerId,
      ADMOB_PRODUCTION_CONFIG.bannerFallbackId,
    ].filter((id): id is string => Boolean(id));

    for (const adId of bannerIds) {
      try {
        await AdMob.showBanner({
          adId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
        bannerVisible = true;
        return true;
      } catch (error) {
        console.warn(`[AdMob] Banner unit ${adId} unavailable:`, error);
      }
    }

    console.warn('[AdMob] No banner unit returned an ad. Check app readiness, account status, consent, and ad-unit activation in AdMob.');
    return false;
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
    if (!ADMOB_PRODUCTION_CONFIG.interstitialId || !(await ensureReady())) return false;
    try {
      await AdMob.prepareInterstitial({ adId: ADMOB_PRODUCTION_CONFIG.interstitialId });
      await AdMob.showInterstitial({ adId: ADMOB_PRODUCTION_CONFIG.interstitialId });
      return true;
    } catch (error) {
      console.warn('[AdMob] Interstitial unavailable:', error);
      return false;
    }
  },

  async showRewarded(): Promise<boolean> {
    if (!ADMOB_PRODUCTION_CONFIG.rewardedId || !(await ensureReady())) return false;
    try {
      await AdMob.prepareRewardVideoAd({ adId: ADMOB_PRODUCTION_CONFIG.rewardedId });
      const reward = await AdMob.showRewardVideoAd({ adId: ADMOB_PRODUCTION_CONFIG.rewardedId });
      return Boolean(reward && reward.amount > 0);
    } catch (error) {
      console.warn('[AdMob] Rewarded ad unavailable. Check app readiness, consent, and rewarded-unit activation:', error);
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
