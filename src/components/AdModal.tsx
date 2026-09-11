import { useEffect, useRef } from 'react';
import { AdMobManager } from '../utils/admob.ts';

interface AdModalProps {
  type: 'interstitial' | 'rewarded';
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned?: () => void;
}

export function AdModal({ type, isOpen, onClose, onRewardEarned }: AdModalProps) {
  const requestId = useRef(0);
  const onCloseRef = useRef(onClose);
  const onRewardRef = useRef(onRewardEarned);

  useEffect(() => {
    onCloseRef.current = onClose;
    onRewardRef.current = onRewardEarned;
  }, [onClose, onRewardEarned]);

  useEffect(() => {
    if (!isOpen) return;

    const currentRequest = ++requestId.current;
    const showAd = async () => {
      if (!AdMobManager.isNative()) {
        onCloseRef.current();
        return;
      }

      const shown = type === 'rewarded'
        ? await AdMobManager.showRewarded()
        : await AdMobManager.showInterstitial();

      if (currentRequest !== requestId.current) return;
      if (shown && type === 'rewarded') onRewardRef.current?.();
      onCloseRef.current();
    };

    void showAd();
    return () => {
      requestId.current += 1;
    };
  }, [isOpen, type]);

  if (!isOpen || !AdMobManager.isNative()) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-xs">
      <div className="rounded-2xl bg-white/95 px-6 py-5 text-center shadow-2xl dark:bg-slate-900/95">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {type === 'rewarded' ? 'Loading reward ad…' : 'Loading ad…'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-slate-500 underline dark:text-slate-400"
        >
          Continue without ad
        </button>
      </div>
    </div>
  );
}
