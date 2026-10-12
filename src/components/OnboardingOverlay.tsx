import { ArrowRight, CalendarCheck, Coins, Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { playButtonTap, playSatisfyingClick } from '../utils/audio.ts';

interface OnboardingOverlayProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Search,
    accent: 'from-blue-600 to-indigo-600',
    eyebrow: 'START SIMPLE',
    title: 'Find the hidden words',
    body: 'Drag across letters to solve your first puzzle. Start with the glowing beginner level and build your rhythm.',
  },
  {
    icon: CalendarCheck,
    accent: 'from-amber-500 to-orange-500',
    eyebrow: 'COME BACK DAILY',
    title: 'Build your daily streak',
    body: 'Complete one fresh Daily Challenge each day to earn bonus coins and grow your streak.',
  },
  {
    icon: Coins,
    accent: 'from-emerald-500 to-teal-600',
    eyebrow: 'MAKE IT YOURS',
    title: 'Earn and customize',
    body: 'Use coins to unlock wallpapers and tile themes. Need help? Hints and optional rewarded ads are always your choice.',
  },
] as const;

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const finish = () => {
    playSatisfyingClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-6 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
        <div className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${current.accent}`}>
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-white shadow-xl ring-4 ring-white/20">
            <Icon className="h-10 w-10" />
            <Sparkles className="absolute -right-3 -top-3 h-6 w-6 fill-amber-300 text-amber-300" />
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="mb-2 text-[10px] font-black tracking-[0.2em] text-blue-600 dark:text-blue-400">
            {current.eyebrow}
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {current.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {current.body}
          </p>

          <div className="mt-6 flex justify-center gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
            {STEPS.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${index === step ? 'w-7 bg-blue-600' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playButtonTap();
              if (isLast) finish();
              else setStep((value) => value + 1);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-transform active:scale-[0.98]"
          >
            {isLast ? 'Start my first puzzle' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>

          {!isLast && (
            <button
              type="button"
              onClick={finish}
              className="mt-3 text-xs font-bold text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
            >
              Skip intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
