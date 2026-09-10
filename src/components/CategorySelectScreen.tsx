import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Coins, Lock } from 'lucide-react';
import { Category, Theme } from '../types.ts';
import { CATEGORIES, getGridSizeForCategory } from '../data/categories.ts';
import { playButtonTap, playWrongSelection } from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface CategorySelectScreenProps {
  coins: number;
  completedLevels: string[];
  theme: Theme;
  onToggleTheme: () => void;
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
}

export function CategorySelectScreen({
  coins,
  completedLevels,
  theme,
  onToggleTheme,
  onSelectCategory,
  onBack,
}: CategorySelectScreenProps) {
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const handleCardClick = (category: Category, index: number, isUnlocked: boolean) => {
    if (isUnlocked) {
      playButtonTap();
      onSelectCategory(category);
    } else {
      playWrongSelection();
      const prevCat = CATEGORIES[index - 1];
      setLockedNotice(`Complete ${prevCat.emoji} ${prevCat.name} first to unlock!`);
      setTimeout(() => {
        setLockedNotice(null);
      }, 2500);
    }
  };

  return (
    <div
      id="category-select-screen"
      className="flex flex-col flex-1 w-full px-4 py-6 max-w-lg mx-auto select-none"
    >
      {/* Header */}
      <div id="category-header" className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            id="category-back-btn"
            onClick={() => {
              playButtonTap();
              onBack();
            }}
            className="p-2.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-black text-zinc-900 dark:text-slate-100 tracking-tight transition-colors">
            Select Category
          </h1>
        </div>

        {/* Right side controls: Theme toggle & Coin badge */}
        <div className="flex items-center gap-2">
          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="category-theme-toggle-btn"
          />

          <div
            id="category-coins-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-900 dark:text-slate-100 font-bold text-xs transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-amber-950">
              <Coins className="w-3 h-3" />
            </div>
            <span className="font-mono text-sm">{coins}</span>
          </div>
        </div>
      </div>

      {/* Floating Locked Notice */}
      {lockedNotice && (
        <div
          id="locked-toast"
          className="mb-3 px-4 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-semibold text-center animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm"
        >
          🔒 {lockedNotice}
        </div>
      )}

      {/* Categories Grid */}
      <div
        id="categories-grid"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8 overflow-y-auto"
      >
        {CATEGORIES.map((category, index) => {
          // Level 0 (Animals) is always unlocked.
          // Level i is unlocked if and only if CATEGORIES[i-1].id is in completedLevels.
          const isUnlocked =
            index === 0 || completedLevels.includes(CATEGORIES[index - 1].id);
          const isCompleted = completedLevels.includes(category.id);
          const gridSize = getGridSizeForCategory(category);

          return (
            <div
              key={category.id}
              id={`category-card-${category.id}`}
              onClick={() => handleCardClick(category, index, isUnlocked)}
              className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${
                !isUnlocked
                  ? 'bg-zinc-200/50 dark:bg-slate-900/40 border-zinc-300/60 dark:border-slate-800/60 opacity-60 dark:opacity-50 grayscale-[0.3]'
                  : isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-300/80 dark:border-emerald-500/40 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-400 hover:shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-zinc-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Emoji Icon Bubble */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs transition-colors ${
                    !isUnlocked
                      ? 'bg-zinc-300/70 dark:bg-slate-800 text-zinc-400 dark:text-slate-500'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {category.emoji}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-slate-500">
                      #{index + 1}
                    </span>
                    <h2 className="text-base font-bold text-zinc-900 dark:text-slate-100 leading-tight transition-colors">
                      {category.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500 dark:text-slate-400 font-medium transition-colors">
                    <span>{category.words.length} words</span>
                    <span>•</span>
                    <span>{gridSize}×{gridSize} grid</span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center">
                {!isUnlocked ? (
                  <div className="p-2 rounded-full bg-zinc-300/60 dark:bg-slate-800 text-zinc-600 dark:text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : isCompleted ? (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </div>
                ) : (
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                    Play
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
