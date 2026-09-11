import { useEffect, useState } from 'react';
import { Brain, Calendar, CheckCircle2, ChevronRight, Coins, Flame, Home, MapPin, Palette, RotateCcw, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, DailyChallengeDef, GameMode, LevelDef, Theme } from '../types.ts';
import { CATEGORIES } from '../data/categories.ts';
import { playBonusWordSparkle, playButtonTap, playLevelWin, playSatisfyingClick, playVictoryFanfare } from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface ResultsScreenProps {
  category?: Category;
  level?: LevelDef;
  dailyChallenge?: DailyChallengeDef;
  dailyStreak?: number;
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
  onOpenShop?: () => void;
  onRequestRewardedAd?: (onSuccess: () => void) => void;
}

export function triggerGrandCelebration() {
  try {
    // Stage 1: Immediate Center Fireworks Explosion
    confetti({
      particleCount: 90,
      spread: 95,
      origin: { y: 0.52 },
      colors: ['#ffd700', '#ff4081', '#00e5ff', '#76ff03', '#ff6d00', '#9c27b0'],
      shapes: ['star', 'circle'],
      scalar: 1.25,
      ticks: 220,
    });

    // Stage 2: Bottom-Left Cannon Barrage
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.8 },
        colors: ['#ffd700', '#ffab00', '#ff6d00', '#ff3d00', '#ff1744'],
      });
    }, 200);

    // Stage 3: Bottom-Right Cannon Barrage
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.8 },
        colors: ['#00e5ff', '#00b0ff', '#2979ff', '#651fff', '#e040fb'],
      });
    }, 350);

    // Stage 4: High-Altitude Shimmering Star Shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 130,
        origin: { y: 0.25 },
        colors: ['#ffd700', '#ffffff', '#e040fb', '#00e676'],
        shapes: ['star'],
        scalar: 1.4,
        drift: 0.15,
        gravity: 0.75,
        ticks: 250,
      });
    }, 600);

    // Stage 5: Grand Finale Color Explosion
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 110,
        origin: { y: 0.6 },
        colors: ['#ff1744', '#f50057', '#d500f9', '#651fff', '#00e5ff', '#ffd600'],
        ticks: 240,
      });
    }, 900);
  } catch {
    // safe fallback if canvas is unavailable
  }
}

export function ResultsScreen({
  category,
  level,
  dailyChallenge,
  dailyStreak,
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
  onOpenShop,
  onRequestRewardedAd,
}: ResultsScreenProps) {
  const [doubleRewardClaimed, setDoubleRewardClaimed] = useState(false);

  useEffect(() => {
    // Play victory sound
    if (dailyChallenge || level) {
      playLevelWin();
    } else {
      playVictoryFanfare();
    }

    // Trigger grand multi-stage confetti explosion
    triggerGrandCelebration();
  }, [level, dailyChallenge]);

  const isDaily = Boolean(dailyChallenge);
  const isLevelMode = Boolean(level);
  const title = dailyChallenge
    ? 'Daily Challenge Mastered!'
    : level
    ? `Level ${level.levelNumber} Mastered!`
    : `${category?.name} Completed`;
  const emoji = dailyChallenge ? dailyChallenge.emoji : level ? level.emoji : category?.emoji || '🏆';

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

        {/* Stars rating banner for Level mode or Daily Challenge */}
        {(isLevelMode || isDaily) && (
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

        <span
          className={`text-xs font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mb-1 ${
            isDaily
              ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80'
              : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80'
          }`}
        >
          {dailyChallenge
            ? `${dailyChallenge.formattedDate} • ${dailyChallenge.tier}`
            : level
            ? `${level.tier} Solved`
            : 'Puzzle Solved!'}
        </span>

        {/* Interactive Confetti Re-Trigger Button */}
        <button
          id="results-retrigger-confetti-btn"
          onClick={() => {
            playBonusWordSparkle();
            triggerGrandCelebration();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full bg-linear-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:via-rose-500/25 hover:to-purple-500/25 border border-amber-300/60 dark:border-amber-700/60 text-amber-800 dark:text-amber-200 text-xs font-bold transition-all active:scale-95 shadow-2xs group cursor-pointer"
          title="Launch Confetti Fireworks Again!"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
          <span>Tap for Fireworks Celebration! 🎉</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-slate-100 tracking-tight mb-1 transition-colors">
          {title}
        </h1>

        <p className="text-xs text-zinc-500 dark:text-slate-400 font-medium transition-colors">
          Solved in {formatTime(timeTakenSeconds)} • {isDaily ? `${dailyChallenge.words.length} Words Found` : mode === 'classic' ? 'Standard Pace' : 'Speed Mode'}
        </p>

        {/* Daily Streak Highlight Banner */}
        {isDaily && dailyStreak !== undefined && (
          <div
            id="results-daily-streak-banner"
            className="w-full mt-3 p-3 rounded-2xl bg-linear-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between shadow-xs animate-in slide-in-from-bottom-2 duration-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-amber-950 dark:text-amber-100">
                  {dailyStreak} Day Streak Achieved!
                </div>
                <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                  Come back tomorrow for bonus coins!
                </div>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-mono font-black text-xs shadow-xs">
              🔥 {dailyStreak}
            </div>
          </div>
        )}

        {/* Brain Perk Unlocked Banner for Level Mode or Daily Challenge */}
        {(level || dailyChallenge) && (
          <div
            id="results-brain-perk"
            className={`w-full mt-3 p-3 rounded-2xl border flex items-center gap-2.5 text-left ${
              isDaily
                ? 'bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-amber-200 dark:border-amber-900/60'
                : 'bg-linear-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/60'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 ${
                isDaily ? 'bg-amber-500' : 'bg-blue-600'
              }`}
            >
              {isDaily ? <Calendar className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </div>
            <div>
              <div
                className={`text-[10px] uppercase font-bold ${
                  isDaily ? 'text-amber-700 dark:text-amber-300' : 'text-blue-700 dark:text-blue-300'
                }`}
              >
                {isDaily ? 'Daily Brain Perk Activated' : 'Cognitive Skill Reinforced'}
              </div>
              <div className="text-xs font-black text-zinc-800 dark:text-slate-100">
                {dailyChallenge ? dailyChallenge.brainPerk : level?.brainPerk}
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
                {dailyChallenge
                  ? `Daily reward + streak bonus`
                  : level
                  ? `Level ${level.levelNumber} bonus`
                  : 'Puzzle completion'}
              </div>
            </div>
          </div>
          <div className="font-mono font-black text-lg text-amber-600 dark:text-amber-400">
            +{coinsEarned}
          </div>
        </div>

        {onRequestRewardedAd && !doubleRewardClaimed && coinsEarned > 0 && (
          <div
            id="results-double-coins-offer"
            className="w-full mt-2.5 p-3 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-300/70 dark:border-indigo-700/70 flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-indigo-950 dark:text-indigo-100">
                  Double your coins
                </div>
                <div className="text-[10px] text-indigo-800 dark:text-indigo-300 font-medium">
                  Optional rewarded video • +{coinsEarned} extra coins
                </div>
              </div>
            </div>
            <button
              id="results-double-coins-btn"
              type="button"
              onClick={() => {
                playSatisfyingClick();
                onRequestRewardedAd(() => {
                  setDoubleRewardClaimed(true);
                });
              }}
              className="shrink-0 rounded-xl bg-indigo-600 px-3 py-2 text-[11px] font-black text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
            >
              Watch
            </button>
          </div>
        )}

        {doubleRewardClaimed && (
          <div className="w-full mt-2.5 rounded-2xl border border-emerald-300/70 bg-emerald-50 p-2.5 text-center text-xs font-bold text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            Reward doubled. Your bonus coins are ready.
          </div>
        )}

        {/* Mythic Themes Goal & Store Teaser Banner */}
        <div
          id="results-mythic-theme-teaser"
          className="w-full mt-3 p-3 rounded-2xl bg-linear-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-400/50 dark:border-amber-600/50 flex flex-col gap-2 shadow-xs transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <div className="text-left">
                <div className="text-xs font-black text-zinc-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>Mythic Prestige Themes</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-black">
                    Shop Goal
                  </span>
                </div>
                <div className="text-[10px] text-zinc-600 dark:text-slate-400 font-medium">
                  {totalCoins >= 650
                    ? 'You have enough coins for 24K Gold or Mythic items!'
                    : `Save coins to unlock 24K Imperial Bullion & Cyber Matrix 2099!`}
                </div>
              </div>
            </div>

            {onOpenShop && (
              <button
                id="results-open-shop-btn"
                onClick={() => {
                  playSatisfyingClick();
                  onOpenShop();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Store</span>
              </button>
            )}
          </div>

          {/* Progress bar towards next Mythic threshold (650 coins) */}
          <div className="w-full bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-zinc-200/60 dark:border-slate-800 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-zinc-600 dark:text-slate-400">
                Goal: 24K Imperial Bullion (650 🪙)
              </span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {Math.min(totalCoins, 650)} / 650 ({Math.min(100, Math.round((totalCoins / 650) * 100))}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (totalCoins / 650) * 100)}%` }}
              />
            </div>
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
              +{((dailyChallenge ? dailyChallenge.words.length : level ? level.words.length : category?.words.length) || 0) * 10} pts
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
        {dailyChallenge ? (
          <button
            id="results-daily-home-btn"
            onClick={() => {
              playButtonTap();
              onHome();
            }}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm tracking-wide shadow-md shadow-amber-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>
        ) : onNextLevel ? (
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
        ) : null}

        <div className="flex gap-2 w-full">
          {onGoToLevelMap && !dailyChallenge && (
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

          {!dailyChallenge && (
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
          )}
        </div>
      </div>
    </div>
  );
}
