import { useState } from 'react';
import { ArrowLeft, Clock, Flame, Play, Sparkles, Trophy } from 'lucide-react';
import { Category, GameMode, Theme } from '../types.ts';
import { getGridSizeForCategory } from '../data/categories.ts';
import { playButtonTap } from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface ModeSelectScreenProps {
  category: Category;
  theme: Theme;
  onToggleTheme: () => void;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export function ModeSelectScreen({
  category,
  theme,
  onToggleTheme,
  onSelectMode,
  onBack,
}: ModeSelectScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const gridSize = getGridSizeForCategory(category);

  const handleStart = () => {
    playButtonTap();
    onSelectMode(selectedMode);
  };

  return (
    <div
      id="mode-select-screen"
      className="flex flex-col justify-between flex-1 w-full px-4 py-6 max-w-md mx-auto select-none"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              id="mode-back-btn"
              onClick={() => {
                playButtonTap();
                onBack();
              }}
              className="p-2.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
              title="Back to Categories"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-black text-zinc-900 dark:text-slate-100 tracking-tight transition-colors">
              Select Game Mode
            </h1>
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="mode-theme-toggle-btn"
          />
        </div>

        {/* Category Card Header */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 mb-6 flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl shadow-xs transition-colors">
            {category.emoji}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 transition-colors">
              {category.name}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">
              {category.words.length} Words to find • {gridSize}×{gridSize} Letter Grid
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {category.words.slice(0, 4).map((w) => (
                <span
                  key={w}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 text-[10px] font-mono font-semibold transition-colors"
                >
                  {w}
                </span>
              ))}
              {category.words.length > 4 && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-slate-800 text-zinc-400 dark:text-slate-500 text-[10px] font-mono transition-colors">
                  +{category.words.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mode Options */}
        <div className="flex flex-col gap-3">
          {/* Classic Mode Card */}
          <div
            id="mode-card-classic"
            onClick={() => {
              playButtonTap();
              setSelectedMode('classic');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedMode === 'classic'
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 shadow-md'
                : 'bg-white dark:bg-slate-900 border-zinc-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-3 rounded-xl transition-colors ${
                  selectedMode === 'classic'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-400'
                }`}
              >
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-slate-100 text-base transition-colors">
                    Classic Mode
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full transition-colors">
                    Relaxed
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                  No time limit. The timer counts UP from 0:00. Search and solve the puzzle at your own pace.
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-zinc-600 dark:text-slate-400 transition-colors">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    +10 pts / word
                  </span>
                  <span>•</span>
                  <span>+5 pts / bonus word</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Mode Card */}
          <div
            id="mode-card-time"
            onClick={() => {
              playButtonTap();
              setSelectedMode('time');
            }}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
              selectedMode === 'time'
                ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-md'
                : 'bg-white dark:bg-slate-900 border-zinc-200 dark:border-slate-800 hover:border-zinc-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-3 rounded-xl transition-colors ${
                  selectedMode === 'time'
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-400'
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-slate-100 text-base transition-colors">
                    Time Mode
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors">
                    <Flame className="w-3 h-3 text-orange-500" />
                    2:00 Countdown
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors">
                  Race against the clock! 2 minutes countdown. When &lt;30s remains, timer turns red with audio ticks.
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] font-semibold text-amber-900 dark:text-amber-300 transition-colors">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Time Bonus (+timeLeft × 2 pts)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-6 pb-2">
        <button
          id="mode-start-btn"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-linear-to-r from-[#2f80ed] to-[#2563eb] text-white font-bold text-base tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>START {selectedMode === 'time' ? 'TIME RUSH' : 'CLASSIC'} PUZZLE</span>
        </button>
      </div>
    </div>
  );
}
