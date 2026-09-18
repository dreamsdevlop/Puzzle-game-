import { Capacitor } from '@capacitor/core';

type CrazyEnvironment = 'local' | 'crazygames' | 'disabled' | string;
type AdType = 'midgame' | 'rewarded';

type AdCallbacks = {
  adStarted?: () => void;
  adFinished?: () => void;
  adError?: (error?: unknown, errorData?: { reason?: string; message?: string }) => void;
};

type CrazyGamesSDK = {
  getEnvironment: () => Promise<CrazyEnvironment>;
  game: {
    gameplayStart: () => void;
    gameplayStop: () => void;
  };
  ad: {
    requestAd: (type: AdType, callbacks: AdCallbacks) => void;
  };
  banner: {
    requestResponsiveBanner: (containerId: string) => Promise<void>;
  };
};

declare global {
  interface Window {
    CrazyGames?: { SDK?: CrazyGamesSDK };
  }
}

let loadPromise: Promise<CrazyEnvironment> | null = null;
let environment: CrazyEnvironment = 'disabled';
let gameplayActive = false;

export function isCrazyGamesHost(): boolean {
  return typeof window !== 'undefined' && /(^|\.)crazygames\.com$/i.test(window.location.hostname);
}

function canUseCrazyGames(): boolean {
  return typeof window !== 'undefined' && !Capacitor.isNativePlatform();
}

async function loadSdk(): Promise<CrazyEnvironment> {
  if (!canUseCrazyGames()) return 'disabled';
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<CrazyEnvironment>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-crazygames-sdk]');
    const finish = async () => {
      try {
        const sdk = window.CrazyGames?.SDK;
        environment = sdk ? await sdk.getEnvironment() : 'disabled';
      } catch (error) {
        console.info('[CrazyGames] SDK unavailable:', error);
        environment = 'disabled';
      }
      resolve(environment);
    };

    if (existing) {
      if (window.CrazyGames?.SDK) void finish();
      else existing.addEventListener('load', () => void finish(), { once: true });
      existing.addEventListener('error', () => resolve('disabled'), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.crazygames.com/crazygames-sdk-v2.js';
    script.async = true;
    script.dataset.crazygamesSdk = 'true';
    script.onload = () => void finish();
    script.onerror = () => {
      environment = 'disabled';
      resolve(environment);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

async function getSdkForCrazyGames(): Promise<CrazyGamesSDK | null> {
  const currentEnvironment = await loadSdk();
  if (currentEnvironment !== 'crazygames') return null;
  return window.CrazyGames?.SDK ?? null;
}

export const CrazyGamesManager = {
  async initialize(): Promise<boolean> {
    return Boolean(await getSdkForCrazyGames());
  },

  async gameplayStart(): Promise<void> {
    const sdk = await getSdkForCrazyGames();
    if (!sdk || gameplayActive) return;
    sdk.game.gameplayStart();
    gameplayActive = true;
  },

  async gameplayStop(): Promise<void> {
    const sdk = await getSdkForCrazyGames();
    if (!sdk || !gameplayActive) return;
    sdk.game.gameplayStop();
    gameplayActive = false;
  },

  async requestVideoAd(type: AdType, callbacks: AdCallbacks): Promise<boolean> {
    const sdk = await getSdkForCrazyGames();
    if (!sdk) return false;

    await this.gameplayStop();
    return new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (shown: boolean) => {
        if (settled) return;
        settled = true;
        void this.gameplayStart();
        resolve(shown);
      };

      try {
        sdk.ad.requestAd(type, {
          adStarted: callbacks.adStarted,
          adFinished: () => {
            callbacks.adFinished?.();
            finish(true);
          },
          adError: (error, errorData) => {
            callbacks.adError?.(error, errorData);
            finish(false);
          },
        });
      } catch (error) {
        callbacks.adError?.(error);
        finish(false);
      }
    });
  },

  async requestResponsiveBanner(containerId: string): Promise<boolean> {
    const sdk = await getSdkForCrazyGames();
    if (!sdk) return false;
    try {
      await sdk.banner.requestResponsiveBanner(containerId);
      return true;
    } catch (error) {
      console.info('[CrazyGames] Banner unavailable:', error);
      return false;
    }
  },
};

export default CrazyGamesManager;
