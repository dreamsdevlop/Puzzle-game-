import { useEffect } from 'react';
import { Award, CheckCircle2, ChevronRight, Coins, Home, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, GameMode } from '../types.ts';
import { CATEGORIES } from '../data/categories.ts';
import { playButtonTap, playVictoryFanfare } from '../utils/audio.ts';

interface ResultsScreenProps {
  category: Category;
  mode: GameMode;
  score: number;
  timeTakenSeconds: number;
  bonusWords: string[];
  timeLeftSeconds: number;
  coinsEarned: number;
  totalCoins: number;
  onPlayAgain: () => void;
  onNextLevel: (nextCategory: Category) => void;
  onHome: () => void;
}

export function ResultsScreen({
  category,
  mode,
  score,
  timeTakenSeconds,
  bonusWords,
  timeLeftSeconds,
  coinsEarned,
  totalCoins,
  onPlayAgain,
  onNextLevel,
  onHome,
}: ResultsScreenProps) {
  useEffect(() => {
    // Play victory fanfare
    playVictoryFanfare();

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2f80ed', '#ff8c1a', '#f83f8f', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const currentIndex = CATEGORIES.findIndex((c) => c.id === category.id);
  const nextCategory =
    currentIndex >= 0 && currentIndex < CATEGORIES.length - 1
      ? CATEGORIES[currentIndex + 1]
      : null;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="results-screen"
      className="flex flex-col justify-between flex-1 w-full px-4 py-6 max-w-md mx-auto select-none"
    >
      <div className="flex flex-col items-center text-center">
        {/* Victory Icon / Category Emoji */}
        <div className="relative mt-4 mb-3">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-400/25 animate-in zoom-in-75 duration-300">
            {category.emoji}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full mb-1">
          Puzzle Solved!
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mb-1">
          {category.name} Completed
        </h1>
        <p className="text-xs text-zinc-500 font-medium">
          {category.words.length} words found in {formatTime(timeTakenSeconds)} •{' '}
          {mode === 'classic' ? 'Classic Mode' : 'Time Mode'}
        </p>

        {/* Coins Earned Banner */}
        <div
          id="results-coins-reward"
          className="w-full mt-5 p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between shadow-xs animate-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-amber-950">Level Reward</div>
              <div className="text-[11px] text-amber-800 font-medium">Added to wallet</div>
            </div>
          </div>
          <div className="font-mono font-black text-xl text-amber-600">
            +{coinsEarned}
          </div>
        </div>

        {/* Detailed Score Breakdown Card */}
        <div
          id="results-score-card"
          className="w-full mt-4 p-4 rounded-2xl bg-white shadow-xs border border-zinc-200/80 flex flex-col gap-3 text-left"
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-xs text-zinc-500 font-semibold">Base Word Score</span>
            <span className="font-mono font-bold text-xs text-zinc-800">
              +{category.words.length * 10} pts
            </span>
          </div>

          {bonusWords.length > 0 && (
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bonus Words ({bonusWords.length})</span>
              </div>
              <span className="font-mono font-bold text-xs text-amber-700">
                +{bonusWords.length * 5} pts
              </span>
            </div>
          )}

          {mode === 'time' && timeLeftSeconds > 0 && (
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-xs text-blue-700 font-semibold">
                Time Bonus ({timeLeftSeconds}s × 2)
              </span>
              <span className="font-mono font-bold text-xs text-blue-700">
                +{timeLeftSeconds * 2} pts
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-black text-zinc-900">Total Score</span>
            <span className="font-mono font-black text-xl text-zinc-900">{score}</span>
          </div>
        </div>

        {/* Bonus Words tags if any */}
        {bonusWords.length > 0 && (
          <div className="w-full mt-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-left">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
              Bonus Words Found
            </span>
            <div className="flex flex-wrap gap-1">
              {bonusWords.map((bw) => (
                <span
                  key={bw}
                  className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-[10px]"
                >
                  {bw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div id="results-actions" className="w-full flex flex-col gap-2.5 pt-6 pb-2">
        {nextCategory ? (
          <button
            id="results-next-level-btn"
            onClick={() => {
              playButtonTap();
              onNextLevel(nextCategory);
            }}
            className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#2f80ed] to-[#2563eb] text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Next: {nextCategory.emoji} {nextCategory.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : null}

        <div className="flex gap-2 w-full">
          <button
            id="results-play-again-btn"
            onClick={() => {
              playButtonTap();
              onPlayAgain();
            }}
            className="flex-1 py-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          <button
            id="results-home-btn"
            onClick={() => {
              playButtonTap();
              onHome();
            }}
            className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
