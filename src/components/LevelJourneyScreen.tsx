import { useState, MouseEvent } from 'react';
import { ArrowLeft, Brain, CheckCircle2, ChevronRight, Coins, Gift, Lock, Sparkles, Star } from 'lucide-react';
import { LevelDef, LevelStarRecord, Theme } from '../types.ts';
import { calculateBrainRank, CURATED_LEVELS, getLevelDef, STAGES_CONFIG } from '../data/levels.ts';
import { playButtonTap, playLevelWin, playSatisfyingClick, playWrongSelection } from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';
import { Storage } from '../utils/storage.ts';

interface LevelJourneyScreenProps {
  coins: number;
  levelProgress: Record<number, LevelStarRecord>;
  claimedMilestones: number[];
  highestUnlockedLevel: number;
  theme: Theme;
  onToggleTheme: () => void;
  onSelectLevel: (level: LevelDef) => void;
  onClaimMilestone: (levelNumber: number, rewardCoins: number) => void;
  onBack: () => void;
  onSwitchToCategories?: () => void;
  onOpenShop?: () => void;
}

export function LevelJourneyScreen({
  coins,
  levelProgress,
  claimedMilestones,
  highestUnlockedLevel,
  theme,
  onToggleTheme,
  onSelectLevel,
  onClaimMilestone,
  onBack,
  onSwitchToCategories,
  onOpenShop,
}: LevelJourneyScreenProps) {
  const [selectedStageFilter, setSelectedStageFilter] = useState<number | 'all'>('all');
  const [celebrationChest, setCelebrationChest] = useState<{
    levelNum: number;
    coinsEarned: number;
  } | null>(null);

  // Calculate brain stats
  const completedLevelsCount = Object.keys(levelProgress).length;
  const totalStars = Object.values(levelProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const brainRank = calculateBrainRank(completedLevelsCount, totalStars);

  const displayedLevels = CURATED_LEVELS.filter((lvl) => {
    if (selectedStageFilter === 'all') return true;
    return lvl.stage === selectedStageFilter;
  });

  const nextPlayableLevel = getLevelDef(highestUnlockedLevel);

  const handleLevelClick = (level: LevelDef) => {
    if (level.levelNumber <= highestUnlockedLevel) {
      playButtonTap();
      onSelectLevel(level);
    } else {
      playWrongSelection();
    }
  };

  const handleClaimChest = (level: LevelDef, e: MouseEvent) => {
    e.stopPropagation();
    if (claimedMilestones.includes(level.levelNumber)) return;
    playLevelWin();
    onClaimMilestone(level.levelNumber, level.coinReward);
    setCelebrationChest({
      levelNum: level.levelNumber,
      coinsEarned: level.coinReward,
    });
  };

  return (
    <div
      id="level-journey-screen"
      className="flex flex-col flex-1 w-full px-4 py-4 max-w-lg mx-auto select-none"
    >
      {/* Header */}
      <div id="journey-header" className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <button
            id="journey-back-btn"
            onClick={() => {
              playButtonTap();
              onBack();
            }}
            className="p-2.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5 transition-colors">
              <span>Mind Levels</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                Lvl {highestUnlockedLevel}
              </span>
            </h1>
          </div>
        </div>

        {/* Right side: Stars, Coins, Theme */}
        <div className="flex items-center gap-2">
          <div
            id="journey-stars-pill"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 font-bold text-xs"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono">{totalStars}</span>
          </div>

          <button
            id="journey-coins-pill"
            onClick={() => {
              if (onOpenShop) {
                playSatisfyingClick();
                onOpenShop();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-900 dark:text-slate-100 font-bold text-xs transition-all active:scale-95 hover:border-amber-400 dark:hover:border-amber-600"
            title="Open Theme & Wallpaper Shop"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950">
              <Coins className="w-2.5 h-2.5" />
            </div>
            <span className="font-mono">{coins}</span>
          </button>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="journey-theme-toggle-btn"
          />
        </div>
      </div>

      {/* Brain Sharpness & Rank Quotient Card */}
      <div
        id="brain-sharpness-card"
        className="mb-3 p-3.5 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Brain className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-100">
                Cognitive Sharpness Rank
              </div>
              <div className="text-sm font-black flex items-center gap-1.5 text-white">
                <span>{brainRank.rankTitle}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-sm bg-white/20 font-mono">
                  IQ {brainRank.rating}
                </span>
              </div>
            </div>
          </div>

          {onSwitchToCategories && (
            <button
              onClick={() => {
                playButtonTap();
                onSwitchToCategories();
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-all flex items-center gap-1"
            >
              <span>Categories</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Progress Bar to next Rank */}
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-blue-100 mb-1 font-medium">
            <span>{completedLevelsCount} Levels Solved</span>
            <span>Next Rank: {brainRank.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-amber-300 to-emerald-300 transition-all duration-500 rounded-full"
              style={{ width: `${brainRank.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Selector Pills */}
      <div
        id="stage-pills-bar"
        className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar"
      >
        <button
          onClick={() => {
            playButtonTap();
            setSelectedStageFilter('all');
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            selectedStageFilter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'bg-white dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All Stages ({CURATED_LEVELS.length})
        </button>

        {STAGES_CONFIG.map((stage) => {
          const isSelected = selectedStageFilter === stage.stage;
          return (
            <button
              key={stage.stage}
              onClick={() => {
                playButtonTap();
                setSelectedStageFilter(stage.stage);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-zinc-600 dark:text-slate-400 border border-zinc-200 dark:border-slate-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{stage.emoji}</span>
              <span>Stage {stage.stage}</span>
            </button>
          );
        })}
      </div>

      {/* Levels List */}
      <div
        id="levels-grid"
        className="flex flex-col gap-2 pb-24 overflow-y-auto pr-0.5"
      >
        {displayedLevels.map((level) => {
          const isUnlocked = level.levelNumber <= highestUnlockedLevel;
          const isNextLevel = level.levelNumber === highestUnlockedLevel;
          const record = levelProgress[level.levelNumber];
          const isCompleted = Boolean(record);
          const starsEarned = record ? record.stars : 0;
          const isMilestone = level.milestone;
          const isClaimed = claimedMilestones.includes(level.levelNumber);

          return (
            <div
              key={level.levelNumber}
              id={`level-node-${level.levelNumber}`}
              onClick={() => handleLevelClick(level)}
              className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                !isUnlocked
                  ? 'bg-zinc-100/70 dark:bg-slate-900/30 border-zinc-200 dark:border-slate-800/60 opacity-60'
                  : isNextLevel
                  ? 'bg-white dark:bg-slate-900 border-blue-500/90 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : isCompleted
                  ? 'bg-white dark:bg-slate-900 border-emerald-300/70 dark:border-emerald-500/30 shadow-2xs hover:shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-zinc-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Level Number Badge or Lock */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-black text-sm transition-colors ${
                    !isUnlocked
                      ? 'bg-zinc-200 dark:bg-slate-800 text-zinc-400 dark:text-slate-500'
                      : isNextLevel
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 dark:bg-slate-800 text-zinc-800 dark:text-slate-100'
                  }`}
                >
                  {!isUnlocked ? (
                    <Lock className="w-4 h-4" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{level.levelNumber}</span>
                  )}
                </div>

                {/* Level Info */}
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-base">{level.emoji}</span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-slate-100 leading-tight">
                      {level.title}
                    </h3>
                    {isNextLevel && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        NEXT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-slate-400 font-medium">
                    <span>{level.words.length} words</span>
                    <span>•</span>
                    <span>{level.gridSize}×{level.gridSize} grid</span>
                    <span>•</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{level.tier}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Stars or Milestone Chest or Lock */}
              <div className="flex items-center gap-2">
                {isMilestone && (
                  <button
                    onClick={(e) => isCompleted && handleClaimChest(level, e)}
                    disabled={!isCompleted || isClaimed}
                    className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                      isClaimed
                        ? 'bg-zinc-100 dark:bg-slate-800/80 text-zinc-400 opacity-60'
                        : isCompleted
                        ? 'bg-amber-400 text-amber-950 shadow-md animate-bounce'
                        : 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-600/70 border border-amber-300/40'
                    }`}
                    title={isClaimed ? 'Milestone Claimed' : 'Milestone Reward Chest'}
                  >
                    <Gift className="w-4 h-4" />
                    {isCompleted && !isClaimed && (
                      <span className="text-[10px] font-black">+{level.coinReward}</span>
                    )}
                  </button>
                )}

                {/* Stars Rating display */}
                {isUnlocked && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-4 h-4 ${
                          starNum <= starsEarned
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action: Quick Resume / Play Next Level */}
      <div
        id="journey-bottom-action"
        className="fixed bottom-14 left-0 right-0 max-w-lg mx-auto px-4 pointer-events-none"
      >
        <div className="pointer-events-auto shadow-xl rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 border border-zinc-200/90 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 pl-1.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg font-bold">
              {nextPlayableLevel.emoji}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-slate-500">
                Ready to play
              </div>
              <div className="text-xs font-bold text-zinc-900 dark:text-slate-100">
                Level {nextPlayableLevel.levelNumber}: {nextPlayableLevel.title}
              </div>
            </div>
          </div>

          <button
            id="journey-play-next-btn"
            onClick={() => {
              playButtonTap();
              onSelectLevel(nextPlayableLevel);
            }}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-all shadow-md shadow-blue-500/25 active:scale-95 flex items-center gap-1.5"
          >
            <span>PLAY NOW</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Milestone Claim Celebration Modal */}
      {celebrationChest && (
        <div
          id="chest-claim-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div className="w-full max-w-xs p-5 rounded-3xl bg-white dark:bg-slate-900 text-center shadow-2xl border border-zinc-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center mx-auto mb-3 text-3xl">
              🎁
            </div>
            <h3 className="text-lg font-black text-zinc-900 dark:text-slate-100 mb-1">
              Milestone Reward!
            </h3>
            <p className="text-xs text-zinc-500 dark:text-slate-400 mb-4">
              Level {celebrationChest.levelNum} brain booster chest unlocked!
            </p>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-sm flex items-center justify-center gap-2 mb-4">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>+{celebrationChest.coinsEarned} Bonus Coins!</span>
            </div>

            <button
              onClick={() => setCelebrationChest(null)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
