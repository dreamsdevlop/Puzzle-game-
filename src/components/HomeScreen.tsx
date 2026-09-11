import { Brain, Coins, Compass, Grid, Music, Play, Settings, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import { Theme } from '../types.ts';
import { playButtonTap, playSatisfyingClick } from '../utils/audio.ts';
import { MUSIC_TRACKS } from '../utils/musicEngine.ts';
import { Storage } from '../utils/storage.ts';
import { ThemeToggle } from './ThemeToggle.tsx';

interface HomeScreenProps {
  coins: number;
  highestUnlockedLevel: number;
  totalStars: number;
  brainRankTitle: string;
  completedCategoriesCount: number;
  totalCategories: number;
  soundEnabled: boolean;
  theme: Theme;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onPlayLevelJourney: () => void;
  onPlayCategories: () => void;
}

export function HomeScreen({
  coins,
  highestUnlockedLevel,
  totalStars,
  brainRankTitle,
  completedCategoriesCount,
  totalCategories,
  soundEnabled,
  theme,
  onToggleSound,
  onToggleTheme,
  onOpenSettings,
  onPlayLevelJourney,
  onPlayCategories,
}: HomeScreenProps) {
  const currentTrackId = Storage.getMusicTrack();
  const currentTrack = MUSIC_TRACKS.find((t) => t.id === currentTrackId) || MUSIC_TRACKS[0];
  const isMusicOn = Storage.getMusicEnabled();
  return (
    <div
      id="home-screen"
      className="flex flex-col items-center justify-between flex-1 w-full px-4 py-5 max-w-md mx-auto select-none overflow-y-auto"
    >
      {/* Top Bar: Coin pill & Sound / Theme toggles */}
      <div id="home-top-bar" className="w-full flex items-center justify-between pt-1">
        <div
          id="home-coins-pill"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 text-zinc-900 dark:text-slate-100 font-bold text-xs tracking-tight transition-colors"
        >
          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 shadow-xs">
            <Coins className="w-2.5 h-2.5" />
          </div>
          <span className="font-mono text-sm">{coins}</span>
          <span className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase font-semibold">Coins</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Stars Count */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono">{totalStars}</span>
          </div>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="home-theme-toggle-btn"
          />

          <button
            id="home-settings-btn"
            onClick={() => {
              playSatisfyingClick();
              onOpenSettings();
            }}
            className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 text-zinc-600 dark:text-slate-300 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95 flex items-center justify-center"
            title="Audio & Music Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Relaxing Ambience Status Pill */}
      <div className="w-full flex justify-center pt-2">
        <button
          id="home-music-pill-btn"
          onClick={() => {
            playSatisfyingClick();
            onOpenSettings();
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-zinc-200/80 dark:border-slate-800 text-[11px] font-bold text-zinc-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs transition-all active:scale-95"
        >
          <Music className={`w-3 h-3 ${isMusicOn ? 'text-blue-600 dark:text-blue-400 animate-bounce' : 'text-zinc-400'}`} />
          <span>
            {isMusicOn ? `Playing: ${currentTrack.name}` : 'Ambience Muted — Tap for Music'}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-slate-500 font-normal">
            ⚙️
          </span>
        </button>
      </div>

      {/* Main Logo & Title Hero */}
      <div id="home-hero" className="flex flex-col items-center text-center my-auto py-4">
        {/* Animated Stylized Word Search Logo */}
        <div className="relative mb-5">
          {/* Decorative backdrop glow */}
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-[#2f80ed]/25 via-[#ff8c1a]/20 to-[#f83f8f]/25 blur-lg -z-10 dark:from-blue-600/30 dark:to-purple-600/30" />

          {/* Stylized 3x3 letter puzzle logo block */}
          <div className="grid grid-cols-3 gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-zinc-200/70 dark:border-slate-800 transition-colors">
            {['W', 'O', 'R', 'S', 'E', 'A', 'R', 'C', 'H'].map((letter, idx) => {
              const bgColors = [
                'bg-blue-500 text-white',
                'bg-amber-400 text-amber-950',
                'bg-pink-500 text-white',
                'bg-emerald-500 text-white',
                'bg-purple-500 text-white',
                'bg-orange-500 text-white',
                'bg-teal-500 text-white',
                'bg-rose-500 text-white',
                'bg-indigo-500 text-white',
              ];
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-base sm:text-lg shadow-xs ${bgColors[idx]} transform transition-transform hover:scale-105`}
                >
                  {letter}
                </div>
              );
            })}
          </div>

          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-md">
            <Sparkles className="w-4 h-4 fill-amber-950" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] dark:text-slate-50 tracking-tight mb-1.5 transition-colors">
          WORD SEARCH
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 max-w-xs font-medium leading-relaxed mb-3 transition-colors">
          Boost your mind and reflexes through 50+ cognitive progression levels and 15 rich categories!
        </p>

        {/* Brain Rank Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-800 dark:text-blue-200 shadow-2xs">
          <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{brainRankTitle}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-200 dark:bg-blue-900 font-mono">
            Lvl {highestUnlockedLevel}
          </span>
        </div>
      </div>

      {/* Bottom Actions: Play Level Journey + Categories Mode */}
      <div id="home-actions" className="w-full flex flex-col items-center gap-2.5 pb-2">
        {/* Primary Action: Level Journey */}
        <button
          id="home-level-journey-btn"
          onClick={() => {
            playButtonTap();
            onPlayLevelJourney();
          }}
          className="relative group w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base tracking-wide shadow-lg shadow-blue-500/30 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-between px-5 overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">
                Mind Progression
              </div>
              <div className="text-base font-black leading-tight">
                Play Level {highestUnlockedLevel}
              </div>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>

          {/* Shimmer effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
        </button>

        {/* Secondary Action: Categories Mode */}
        <button
          id="home-categories-btn"
          onClick={() => {
            playButtonTap();
            onPlayCategories();
          }}
          className="w-full py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-zinc-50 dark:hover:bg-slate-800 border border-zinc-200/90 dark:border-slate-800 text-zinc-800 dark:text-slate-200 font-bold text-xs tracking-wide shadow-2xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Grid className="w-4 h-4 text-zinc-500" />
          <span>Free Categories ({completedCategoriesCount}/{totalCategories} Unlocked)</span>
        </button>

        {/* Cognitive Perks Info */}
        <div className="w-full grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-500 dark:text-slate-400 pt-1 transition-colors">
          <div className="p-1.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-zinc-200/60 dark:border-slate-800/80 flex flex-col items-center">
            <span className="text-sm">🎯</span>
            <span className="font-semibold text-zinc-700 dark:text-slate-200">50+ Levels</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-zinc-200/60 dark:border-slate-800/80 flex flex-col items-center">
            <span className="text-sm">⚡</span>
            <span className="font-semibold text-zinc-700 dark:text-slate-200">Fluid Slides</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-zinc-200/60 dark:border-slate-800/80 flex flex-col items-center">
            <span className="text-sm">🧠</span>
            <span className="font-semibold text-zinc-700 dark:text-slate-200">Sharper Mind</span>
          </div>
        </div>
      </div>
    </div>
  );
}
