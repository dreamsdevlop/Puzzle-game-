import { useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';
import { AdMobManager } from '../utils/admob.ts';

interface BannerAdProps {
  className?: string;
}

export function BannerAd({ className = '' }: BannerAdProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const activeConfig = AdMobManager.getActiveConfig();
  const isTest = AdMobManager.isTestMode();

  if (isDismissed) return null;

  return (
    <div
      id="admob-banner-container"
      className={`w-full flex flex-col items-center justify-center border-t border-zinc-200/80 dark:border-slate-800/80 bg-zinc-100/90 dark:bg-slate-950/90 py-1 px-2 select-none shrink-0 transition-colors ${className}`}
    >
      {/* 320x50 Standard Mobile Banner Format */}
      <div
        id="admob-banner-ad"
        className="relative w-full max-w-[360px] h-[54px] rounded-lg bg-white dark:bg-slate-900 border border-zinc-300 dark:border-slate-800 shadow-xs flex items-center justify-between px-2.5 overflow-hidden transition-all hover:border-zinc-400 dark:hover:border-slate-700"
      >
        {/* Ad Attribution badge */}
        <div className="absolute top-0.5 left-1 flex items-center gap-1 z-10">
          <span className="px-1 py-[1px] text-[8px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 rounded leading-none">
            Ad
          </span>
          <span className="text-[9px] text-zinc-400 dark:text-slate-500 font-medium">Google AdMob</span>
        </div>

        {/* Banner Content */}
        <div className="flex items-center gap-2 pt-2.5 overflow-hidden">
          {/* App Icon */}
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
            WS
          </div>

          {/* Ad Copy */}
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-bold text-zinc-900 dark:text-slate-100 truncate leading-tight transition-colors">
              Word Master 3D • Daily IQ
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-slate-400 truncate leading-tight transition-colors">
              Sharpen your mind with 1000+ free puzzles!
            </span>
          </div>
        </div>

        {/* Action Button & Info */}
        <div className="flex items-center gap-1 shrink-0 pt-2">
          <button
            id="admob-banner-cta-btn"
            onClick={() => setShowInfo((prev) => !prev)}
            className="px-2.5 py-1 rounded-md bg-[#2f80ed] hover:bg-blue-600 active:scale-95 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1"
          >
            <span>Install</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            id="admob-banner-info-btn"
            onClick={() => setShowInfo((prev) => !prev)}
            className="p-1 rounded text-zinc-400 dark:text-slate-500 hover:text-zinc-600 dark:hover:text-slate-300 transition-colors"
            title="Ad Details"
          >
            <Info className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Ad Details Modal/Tooltip */}
      {showInfo && (
        <div
          id="admob-banner-details"
          className="w-full max-w-[360px] mt-1 p-2 rounded-lg bg-zinc-900 text-white text-[10px] shadow-lg border border-zinc-700 flex flex-col gap-1 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between text-zinc-400 font-semibold border-b border-zinc-800 pb-1">
            <span>AdMob Configuration Details</span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-zinc-400">Ad Unit Name:</span>
            <span className="text-white font-semibold">
              {activeConfig.bannerName}
              {isTest && <span className="text-amber-400 font-normal ml-1">(Test)</span>}
            </span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-zinc-400">Banner Unit ID:</span>
            <span className="text-emerald-400 truncate max-w-[200px]">{activeConfig.bannerId}</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-zinc-400">Publisher ID:</span>
            <span className="text-zinc-300">{activeConfig.publisherId}</span>
          </div>
          <div className="flex justify-between font-mono">
            <span className="text-zinc-400">App Name / ID:</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{activeConfig.appName} ({activeConfig.appId})</span>
          </div>
        </div>
      )}
    </div>
  );
}
