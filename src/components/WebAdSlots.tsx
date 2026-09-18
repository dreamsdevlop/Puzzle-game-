import { useEffect, useRef } from 'react';
import { isCrazyGamesHost } from '../utils/crazygames.ts';

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: 'iframe';
      height: number;
      width: number;
      params: Record<string, string>;
    };
  }
}

interface WebAdSlotProps {
  slotId: string;
  keyValue: string;
  width: number;
  height: number;
  className?: string;
}

const INVOKE_HOST = 'https://www.highrevenueformat.com';
let providerQueue = Promise.resolve();

function WebAdSlot({ slotId, keyValue, width, height, className = '' }: WebAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !keyValue) return;

    let cancelled = false;
    const load = () => {
      if (cancelled || !container || container.dataset.loaded === 'true') return;
      container.dataset.loaded = 'true';

      providerQueue = providerQueue.then(
        () =>
          new Promise<void>((resolve) => {
            window.atOptions = {
              key: keyValue,
              format: 'iframe',
              height,
              width,
              params: {},
            };

            const script = document.createElement('script');
            script.async = true;
            script.src = `${INVOKE_HOST}/${keyValue}/invoke.js`;
            script.dataset.slot = slotId;
            script.onload = () => resolve();
            script.onerror = () => {
              container.dataset.loaded = 'error';
              console.warn(`[WebAds] Slot ${slotId} failed to load`);
              resolve();
            };
            container.appendChild(script);
          }),
      );
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(load, { timeout: 1800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(load, 250);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, [height, keyValue, slotId, width]);

  return (
    <div
      ref={containerRef}
      id={`web-ad-${slotId}`}
      className={`web-ad-slot flex w-full items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: height }}
      data-width={width}
      data-height={height}
      aria-label="Advertisement"
    />
  );
}

export function WebAdSlots({ screen }: { screen: string }) {
  if (typeof window === 'undefined' || screen === 'game' || isCrazyGamesHost()) return null;

  return (
    <section
      aria-label="Sponsored content"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-3 pb-2 pt-1"
    >
      <WebAdSlot
        slotId="leaderboard"
        keyValue="34b0c2964dcfac723a29c4482a70e505"
        width={728}
        height={90}
        className="hidden min-h-[90px] md:flex"
      />
      <WebAdSlot
        slotId="mobile-banner"
        keyValue="59d3acdb007015324f9cfba5940b7fda"
        width={320}
        height={50}
        className="flex min-h-[50px] md:hidden"
      />
      {(screen === 'home' || screen === 'results' || screen === 'level_map') && (
        <WebAdSlot
          slotId="content-rectangle"
          keyValue="ae59f665ee0741d7cdc5003ef2c5a6a0"
          width={300}
          height={250}
          className="min-h-[250px] max-w-[300px]"
        />
      )}
    </section>
  );
}

export function WebAdRail() {
  if (typeof window === 'undefined' || isCrazyGamesHost()) return null;
  return (
    <aside className="pointer-events-none fixed left-2 top-1/2 z-10 hidden -translate-y-1/2 xl:block">
      <div className="pointer-events-auto w-[160px]">
        <WebAdSlot
          slotId="desktop-rail"
          keyValue="3a746e0253e517c4daacba25909b5ccd"
          width={160}
          height={600}
          className="min-h-[600px]"
        />
      </div>
    </aside>
  );
}

export function WebAdFooter() {
  if (typeof window === 'undefined' || isCrazyGamesHost()) return null;
  return (
    <div className="mx-auto hidden w-full max-w-[468px] items-center justify-center px-3 pb-3 sm:flex">
      <WebAdSlot
        slotId="footer-banner"
        keyValue="1ed5d258268a5fa4e4bc0ada55b705d8"
        width={468}
        height={60}
        className="min-h-[60px]"
      />
    </div>
  );
}

export function WebAdSafeStyles() {
  return (
    <style>{`
      .web-ad-slot iframe { max-width: 100%; border: 0; }
      .web-ad-slot { contain: layout paint; }
    `}</style>
  );
}

export default WebAdSlots;
