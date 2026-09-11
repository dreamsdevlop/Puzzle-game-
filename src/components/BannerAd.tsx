import { useEffect } from 'react';
import { AdMobManager } from '../utils/admob.ts';

interface BannerAdProps {
  className?: string;
  visible?: boolean;
}

export function BannerAd({ className = '', visible = true }: BannerAdProps) {
  useEffect(() => {
    if (!visible) {
      void AdMobManager.hideBanner();
      return;
    }

    void AdMobManager.showBanner();
    return () => {
      void AdMobManager.hideBanner();
    };
  }, [visible]);

  if (!AdMobManager.isNative() || !visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`h-[60px] w-full shrink-0 bg-transparent ${className}`}
    />
  );
}
