import { useEffect, useRef, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Coins,
  Flame,
  Lightbulb,
  Palette,
  Pause,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Category, DailyChallengeDef, FoundWord, GameMode, GridCoord, LevelDef, PlacedWord, Theme, TileTheme } from '../types.ts';
import { HIGHLIGHT_COLORS } from '../data/colors.ts';
import { BONUS_WORDS_SET } from '../data/bonusDictionary.ts';
import { getTileThemeById } from '../data/shopThemes.ts';
import {
  calculateMagneticLine,
  coordsToWord,
  generatePuzzle,
  getLineCoords,
} from '../utils/gridGenerator.ts';
import {
  playBonusWordSparkle,
  playButtonTap,
  playCountdownTick,
  playCorrectWord,
  playDragSwoosh,
  playGameOverDescending,
  playSatisfyingClick,
  playSlideLetterTick,
  playWrongSelection,
} from '../utils/audio.ts';
import { ThemeToggle } from './ThemeToggle.tsx';
import { Brain, Star } from 'lucide-react';

interface GameScreenProps {
  category?: Category;
  level?: LevelDef;
  dailyChallenge?: DailyChallengeDef;
  mode: GameMode;
  coins: number;
  soundEnabled: boolean;
  theme: Theme;
  tileTheme?: TileTheme;
  onOpenShop?: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenSettings?: () => void;
  onLevelComplete: (data: {
    score: number;
    timeTakenSeconds: number;
    bonusWords: string[];
    timeLeftSeconds: number;
    stars: number;
  }) => void;
  onBack: () => void;
  onRequestRewardedAd: (onSuccess: () => void) => void;
}

export function GameScreen({
  category,
  level,
  dailyChallenge,
  mode,
  coins,
  soundEnabled,
  theme,
  tileTheme,
  onOpenShop,
  onToggleSound,
  onToggleTheme,
  onOpenSettings,
  onLevelComplete,
  onBack,
  onRequestRewardedAd,
}: GameScreenProps) {
  const activeTarget = dailyChallenge || level || category!;
  const targetWords = activeTarget.words;
  const isLevelMode = Boolean(level);
  const isDaily = Boolean(dailyChallenge);
  const activeTileTheme = tileTheme || getTileThemeById('tile_default');

  // Puzzle Generation
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(activeTarget));
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [foundBonusWords, setFoundBonusWords] = useState<string[]>([]);

  // Scoring, Combo System & Stats
  const [score, setScore] = useState(0);
  const [scorePop, setScorePop] = useState<{ id: number; text: string; color: string } | null>(null);
  const [bonusToast, setBonusToast] = useState<string | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [lastWordTime, setLastWordTime] = useState(0);
  const [comboToast, setComboToast] = useState<string | null>(null);

  // Timer: Classic counts up, Time counts down from 120s (2 mins)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Hints: 3 hints per puzzle
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintingCoords, setHintingCoords] = useState<GridCoord[]>([]);

  // Selection Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<GridCoord | null>(null);
  const [currentSelectedCoords, setCurrentSelectedCoords] = useState<GridCoord[]>([]);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridRectRef = useRef<DOMRect | null>(null);
  const startPixelRef = useRef<{ x: number; y: number } | null>(null);
  const cellSizeRef = useRef<number>(35);

  // Timer effect
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const timer = setInterval(() => {
      if (mode === 'classic') {
        setElapsedSeconds((prev) => prev + 1);
      } else {
        // Time Mode: 2-minute countdown
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            playGameOverDescending();
            return 0;
          }
          if (prev - 1 < 30) {
            playCountdownTick();
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isGameOver, isPaused]);

  // Check victory condition
  useEffect(() => {
    if (foundWords.length > 0 && foundWords.length === targetWords.length) {
      // Calculate stars earned
      let stars = 1;
      const targetSec = level ? level.targetSeconds : 120;
      if (elapsedSeconds <= targetSec) {
        stars = 3;
      } else if (elapsedSeconds <= targetSec * 1.6) {
        stars = 2;
      }

      // Time bonus (Time mode only): +timeLeft * 2
      const timeBonus = mode === 'time' ? timeRemaining * 2 : 0;
      const finalScore = score + timeBonus;

      onLevelComplete({
        score: finalScore,
        timeTakenSeconds: elapsedSeconds,
        bonusWords: foundBonusWords,
        timeLeftSeconds: timeRemaining,
        stars,
      });
    }
  }, [
    foundWords.length,
    targetWords.length,
    score,
    mode,
    timeRemaining,
    elapsedSeconds,
    foundBonusWords,
    level,
    onLevelComplete,
  ]);

  // Helper to format time MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cell finder from pointer coordinates
  const getCellFromPoint = (clientX: number, clientY: number): GridCoord | null => {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const cellEl = el.closest('[data-row][data-col]');
    if (!cellEl) return null;
    const row = parseInt(cellEl.getAttribute('data-row') || '-1', 10);
    const col = parseInt(cellEl.getAttribute('data-col') || '-1', 10);
    if (row >= 0 && col >= 0 && row < puzzle.size && col < puzzle.size) {
      return { row, col };
    }
    return null;
  };

  // Drag start
  const handleDragStart = (row: number, col: number, clientX?: number, clientY?: number) => {
    if (isGameOver || isPaused) return;

    const gridEl = gridRef.current;
    if (gridEl) {
      const rect = gridEl.getBoundingClientRect();
      gridRectRef.current = rect;
      const cellSize = rect.width / puzzle.size;
      cellSizeRef.current = cellSize;
      const centerX = rect.left + (col + 0.5) * cellSize;
      const centerY = rect.top + (row + 0.5) * cellSize;
      startPixelRef.current = { x: centerX, y: centerY };
    } else if (clientX !== undefined && clientY !== undefined) {
      startPixelRef.current = { x: clientX, y: clientY };
    }

    setIsDragging(true);
    setStartCell({ row, col });
    setCurrentSelectedCoords([{ row, col }]);
    playSlideLetterTick(1);
  };

  // Drag over with high-precision magnetic ray directional snapping
  const handleDragOver = (clientX: number, clientY: number) => {
    if (!isDragging || !startCell) return;

    let startX = startPixelRef.current?.x;
    let startY = startPixelRef.current?.y;
    let cellSize = cellSizeRef.current;

    // Dynamically calculate grid metrics if not yet cached
    if (!startX || !startY || !cellSize) {
      const gridEl = gridRef.current;
      if (gridEl) {
        const rect = gridEl.getBoundingClientRect();
        gridRectRef.current = rect;
        cellSize = rect.width / puzzle.size;
        cellSizeRef.current = cellSize;
        startX = rect.left + (startCell.col + 0.5) * cellSize;
        startY = rect.top + (startCell.row + 0.5) * cellSize;
        startPixelRef.current = { x: startX, y: startY };
      }
    }

    if (!startX || !startY || !cellSize) return;

    const dx = clientX - startX;
    const dy = clientY - startY;

    // Compute magnetic snapped line along allowed directions
    const line = calculateMagneticLine(
      startCell,
      dx,
      dy,
      cellSize,
      puzzle.size,
      level?.allowedDirections,
    );

    if (
      line.length !== currentSelectedCoords.length ||
      line[line.length - 1]?.row !== currentSelectedCoords[currentSelectedCoords.length - 1]?.row ||
      line[line.length - 1]?.col !== currentSelectedCoords[currentSelectedCoords.length - 1]?.col
    ) {
      setCurrentSelectedCoords(line);
      playSlideLetterTick(line.length);
    }
  };

  // Drag end / Word Validation
  const handleDragEnd = () => {
    if (!isDragging || !startCell || currentSelectedCoords.length === 0) {
      setIsDragging(false);
      setStartCell(null);
      startPixelRef.current = null;
      setCurrentSelectedCoords([]);
      return;
    }

    const forwardWord = coordsToWord(puzzle.grid, currentSelectedCoords).toUpperCase();
    const reverseWord = forwardWord.split('').reverse().join('');

    // Check if it matches an unfound target puzzle word
    let matchedWord: string | null = null;
    let matchedCoords = currentSelectedCoords;

    const unfoundWords = targetWords.filter(
      (w) => !foundWords.some((fw) => fw.word === w),
    );

    if (unfoundWords.includes(forwardWord)) {
      matchedWord = forwardWord;
      matchedCoords = currentSelectedCoords;
    } else if (unfoundWords.includes(reverseWord)) {
      matchedWord = reverseWord;
      matchedCoords = [...currentSelectedCoords].reverse();
    }

    if (matchedWord) {
      // Correct puzzle word found!
      playCorrectWord();
      const colorIndex = foundWords.length % HIGHLIGHT_COLORS.length;
      const assignedColor = HIGHLIGHT_COLORS[colorIndex].bgRgba;

      setFoundWords((prev) => [
        ...prev,
        {
          word: matchedWord!,
          color: assignedColor,
          coords: matchedCoords,
        },
      ]);

      // Combo System: Reward fast pattern discovery
      const now = Date.now();
      let nextCombo = 1;
      if (lastWordTime > 0 && now - lastWordTime < 8500) {
        nextCombo = comboCount + 1;
      }
      setComboCount(nextCombo);
      setLastWordTime(now);

      const comboBonus = (nextCombo - 1) * 5;
      const earnedScore = 10 + comboBonus;
      setScore((prev) => prev + earnedScore);

      if (nextCombo > 1) {
        triggerScorePop(`+${earnedScore} 🔥${nextCombo}x`, 'text-amber-500');
        setComboToast(`🔥 ${nextCombo}x Combo! Brain In The Zone! (+${comboBonus} bonus)`);
        setTimeout(() => setComboToast(null), 2200);
      } else {
        triggerScorePop('+10', 'text-emerald-500');
      }
    } else {
      // Check for Bonus Word:
      let bonusCandidate: string | null = null;
      if (
        forwardWord.length >= 3 &&
        BONUS_WORDS_SET.has(forwardWord) &&
        !targetWords.includes(forwardWord) &&
        !foundBonusWords.includes(forwardWord)
      ) {
        bonusCandidate = forwardWord;
      } else if (
        reverseWord.length >= 3 &&
        BONUS_WORDS_SET.has(reverseWord) &&
        !targetWords.includes(reverseWord) &&
        !foundBonusWords.includes(reverseWord)
      ) {
        bonusCandidate = reverseWord;
      }

      if (bonusCandidate) {
        // Bonus word found!
        playBonusWordSparkle();
        setFoundBonusWords((prev) => [...prev, bonusCandidate!]);
        setScore((prev) => prev + 5);
        triggerScorePop('+5 Bonus', 'text-amber-500');

        setBonusToast(`Bonus Word: ${bonusCandidate} (+5 pts)`);
        setTimeout(() => setBonusToast(null), 2200);
      } else {
        // Not a word or already found
        if (currentSelectedCoords.length > 1) {
          playWrongSelection();
          setComboCount(0);
        }
      }
    }

    startPixelRef.current = null;
    setIsDragging(false);
    setStartCell(null);
    setCurrentSelectedCoords([]);
  };

  const triggerScorePop = (text: string, color: string) => {
    setScorePop({ id: Date.now(), text, color });
    setTimeout(() => {
      setScorePop((current) => (current?.text === text ? null : current));
    }, 1000);
  };

  // Global pointer listeners for smooth swiping across cells and reliable drag-end
  const isDraggingRef = useRef(isDragging);
  isDraggingRef.current = isDragging;
  const handleDragOverRef = useRef(handleDragOver);
  handleDragOverRef.current = handleDragOver;
  const handleDragEndRef = useRef(handleDragEnd);
  handleDragEndRef.current = handleDragEnd;

  useEffect(() => {
    const onGlobalMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        handleDragOverRef.current(e.clientX, e.clientY);
      }
    };
    const onGlobalUp = () => {
      if (isDraggingRef.current) {
        handleDragEndRef.current();
      }
    };

    window.addEventListener('pointermove', onGlobalMove, { passive: true });
    window.addEventListener('pointerup', onGlobalUp);
    window.addEventListener('pointercancel', onGlobalUp);

    return () => {
      window.removeEventListener('pointermove', onGlobalMove);
      window.removeEventListener('pointerup', onGlobalUp);
      window.removeEventListener('pointercancel', onGlobalUp);
    };
  }, []);

  // Hint button click
  const handleHintClick = () => {
    playButtonTap();

    if (hintsRemaining <= 0) {
      // Offer Rewarded Ad to get +2 extra hints
      onRequestRewardedAd(() => {
        setHintsRemaining((prev) => prev + 2);
      });
      return;
    }

    // Find unfound words that are placed on the board
    const unfoundPlacedWords = puzzle.placedWords.filter(
      (pw) => !foundWords.some((fw) => fw.word === pw.word),
    );

    if (unfoundPlacedWords.length === 0) return;

    // Pick random unfound word
    const randomPick =
      unfoundPlacedWords[Math.floor(Math.random() * unfoundPlacedWords.length)];

    setHintsRemaining((prev) => prev - 1);
    setHintingCoords(randomPick.coords);

    // 3 pulses over 1.5 seconds, then clear
    setTimeout(() => {
      setHintingCoords([]);
    }, 1600);
  };

  // Helpers to check cell states
  const isCellInSelection = (r: number, c: number) =>
    currentSelectedCoords.some((coord) => coord.row === r && coord.col === c);

  const getCellFoundColors = (r: number, c: number): string[] => {
    return foundWords
      .filter((fw) => fw.coords.some((coord) => coord.row === r && coord.col === c))
      .map((fw) => fw.color);
  };

  const isCellHinting = (r: number, c: number) =>
    hintingCoords.some((coord) => coord.row === r && coord.col === c);

  // Selected word string preview
  const currentSelectionWord = isDragging
    ? coordsToWord(puzzle.grid, currentSelectedCoords).toUpperCase()
    : '';

  const reversedSelectionWord = currentSelectionWord.split('').reverse().join('');

  // Check if current active swipe matches an unfound target puzzle word
  const isTargetWordCandidate = Boolean(
    currentSelectionWord &&
    currentSelectionWord.length >= 2 &&
    targetWords.some(
      (w) =>
        !foundWords.some((fw) => fw.word === w) &&
        (w === currentSelectionWord || w === reversedSelectionWord),
    ),
  );

  // Check if current active swipe matches a valid dictionary bonus word
  const isBonusWordCandidate = Boolean(
    !isTargetWordCandidate &&
    currentSelectionWord.length >= 3 &&
    (BONUS_WORDS_SET.has(currentSelectionWord) || BONUS_WORDS_SET.has(reversedSelectionWord)) &&
    !targetWords.includes(currentSelectionWord) &&
    !foundBonusWords.includes(currentSelectionWord),
  );

  return (
    <div
      id="game-screen"
      className="flex flex-col flex-1 w-full px-3 py-2 max-w-lg mx-auto select-none justify-between overflow-y-auto"
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      {/* Top Bar */}
      <div id="game-top-bar" className="flex items-center justify-between gap-2 pb-1.5">
        {/* Back button */}
        <button
          id="game-back-btn"
          onClick={() => {
            playButtonTap();
            onBack();
          }}
          className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-700 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Puzzle Name / Level Pill */}
        <div
          id="game-category-pill"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full shadow-xs border font-bold text-xs sm:text-sm transition-colors ${
            dailyChallenge
              ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200'
              : 'bg-white dark:bg-slate-900 border-zinc-200 dark:border-slate-800 text-zinc-800 dark:text-slate-100'
          }`}
        >
          <span className="text-sm sm:text-base">{activeTarget.emoji}</span>
          <span className="truncate max-w-[140px] sm:max-w-[200px]">
            {dailyChallenge
              ? `Daily: ${dailyChallenge.theme}`
              : level
              ? `Level ${level.levelNumber}: ${level.title}`
              : (category?.name ?? '')}
          </span>
        </div>

        {/* Right side controls: Theme, Sound & Coins */}
        <div className="flex items-center gap-1.5">
          <button
            id="game-coins-pill"
            onClick={() => {
              if (onOpenShop) {
                playSatisfyingClick();
                onOpenShop();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-xs font-bold text-zinc-800 dark:text-slate-100 transition-all active:scale-95 hover:border-amber-400 dark:hover:border-amber-600"
            title="Open Theme & Wallpaper Shop"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950">
              <Coins className="w-2.5 h-2.5" />
            </div>
            <span className="font-mono">{coins}</span>
            {onOpenShop && <Palette className="w-3 h-3 text-amber-500 ml-0.5" />}
          </button>

          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
            id="game-theme-toggle-btn"
            className="p-1.5"
          />

          <button
            id="game-sound-btn"
            onClick={() => {
              playButtonTap();
              onToggleSound();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-600 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400 dark:text-slate-500" />}
          </button>

          {onOpenSettings && (
            <button
              id="game-settings-btn"
              onClick={() => {
                playSatisfyingClick();
                onOpenSettings();
              }}
              className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-zinc-200 dark:border-slate-800 text-zinc-600 dark:text-slate-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
              title="Audio & Music Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cognitive Perk & Tier Banner if in Level Mode or Daily Challenge */}
      {dailyChallenge && (
        <div
          id="game-daily-perk-banner"
          className="mb-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold truncate">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="truncate">{dailyChallenge.formattedDate} • {dailyChallenge.brainPerk}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-bold shrink-0 pl-2">
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Daily</span>
          </div>
        </div>
      )}

      {level && !dailyChallenge && (
        <div
          id="game-level-perk-banner"
          className="mb-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold truncate">
            <Brain className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{level.tier} • {level.brainPerk}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-slate-400 font-medium shrink-0 pl-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>&lt;{level.targetSeconds}s</span>
          </div>
        </div>
      )}

      {/* Stats Bar: Score, Timer, Hint Button */}
      <div
        id="game-status-bar"
        className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 mb-1.5 transition-colors"
      >
        {/* Score Counter */}
        <div className="relative flex flex-col">
          <span className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Score
          </span>
          <span className="font-mono font-black text-base sm:text-lg text-zinc-900 dark:text-slate-100 leading-tight">
            {score}
          </span>
          {scorePop && (
            <span
              key={scorePop.id}
              className={`absolute -top-4 left-3 font-black text-xs animate-bounce ${scorePop.color}`}
            >
              {scorePop.text}
            </span>
          )}
        </div>

        {/* Timer Pill */}
        <div
          id="game-timer-pill"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-colors ${
            mode === 'time' && timeRemaining < 30
              ? 'bg-red-500/30 text-red-300 border-red-500/50 animate-pulse'
              : 'bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-200 border-zinc-200 dark:border-slate-700'
          }`}
        >
          {mode === 'time' ? (
            <Flame
              className={`w-3.5 h-3.5 ${
                timeRemaining < 30 ? 'text-red-500 animate-bounce' : 'text-orange-500'
              }`}
            />
          ) : (
            <span className="text-[11px] text-zinc-500 dark:text-slate-400 font-mono">⏱️</span>
          )}
          <span className="font-mono text-xs sm:text-sm">
            {mode === 'classic' ? formatTime(elapsedSeconds) : formatTime(timeRemaining)}
          </span>
        </div>

        {/* Hint Button */}
        <div className="relative">
          <button
            id="game-hint-button"
            onClick={handleHintClick}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl border font-bold text-xs shadow-xs transition-all active:scale-95 ${
              hintsRemaining > 0
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-slate-400 border-zinc-300 dark:border-slate-700 hover:bg-zinc-200 dark:hover:bg-slate-700'
            }`}
            title={hintsRemaining > 0 ? 'Use a Hint' : 'Watch Ad for +2 Hints'}
          >
            <Lightbulb
              className={`w-3.5 h-3.5 ${
                hintsRemaining > 0 ? 'text-amber-500 fill-amber-400' : 'text-zinc-400 dark:text-slate-500'
              }`}
            />
            <span>{hintsRemaining > 0 ? 'Hint' : '+2 Hints'}</span>
          </button>

          {/* Badge */}
          <span
            id="game-hint-badge"
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs"
          >
            {hintsRemaining}
          </span>
        </div>
      </div>

      {/* Combo Toast Banner */}
      {comboToast && (
        <div
          id="combo-toast-banner"
          className="mx-auto mb-1 px-3.5 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
        >
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span>{comboToast}</span>
        </div>
      )}

      {/* Bonus Word Toast */}
      {bonusToast && (
        <div
          id="bonus-word-toast"
          className="mx-auto mb-1 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-md flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
          <span>{bonusToast}</span>
        </div>
      )}

      {/* Letter Grid Container */}
      <div
        id="word-search-grid-wrapper"
        ref={gridContainerRef}
        className="w-full flex flex-col items-center justify-center my-auto py-1 touch-none"
        onPointerMove={(e) => {
          if (isDragging) {
            handleDragOver(e.clientX, e.clientY);
          }
        }}
      >
        {/* Live Word Preview Bubble */}
        <div className="h-7 flex items-center justify-center mb-1">
          {currentSelectionWord ? (
            <div
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest shadow-md flex items-center gap-1.5 transition-all duration-150 animate-in fade-in zoom-in-95 ${
                isTargetWordCandidate
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105 shadow-emerald-500/20'
                  : isBonusWordCandidate
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300 scale-105 shadow-amber-500/20'
                  : 'bg-zinc-900 text-white'
              }`}
            >
              {isTargetWordCandidate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              {isBonusWordCandidate && <Sparkles className="w-3.5 h-3.5 fill-current" />}
              <span>{currentSelectionWord}</span>
              {isTargetWordCandidate && (
                <span className="text-[10px] bg-emerald-700/90 px-1.5 py-0.5 rounded text-emerald-100 font-sans uppercase font-bold tracking-normal">
                  Match!
                </span>
              )}
              {isBonusWordCandidate && (
                <span className="text-[10px] bg-amber-600/90 px-1.5 py-0.5 rounded text-amber-100 font-sans uppercase font-bold tracking-normal">
                  +5 Bonus
                </span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <span>Slide finger in any direction to connect words</span>
            </div>
          )}
        </div>

        {/* The Grid */}
        <div
          id="word-search-grid"
          ref={gridRef}
          className={`relative grid p-2 rounded-2xl shadow-md touch-none select-none transition-colors ${activeTileTheme.gridContainerClass}`}
          style={{
            gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
            gap: puzzle.size >= 12 ? '2px' : '4px',
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1 / 1',
          }}
        >
          {/* Continuous Connecting Highlighter Capsules SVG Layer */}
          <div className="absolute inset-2 pointer-events-none z-10">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* 1. Permanent capsules for completed found words */}
              {foundWords.map((fw, idx) => {
                if (fw.coords.length < 2) return null;
                const first = fw.coords[0];
                const last = fw.coords[fw.coords.length - 1];
                const x1 = ((first.col + 0.5) / puzzle.size) * 100;
                const y1 = ((first.row + 0.5) / puzzle.size) * 100;
                const x2 = ((last.col + 0.5) / puzzle.size) * 100;
                const y2 = ((last.row + 0.5) / puzzle.size) * 100;
                const capsuleWidth = (0.76 / puzzle.size) * 100;

                return (
                  <line
                    key={`found-capsule-${fw.word}-${idx}`}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={fw.color}
                    strokeWidth={`${capsuleWidth}%`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* 2. Active finger drag continuous highlighter capsule */}
              {isDragging && currentSelectedCoords.length > 0 && (() => {
                const first = currentSelectedCoords[0];
                const last = currentSelectedCoords[currentSelectedCoords.length - 1];
                const x1 = ((first.col + 0.5) / puzzle.size) * 100;
                const y1 = ((first.row + 0.5) / puzzle.size) * 100;
                const x2 = ((last.col + 0.5) / puzzle.size) * 100;
                const y2 = ((last.row + 0.5) / puzzle.size) * 100;
                const capsuleWidth = (0.8 / puzzle.size) * 100;

                const activeColor = isTargetWordCandidate
                  ? 'rgba(16, 185, 129, 0.65)'
                  : isBonusWordCandidate
                  ? 'rgba(245, 158, 11, 0.65)'
                  : (activeTileTheme.highlightGlow || 'rgba(59, 130, 246, 0.55)');

                const glowColor = isTargetWordCandidate
                  ? 'rgba(16, 185, 129, 0.25)'
                  : isBonusWordCandidate
                  ? 'rgba(245, 158, 11, 0.25)'
                  : 'rgba(59, 130, 246, 0.25)';

                return (
                  <g>
                    {/* Soft outer glow */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={glowColor}
                      strokeWidth={`${capsuleWidth * 1.35}%`}
                      strokeLinecap="round"
                    />
                    {/* Main vibrant highlighter body */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={activeColor}
                      strokeWidth={`${capsuleWidth}%`}
                      strokeLinecap="round"
                    />
                    {/* Inner bright core filament */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#ffffff"
                      strokeWidth={`${capsuleWidth * 0.2}%`}
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    {/* Leading finger cursor indicator circle */}
                    <circle
                      cx={`${x2}%`}
                      cy={`${y2}%`}
                      r={`${capsuleWidth * 0.44}%`}
                      fill={activeColor}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          {puzzle.grid.map((rowArr, rowIndex) =>
            rowArr.map((letter, colIndex) => {
              const inSelection = isCellInSelection(rowIndex, colIndex);
              const isSelectionHead =
                isDragging &&
                currentSelectedCoords[currentSelectedCoords.length - 1]?.row === rowIndex &&
                currentSelectedCoords[currentSelectedCoords.length - 1]?.col === colIndex;
              const foundColors = getCellFoundColors(rowIndex, colIndex);
              const isHinting = isCellHinting(rowIndex, colIndex);

              // Cell Background Style
              let bgStyle = {};
              if (inSelection) {
                bgStyle = {
                  backgroundColor: isTargetWordCandidate
                    ? 'rgba(16, 185, 129, 0.32)'
                    : isBonusWordCandidate
                    ? 'rgba(245, 158, 11, 0.32)'
                    : 'rgba(59, 130, 246, 0.32)',
                };
              } else if (isHinting) {
                bgStyle = { backgroundColor: 'rgba(250, 204, 21, 0.85)' };
              } else if (foundColors.length > 0) {
                bgStyle = { backgroundColor: foundColors[foundColors.length - 1] };
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  data-row={rowIndex}
                  data-col={colIndex}
                  id={`cell-${rowIndex}-${colIndex}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleDragStart(rowIndex, colIndex, e.clientX, e.clientY);
                  }}
                  style={bgStyle}
                  className={`relative z-20 flex items-center justify-center rounded-lg font-black select-none transition-all duration-75 border ${
                    puzzle.size >= 12
                      ? 'text-xs sm:text-sm font-bold'
                      : 'text-sm sm:text-base font-black'
                  } ${
                    inSelection
                      ? isTargetWordCandidate
                        ? 'text-emerald-950 font-black scale-105 ring-1 ring-emerald-500 shadow-xs'
                        : isBonusWordCandidate
                        ? 'text-amber-950 font-black scale-105 ring-1 ring-amber-500 shadow-xs'
                        : `${activeTileTheme.selectedTextClass} font-black scale-105 ring-1 ring-blue-500 shadow-xs`
                      : isHinting
                      ? 'text-amber-950 scale-110 shadow-md ring-2 ring-amber-400 hint-flash-animation'
                      : foundColors.length > 0
                      ? 'text-zinc-950 dark:text-white font-black'
                      : `${activeTileTheme.tileBgClass} ${activeTileTheme.tileTextClass} ${activeTileTheme.tileBorderClass} active:scale-95`
                  } ${isSelectionHead ? 'ring-2 ring-white/80 shadow-md scale-115' : ''}`}
                >
                  {letter}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* Word List Panel */}
      <div
        id="word-list-panel"
        className="w-full mt-1.5 p-2.5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs border border-zinc-200/80 dark:border-slate-800 flex flex-col transition-colors"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-zinc-800 dark:text-slate-100">
            Hidden Words ({foundWords.length} / {targetWords.length})
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-slate-500 font-medium">
            {targetWords.length - foundWords.length} left
          </span>
        </div>

        {/* Scrollable / wrap grid of words */}
        <div
          id="word-chips-container"
          className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1"
        >
          {targetWords.map((word) => {
            const foundObj = foundWords.find((fw) => fw.word === word);
            const isFound = Boolean(foundObj);

            return (
              <span
                key={word}
                id={`word-badge-${word}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isFound
                    ? 'line-through text-[#c0c0c8] dark:text-slate-600 bg-zinc-100/90 dark:bg-slate-800/40 border border-zinc-200/60 dark:border-slate-800'
                    : 'text-[#1a1a1a] dark:text-slate-200 bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 shadow-2xs'
                }`}
                style={
                  isFound && foundObj?.color
                    ? {
                        borderLeftWidth: '4px',
                        borderLeftColor: foundObj.color.replace('0.35', '1'),
                      }
                    : {}
                }
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Game Over Modal (for Time Mode when timer reaches 0) */}
      {isGameOver && (
        <div
          id="game-over-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl text-center border border-zinc-200 dark:border-slate-800 animate-in zoom-in-95 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3 text-3xl">
              ⏰
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-slate-100 mb-1">Time's Up!</h3>
            <p className="text-xs text-zinc-500 dark:text-slate-400 mb-4">
              You found {foundWords.length} of {targetWords.length} words before time ran out.
            </p>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-slate-800/70 border border-zinc-200 dark:border-slate-700 mb-5 flex justify-around">
              <div>
                <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase font-bold">Score</div>
                <div className="font-mono font-bold text-base text-zinc-800 dark:text-slate-100">{score}</div>
              </div>
              <div className="w-px bg-zinc-200 dark:bg-slate-700" />
              <div>
                <div className="text-[10px] text-zinc-400 dark:text-slate-500 uppercase font-bold">Bonus Words</div>
                <div className="font-mono font-bold text-base text-amber-600 dark:text-amber-400">
                  {foundBonusWords.length}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  playButtonTap();
                  onBack();
                }}
                className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-slate-800 hover:bg-zinc-200 dark:hover:bg-slate-700 text-zinc-700 dark:text-slate-200 font-bold text-xs transition-all"
              >
                Back
              </button>
              <button
                onClick={() => {
                  playButtonTap();
                  setPuzzle(generatePuzzle(activeTarget));
                  setFoundWords([]);
                  setFoundBonusWords([]);
                  setScore(0);
                  setTimeRemaining(120);
                  setIsGameOver(false);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
