import { useEffect, useState } from 'react';
import { AdMobManager } from '../utils/admob.ts';
import { CrazyGamesManager } from '../utils/crazygames.ts';

const CONTAINER_ID = 'word-quest-crazygames-banner';

export function CrazyGamesBanner() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (AdMobManager.isNative()) return;
    let active = true;
    void CrazyGamesManager.initialize().then((available) => {
      if (!active || !available) return;
      setEnabled(true);
      void CrazyGamesManager.requestResponsiveBanner(CONTAINER_ID);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      id={CONTAINER_ID}
      aria-label="Advertisement"
      className="mx-auto flex min-h-[90px] w-full max-w-[970px] items-center justify-center overflow-hidden px-3 py-2"
    />
  );
}
