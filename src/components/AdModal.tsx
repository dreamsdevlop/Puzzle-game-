import { useEffect, useState } from 'react';
import { Play, Sparkles, X } from 'lucide-react';
import { AdMobManager, ADMOB_PRODUCTION_CONFIG } from '../utils/admob.ts';

interface AdModalProps {
  type: 'interstitial' | 'rewarded';
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned?: () => void;
}

export const ADMOB_CONFIG = ADMOB_PRODUCTION_CONFIG;

export function AdModal({
  type,
  isOpen,
  onClose,
  onRewardEarned,
}: AdModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(type === 'rewarded' ? 5 : 3);
  const [canClose, setCanClose] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);
  const activeConfig = AdMobManager.getActiveConfig();
  const isTest = AdMobManager.isTestMode();

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(type === 'rewarded' ? 5 : 3);
      setCanClose(false);
      setRewardGranted(false);
      return;
    }

    const initialSeconds = type === 'rewarded' ? 5 : 3;
    setSecondsLeft(initialSeconds);
    setCanClose(false);
    setRewardGranted(false);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          if (type === 'rewarded') {
            setRewardGranted(true);
            onRewardEarned?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, type, onRewardEarned]);

  if (!isOpen) return null;

  return (
    <div
      id="admob-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        id="admob-container"
        className="relative w-full max-w-sm rounded-2xl bg-zinc-900 text-white shadow-2xl overflow-hidden border border-zinc-700/80 flex flex-col"
      >
        {/* AdMob top bar */}
        <div
          id="admob-header"
          className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/90 border-b border-zinc-700 text-xs text-zinc-300"
        >
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase border border-amber-500/30">
              Ad
            </span>
            <span>Google AdMob</span>
          </div>

          <div className="flex items-center gap-2">
            {!canClose ? (
              <span className="text-xs text-zinc-400 font-mono">
                {type === 'rewarded' ? `Reward in ${secondsLeft}s` : `Skip in ${secondsLeft}s`}
              </span>
            ) : (
              <button
                id="admob-close-button"
                onClick={onClose}
                className="p-1 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
                title="Close Ad"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ad Body */}
        <div id="admob-body" className="p-5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 mt-2">
            {type === 'rewarded' ? (
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <Play className="w-8 h-8 text-white fill-white ml-0.5" />
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {type === 'rewarded' ? 'Watch for +2 Free Hints' : 'Super Brain Games'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mb-4">
            {type === 'rewarded'
              ? rewardGranted
                ? 'Reward confirmed! +2 hints have been added to your puzzle.'
                : 'Watch this short sponsored video to claim 2 extra hints immediately.'
              : 'Boost your memory and cognitive speed with daily word challenges.'}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                rewardGranted ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{
                width: `${
                  ((type === 'rewarded' ? 5 - secondsLeft : 3 - secondsLeft) /
                    (type === 'rewarded' ? 5 : 3)) *
                  100
                }%`,
              }}
            />
          </div>

          {rewardGranted ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-sm flex items-center justify-center gap-2 mb-2 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>+2 Hints Added!</span>
            </div>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs flex items-center justify-center gap-2 mb-2 font-mono">
              <span>{secondsLeft > 0 ? `Streaming demo (${secondsLeft}s left)` : 'Ready to claim'}</span>
            </div>
          )}

          {canClose && (
            <button
              id="admob-claim-close-btn"
              onClick={onClose}
              className="w-full mt-2 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              {type === 'rewarded' ? 'Claim & Return to Game' : 'Continue Playing'}
            </button>
          )}
        </div>

        {/* AdMob Footer metadata */}
        <div
          id="admob-footer"
          className="px-4 py-2 bg-zinc-950/80 border-t border-zinc-800 text-[10px] text-zinc-500 flex flex-col gap-0.5"
        >
          <div className="flex justify-between">
            <span>Ad Unit Name:</span>
            <span className="font-semibold text-zinc-300">
              {type === 'rewarded' ? activeConfig.rewardedName : 'Interstitial'}
              {isTest && <span className="text-amber-400 font-normal ml-1">(Test)</span>}
            </span>
          </div>
          <div className="flex justify-between">
            <span>AdMob Unit ID:</span>
            <span className="font-mono text-zinc-400">
              {type === 'rewarded' ? activeConfig.rewardedId : activeConfig.interstitialId}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Publisher ID:</span>
            <span className="font-mono text-zinc-400">{activeConfig.publisherId}</span>
          </div>
          <div className="flex justify-between">
            <span>App Name / ID:</span>
            <span className="font-mono text-zinc-400">{activeConfig.appName} ({activeConfig.appId})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
