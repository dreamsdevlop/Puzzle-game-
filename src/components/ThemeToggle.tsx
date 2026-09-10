import { Moon, Sun } from 'lucide-react';
import { Theme } from '../types.ts';
import { playButtonTap } from '../utils/audio.ts';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
  id?: string;
}

export function ThemeToggle({
  theme,
  onToggle,
  className = '',
  id = 'theme-toggle-btn',
}: ThemeToggleProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => {
        playButtonTap();
        onToggle();
      }}
      className={`p-2 sm:p-2.5 rounded-full border transition-all duration-200 active:scale-95 shadow-xs flex items-center justify-center ${
        theme === 'dark'
          ? 'bg-slate-800/90 border-slate-700 text-amber-300 hover:text-amber-200 hover:bg-slate-700 shadow-slate-900/50'
          : 'bg-white border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400/20 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 fill-slate-700/10 transition-transform duration-200 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
