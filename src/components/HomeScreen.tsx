import { Coins, Play, Volume2, VolumeX, Award, Sparkles, BookOpen } from 'lucide-react';
import { playButtonTap } from '../utils/audio.ts';

interface HomeScreenProps {
  coins: number;
  completedCount: number;
  totalCategories: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayClick: () => void;
}

export function HomeScreen({
  coins,
  completedCount,
  totalCategories,
  soundEnabled,
  onToggleSound,
  onPlayClick,
}: HomeScreenProps) {
  const handlePlay = () => {
    playButtonTap();
    onPlayClick();
  };

  return (
    <div
      id="home-screen"
      className="flex flex-col items-center justify-between flex-1 w-full px-4 py-6 max-w-md mx-auto select-none"
    >
      {/* Top Bar: Coin pill & Sound toggle */}
      <div id="home-top-bar" className="w-full flex items-center justify-between pt-2">
        <div
          id="home-coins-pill"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-zinc-200/80 text-zinc-900 font-bold text-sm tracking-tight"
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 shadow-xs">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-base">{coins}</span>
          <span className="text-[11px] text-zinc-400 uppercase font-semibold">Coins</span>
        </div>

        <button
          id="home-sound-toggle-btn"
          onClick={() => {
            playButtonTap();
            onToggleSound();
          }}
          className="p-2.5 rounded-full bg-white shadow-xs border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 transition-all active:scale-95"
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
        </button>
      </div>

      {/* Main Logo & Title Hero */}
      <div id="home-hero" className="flex flex-col items-center text-center my-auto py-6">
        {/* Animated Stylized Word Search Logo */}
        <div className="relative mb-6">
          {/* Decorative backdrop glow */}
          <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-[#2f80ed]/20 via-[#ff8c1a]/20 to-[#f83f8f]/20 blur-lg -z-10" />

          {/* Stylized 3x3 letter puzzle logo block */}
          <div className="grid grid-cols-3 gap-1.5 p-3 rounded-2xl bg-white shadow-md border border-zinc-200/70">
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
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-xs ${bgColors[idx]} transform transition-transform hover:scale-105`}
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

        <h1 className="text-3xl sm:text-4xl font-black text-[#1a1a1a] tracking-tight mb-2">
          WORD SEARCH
        </h1>
        <p className="text-sm text-zinc-500 max-w-xs font-medium leading-relaxed">
          Swipe through letters in all 8 directions to discover hidden words & unlock 15 categories!
        </p>

        {/* Level unlock progress chip */}
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-zinc-200 text-xs font-semibold text-zinc-600 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-[#2f80ed]" />
          <span>
            {completedCount} / {totalCategories} Categories Unlocked
          </span>
        </div>
      </div>

      {/* Bottom Actions: Animated Play Button & Stats */}
      <div id="home-actions" className="w-full flex flex-col items-center gap-4 pb-4">
        <button
          id="home-play-button"
          onClick={handlePlay}
          className="relative group w-full py-4 rounded-2xl bg-linear-to-r from-[#2f80ed] via-[#2d70cb] to-[#2563eb] text-white font-black text-lg tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
          <span>PLAY PUZZLE</span>

          {/* Shimmer effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
        </button>

        {/* Feature Highlights row */}
        <div className="w-full grid grid-cols-3 gap-2 text-center text-[11px] text-zinc-500 pt-1">
          <div className="p-2 rounded-xl bg-white/60 border border-zinc-200/60 flex flex-col items-center gap-1">
            <span className="text-base">🧩</span>
            <span className="font-semibold text-zinc-700">15 Categories</span>
          </div>
          <div className="p-2 rounded-xl bg-white/60 border border-zinc-200/60 flex flex-col items-center gap-1">
            <span className="text-base">⏱️</span>
            <span className="font-semibold text-zinc-700">2 Game Modes</span>
          </div>
          <div className="p-2 rounded-xl bg-white/60 border border-zinc-200/60 flex flex-col items-center gap-1">
            <span className="text-base">💡</span>
            <span className="font-semibold text-zinc-700">Hints & Bonus</span>
          </div>
        </div>
      </div>
    </div>
  );
}
