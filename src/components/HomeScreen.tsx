import { Brain, Calendar, Check, Coins, Compass, Download, Flame, Grid, Music, Palette, Play, Settings, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import { usePWA } from '../hooks/usePWA.ts';
import { DailyChallengeDef, DailyStreakInfo, Theme } from '../types.ts';
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
  dailyStreak: DailyStreakInfo;
  todayChallenge: DailyChallengeDef;
  soundEnabled: boolean;
  theme: Theme;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenShop?: () => void;
  onPlayLevelJourney: () => void;
  onPlayCategories: () => void;
  onPlayDailyChallenge: () => void;
}

export function HomeScreen({
  coins,
  highestUnlockedLevel,
  totalStars,
  brainRankTitle,
  completedCategoriesCount,
  totalCategories,
  dailyStreak,
  todayChallenge,
  soundEnabled,
  theme,
  onToggleSound,
  onToggleTheme,
  onOpenSettings,
  onOpenShop,
  onPlayLevelJourney,
  onPlayCategories,
  onPlayDailyChallenge,
}: HomeScreenProps) {
  const { canInstall, installApp } = usePWA();
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
        <button
          id="home-coins-pill"
          onClick={() => {
            if (onOpenShop) {
              playSatisfyingClick();
              onOpenShop();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 text-zinc-900 dark:text-slate-100 font-bold text-xs tracking-tight transition-all active:scale-95 hover:border-amber-400 dark:hover:border-amber-600 group"
          title="Open Theme & Wallpaper Shop"
        >
          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 shadow-xs group-hover:scale-110 transition-transform">
            <Coins className="w-2.5 h-2.5" />
          </div>
          <span className="font-mono text-sm">{coins}</span>
          <span className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase font-semibold">Coins</span>
          {onOpenShop && (
            <span className="text-[9px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold uppercase border border-amber-300 dark:border-amber-700">
              Shop
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          {/* Stars Count */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-mono">{totalStars}</span>
          </div>

          {canInstall && (
            <button
              id="home-install-pwa-btn"
              onClick={async () => {
                playSatisfyingClick();
                await installApp();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all active:scale-95 shadow-xs"
              title="Install App to Home Screen"
            >
              <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Install</span>
            </button>
          )}

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
            title="Audio, AdMob & App Settings"
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

      {/* Bottom Actions: Daily Challenge + Level Journey + Categories Mode */}
      <div id="home-actions" className="w-full flex flex-col items-center gap-2.5 pb-2">
        {/* Daily Challenge Action Card */}
        <button
          id="home-daily-challenge-btn"
          onClick={() => {
            playButtonTap();
            onPlayDailyChallenge();
          }}
          className={`relative group w-full py-3.5 px-4 rounded-2xl border transition-all duration-200 transform active:scale-[0.98] flex items-center justify-between text-left overflow-hidden ${
            dailyStreak.isCompletedToday
              ? 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-700/60 shadow-xs'
              : 'bg-linear-to-r from-amber-500 via-amber-600 to-orange-500 text-white border-amber-400/80 shadow-md shadow-amber-500/25 hover:brightness-105'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl relative shrink-0 shadow-xs ${
                dailyStreak.isCompletedToday
                  ? 'bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800'
                  : 'bg-white/20'
              }`}
            >
              <span>{todayChallenge.emoji}</span>
              {dailyStreak.isCompletedToday && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="text-left">
              <div
                className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 ${
                  dailyStreak.isCompletedToday
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-amber-100'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Daily Challenge • {todayChallenge.formattedDate}</span>
              </div>
              <div
                className={`text-sm font-black leading-tight ${
                  dailyStreak.isCompletedToday
                    ? 'text-zinc-900 dark:text-slate-100'
                    : 'text-white'
                }`}
              >
                {todayChallenge.theme}
              </div>
              <div
                className={`text-[11px] font-medium ${
                  dailyStreak.isCompletedToday
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-amber-100/90'
                }`}
              >
                {dailyStreak.isCompletedToday
                  ? 'Completed today • Tap to replay'
                  : 'Fresh puzzle • Win +120 coins'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Streak Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-xs ${
                dailyStreak.isCompletedToday
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : 'bg-white/25 text-white border border-white/30'
              }`}
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  dailyStreak.currentStreak > 0
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-amber-200'
                }`}
              />
              <span className="font-mono">
                {dailyStreak.currentStreak > 0 ? `${dailyStreak.currentStreak}d` : 'New'}
              </span>
            </div>

            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                dailyStreak.isCompletedToday
                  ? 'bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-200'
                  : 'bg-white/20 text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
          </div>
        </button>

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

        {/* Theme & Wallpaper Store Button */}
        {onOpenShop && (
          <button
            id="home-themes-shop-btn"
            onClick={() => {
              playSatisfyingClick();
              onOpenShop();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-linear-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 hover:from-amber-500/20 hover:via-purple-500/20 hover:to-blue-500/20 border border-amber-300/70 dark:border-amber-700/60 text-zinc-800 dark:text-slate-200 font-bold text-xs tracking-wide shadow-2xs transition-all active:scale-[0.98] flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-black flex items-center gap-1.5 leading-tight text-zinc-900 dark:text-slate-100">
                  <span>Theme & Wallpaper Store</span>
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-slate-400 font-medium">
                  Unlock custom styles with coins
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300/80 dark:border-amber-700/80">
              <Coins className="w-3 h-3 fill-amber-400 text-amber-600" />
              <span>Shop</span>
            </div>
          </button>
        )}

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
