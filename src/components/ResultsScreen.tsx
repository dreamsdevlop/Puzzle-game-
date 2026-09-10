import { useEffect } from 'react';
import { Brain, CheckCircle2, ChevronRight, Coins, Home, MapPin, RotateCcw, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, GameMode, LevelDef, Theme } from '../types.ts';
import { CATEGORIES } from '../data/categories.ts';
import { playButtonTap, playLevelWin, playVictoryFanfare } from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface ResultsScreenProps {
  category?: Category;
  level?: LevelDef;
  stars?: number;
  mode: GameMode;
  score: number;
  timeTakenSeconds: number;
  bonusWords: string[];
  timeLeftSeconds: number;
  coinsEarned: number;
  totalCoins: number;
  theme: Theme;
  onToggleTheme: () => void;
  onPlayAgain: () => void;
  onNextLevel?: (nextLevelOrCategory: LevelDef | Category) => void;
  onGoToLevelMap?: () => void;
  onHome: () => void;
}

export function ResultsScreen({
  category,
  level,
  stars = 3,
  mode,
  score,
  timeTakenSeconds,
  bonusWords,
  timeLeftSeconds,
  coinsEarned,
  totalCoins,
  theme,
  onToggleTheme,
  onPlayAgain,
  onNextLevel,
  onGoToLevelMap,
  onHome,
}: ResultsScreenProps) {
  useEffect(() => {
    // Play victory sound
    if (level) {
      playLevelWin();
    } else {
      playVictoryFanfare();
    }

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#2f80ed', '#ff8c1a', '#f83f8f', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
  }, [level]);

  const isLevelMode = Boolean(level);
  const title = level ? `Level ${level.levelNumber} Mastered!` : `${category?.name} Completed`;
  const emoji = level ? level.emoji : category?.emoji || '🏆';

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="results-screen"
      className="flex flex-col justify-between flex-1 w-full px-4 py-5 max-w-md mx-auto select-none overflow-y-auto"
    >
      <div className="flex flex-col items-center text-center">
        {/* Top bar with Theme Toggle & Coins */}
        <div className="w-full flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 text-xs font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono text-zinc-800 dark:text-slate-100">{totalCoins}</span>
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="results-theme-toggle-btn"
          />
        </div>

        {/* Victory Icon / Level Emoji */}
        <div className="relative mt-2 mb-2">
          <div className="w-18 h-18 rounded-3xl bg-linear-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20 animate-in zoom-in-75 duration-300">
            {emoji}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Stars rating banner for Level mode */}
        {isLevelMode && (
          <div className="flex items-center justify-center gap-2 mb-2 animate-in zoom-in-50">
            {[1, 2, 3].map((starNum) => (
              <div
                key={starNum}
                className={`p-1.5 rounded-2xl transition-all ${
                  starNum <= stars
                    ? 'scale-110'
                    : 'opacity-40'
                }`}
              >
                <Star
                  className={`w-7 h-7 ${
                    starNum <= stars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                      : 'text-zinc-300 dark:text-slate-700'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-100 dark:bg-blue-950/80 px-3 py-0.5 rounded-full mb-1">
          {level ? `${level.tier} Solved` : 'Puzzle Solved!'}
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-slate-100 tracking-tight mb-1 transition-colors">
          {title}
        </h1>

        <p className="text-xs text-zinc-500 dark:text-slate-400 font-medium transition-colors">
          Solved in {formatTime(timeTakenSeconds)} • {mode === 'classic' ? 'Standard Pace' : 'Speed Mode'}
        </p>

        {/* Brain Perk Unlocked Banner for Level Mode */}
        {level && (
          <div
            id="results-brain-perk"
            className="w-full mt-3 p-3 rounded-2xl bg-linear-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-900/60 flex items-center gap-2.5 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                Cognitive Skill Reinforced
              </div>
              <div className="text-xs font-black text-zinc-800 dark:text-slate-100">
                {level.brainPerk}
              </div>
            </div>
          </div>
        )}

        {/* Coins Earned Banner */}
        <div
          id="results-coins-reward"
          className="w-full mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between shadow-xs animate-in slide-in-from-bottom-2 duration-300 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-amber-950 dark:text-amber-200">
                Reward Added
              </div>
              <div className="text-[10px] text-amber-800 dark:text-amber-300/80 font-medium">
                {level ? `Level ${level.levelNumber} bonus` : 'Puzzle completion'}
              </div>
            </div>
          </div>
          <div className="font-mono font-black text-lg text-amber-600 dark:text-amber-400">
            +{coinsEarned}
          </div>
        </div>

        {/* Detailed Score Breakdown Card */}
        <div
          id="results-score-card"
          className="w-full mt-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 flex flex-col gap-2.5 text-left transition-colors"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-slate-800 text-xs">
            <span className="text-zinc-500 dark:text-slate-400 font-semibold">Words Found</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-slate-200">
              +{((level ? level.words.length : category?.words.length) || 0) * 10} pts
            </span>
          </div>

          {bonusWords.length > 0 && (
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bonus Words ({bonusWords.length})</span>
              </div>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                +{bonusWords.length * 5} pts
              </span>
            </div>
          )}

          {mode === 'time' && timeLeftSeconds > 0 && (
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-slate-800 text-xs">
              <span className="text-blue-700 dark:text-blue-400 font-semibold">
                Time Bonus ({timeLeftSeconds}s × 2)
              </span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                +{timeLeftSeconds * 2} pts
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-black text-zinc-900 dark:text-slate-100">Total Score</span>
            <span className="font-mono font-black text-xl text-zinc-900 dark:text-slate-100">{score}</span>
          </div>
        </div>

        {/* Bonus Words tags if any */}
        {bonusWords.length > 0 && (
          <div className="w-full mt-2.5 p-2.5 rounded-2xl bg-zinc-50 dark:bg-slate-900 border border-zinc-200/70 dark:border-slate-800 text-left transition-colors">
            <span className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Bonus Words Discovered
            </span>
            <div className="flex flex-wrap gap-1">
              {bonusWords.map((bw) => (
                <span
                  key={bw}
                  className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-mono font-bold text-[10px]"
                >
                  {bw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div id="results-actions" className="w-full flex flex-col gap-2 pt-4 pb-2">
        {onNextLevel && (
          <button
            id="results-next-level-btn"
            onClick={() => {
              playButtonTap();
              onNextLevel(level ? level : category!);
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-wide shadow-md shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>CONTINUE TO NEXT LEVEL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div className="flex gap-2 w-full">
          {onGoToLevelMap && (
            <button
              id="results-journey-btn"
              onClick={() => {
                playButtonTap();
                onGoToLevelMap();
              }}
              className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-zinc-50 dark:hover:bg-slate-800 border border-zinc-200 dark:border-slate-800 text-zinc-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Level Map</span>
            </button>
          )}

          <button
            id="results-play-again-btn"
            onClick={() => {
              playButtonTap();
              onPlayAgain();
            }}
            className="flex-1 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-zinc-50 dark:hover:bg-slate-800 border border-zinc-200 dark:border-slate-800 text-zinc-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          <button
            id="results-home-btn"
            onClick={() => {
              playButtonTap();
              onHome();
            }}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 dark:bg-slate-800 hover:bg-zinc-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
