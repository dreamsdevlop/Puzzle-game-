import { useEffect, useRef, useState, useTransition } from 'react';
import {
  ArrowLeft,
  Coins,
  Flame,
  Lightbulb,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Category, FoundWord, GameMode, GridCoord, PlacedWord } from '../types.ts';
import { HIGHLIGHT_COLORS } from '../data/colors.ts';
import { BONUS_WORDS_SET } from '../data/bonusDictionary.ts';
import { coordsToWord, generatePuzzle, getLineCoords } from '../utils/gridGenerator.ts';
import {
  playBonusWordSparkle,
  playButtonTap,
  playCountdownTick,
  playCorrectWord,
  playDragSwoosh,
  playGameOverDescending,
  playWrongSelection,
} from '../utils/audio.ts';

interface GameScreenProps {
  category: Category;
  mode: GameMode;
  coins: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLevelComplete: (data: {
    score: number;
    timeTakenSeconds: number;
    bonusWords: string[];
    timeLeftSeconds: number;
  }) => void;
  onBack: () => void;
  onRequestRewardedAd: (onSuccess: () => void) => void;
}

export function GameScreen({
  category,
  mode,
  coins,
  soundEnabled,
  onToggleSound,
  onLevelComplete,
  onBack,
  onRequestRewardedAd,
}: GameScreenProps) {
  // Puzzle Generation
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(category));
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [foundBonusWords, setFoundBonusWords] = useState<string[]>([]);

  // Scoring & Stats
  const [score, setScore] = useState(0);
  const [scorePop, setScorePop] = useState<{ id: number; text: string; color: string } | null>(null);
  const [bonusToast, setBonusToast] = useState<string | null>(null);

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
    if (foundWords.length > 0 && foundWords.length === category.words.length) {
      // Calculate final score
      // Words found: +10 pts each
      // Bonus words: +5 pts each
      // Time bonus (Time mode only): +timeLeft * 2
      const timeBonus = mode === 'time' ? timeRemaining * 2 : 0;
      const finalScore = score + timeBonus;

      onLevelComplete({
        score: finalScore,
        timeTakenSeconds: elapsedSeconds,
        bonusWords: foundBonusWords,
        timeLeftSeconds: timeRemaining,
      });
    }
  }, [
    foundWords.length,
    category.words.length,
    score,
    mode,
    timeRemaining,
    elapsedSeconds,
    foundBonusWords,
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
  const handleDragStart = (row: number, col: number) => {
    if (isGameOver || isPaused) return;
    setIsDragging(true);
    setStartCell({ row, col });
    setCurrentSelectedCoords([{ row, col }]);
    playDragSwoosh();
  };

  // Drag over
  const handleDragOver = (clientX: number, clientY: number) => {
    if (!isDragging || !startCell) return;
    const targetCell = getCellFromPoint(clientX, clientY);
    if (!targetCell) return;

    // Check if line changed
    const line = getLineCoords(startCell, targetCell);
    if (line) {
      if (
        line.length !== currentSelectedCoords.length ||
        line[line.length - 1].row !== currentSelectedCoords[currentSelectedCoords.length - 1]?.row ||
        line[line.length - 1].col !== currentSelectedCoords[currentSelectedCoords.length - 1]?.col
      ) {
        setCurrentSelectedCoords(line);
        playDragSwoosh();
      }
    }
  };

  // Drag end / Word Validation
  const handleDragEnd = () => {
    if (!isDragging || !startCell || currentSelectedCoords.length === 0) {
      setIsDragging(false);
      setStartCell(null);
      setCurrentSelectedCoords([]);
      return;
    }

    const forwardWord = coordsToWord(puzzle.grid, currentSelectedCoords).toUpperCase();
    const reverseWord = forwardWord.split('').reverse().join('');

    // Check if it matches an unfound category word
    let matchedWord: string | null = null;
    let matchedCoords = currentSelectedCoords;

    const unfoundWords = category.words.filter(
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

      setScore((prev) => prev + 10);
      triggerScorePop('+10', 'text-emerald-500');
    } else {
      // Check for Bonus Word:
      // Valid English word >= 3 letters in BONUS_WORDS_SET, not in puzzle word list, not found yet
      let bonusCandidate: string | null = null;
      if (
        forwardWord.length >= 3 &&
        BONUS_WORDS_SET.has(forwardWord) &&
        !category.words.includes(forwardWord) &&
        !foundBonusWords.includes(forwardWord)
      ) {
        bonusCandidate = forwardWord;
      } else if (
        reverseWord.length >= 3 &&
        BONUS_WORDS_SET.has(reverseWord) &&
        !category.words.includes(reverseWord) &&
        !foundBonusWords.includes(reverseWord)
      ) {
        bonusCandidate = reverseWord;
      }

      if (bonusCandidate) {
        // Bonus word found!
        playBonusWordSparkle();
        setFoundBonusWords((prev) => [...prev, bonusCandidate!]);
        setScore((prev) => prev + 5);
        triggerScorePop('+5', 'text-amber-500');

        setBonusToast(`Bonus Word: ${bonusCandidate} (+5 pts)`);
        setTimeout(() => setBonusToast(null), 2200);
      } else {
        // Not a word or already found
        if (currentSelectedCoords.length > 1) {
          playWrongSelection();
        }
      }
    }

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
    ? coordsToWord(puzzle.grid, currentSelectedCoords)
    : '';

  return (
    <div
      id="game-screen"
      className="flex flex-col flex-1 w-full px-3 py-2 max-w-lg mx-auto select-none justify-between"
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      {/* Top Bar */}
      <div id="game-top-bar" className="flex items-center justify-between gap-2 pb-2">
        {/* Back button */}
        <button
          id="game-back-btn"
          onClick={() => {
            playButtonTap();
            onBack();
          }}
          className="p-2 rounded-full bg-white shadow-xs border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition-all active:scale-95"
          title="Exit to Categories"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Category Name pill */}
        <div
          id="game-category-pill"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-xs border border-zinc-200 font-bold text-sm text-zinc-800"
        >
          <span className="text-base">{category.emoji}</span>
          <span>{category.name}</span>
        </div>

        {/* Right side controls: Sound & Coins */}
        <div className="flex items-center gap-2">
          <div
            id="game-coins-pill"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white shadow-xs border border-zinc-200 text-xs font-bold text-zinc-800"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950">
              <Coins className="w-2.5 h-2.5" />
            </div>
            <span className="font-mono">{coins}</span>
          </div>

          <button
            id="game-sound-btn"
            onClick={() => {
              playButtonTap();
              onToggleSound();
            }}
            className="p-2 rounded-full bg-white shadow-xs border border-zinc-200 text-zinc-600 hover:text-zinc-950 transition-all active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>
        </div>
      </div>

      {/* Stats Bar: Score, Timer, Hint Button */}
      <div
        id="game-status-bar"
        className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white shadow-xs border border-zinc-200/80 mb-2"
      >
        {/* Score Counter */}
        <div className="relative flex flex-col">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            Score
          </span>
          <span className="font-mono font-black text-lg text-zinc-900 leading-tight">
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
              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
          }`}
        >
          {mode === 'time' ? (
            <Flame
              className={`w-3.5 h-3.5 ${
                timeRemaining < 30 ? 'text-red-500 animate-bounce' : 'text-orange-500'
              }`}
            />
          ) : (
            <span className="text-[11px] text-zinc-500 font-mono">⏱️</span>
          )}
          <span className="font-mono text-sm">
            {mode === 'classic' ? formatTime(elapsedSeconds) : formatTime(timeRemaining)}
          </span>
        </div>

        {/* Hint Button with Red Badge */}
        <div className="relative">
          <button
            id="game-hint-button"
            onClick={handleHintClick}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-xs transition-all active:scale-95 ${
              hintsRemaining > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-zinc-100 text-zinc-500 border-zinc-300 hover:bg-zinc-200'
            }`}
            title={hintsRemaining > 0 ? 'Use a Hint' : 'Watch Ad for +2 Hints'}
          >
            <Lightbulb
              className={`w-4 h-4 ${
                hintsRemaining > 0 ? 'text-amber-500 fill-amber-400' : 'text-zinc-400'
              }`}
            />
            <span>{hintsRemaining > 0 ? 'Hint' : '+2 Hints'}</span>
          </button>

          {/* Red Badge */}
          <span
            id="game-hint-badge"
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs"
          >
            {hintsRemaining}
          </span>
        </div>
      </div>

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
        className="w-full flex flex-col items-center justify-center my-auto py-1"
        onPointerMove={(e) => {
          if (isDragging) {
            handleDragOver(e.clientX, e.clientY);
          }
        }}
      >
        {/* Live Word Preview Bubble */}
        <div className="h-6 flex items-center justify-center mb-1">
          {currentSelectionWord ? (
            <div className="px-3 py-0.5 rounded-full bg-zinc-900 text-white text-xs font-mono font-bold tracking-widest shadow-md animate-in fade-in duration-100">
              {currentSelectionWord}
            </div>
          ) : (
            <div className="text-[11px] text-zinc-400 font-medium">
              Drag finger or mouse to connect letters
            </div>
          )}
        </div>

        {/* The Grid */}
        <div
          id="word-search-grid"
          className="relative grid p-2 rounded-2xl bg-white shadow-md border border-zinc-200/90 touch-none"
          style={{
            gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
            gap: puzzle.size >= 12 ? '2px' : '4px',
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1 / 1',
          }}
        >
          {puzzle.grid.map((rowArr, rowIndex) =>
            rowArr.map((letter, colIndex) => {
              const inSelection = isCellInSelection(rowIndex, colIndex);
              const foundColors = getCellFoundColors(rowIndex, colIndex);
              const isHinting = isCellHinting(rowIndex, colIndex);

              // Cell Background Style
              let bgStyle = {};
              if (inSelection) {
                bgStyle = { backgroundColor: 'rgba(47, 128, 237, 0.45)' };
              } else if (isHinting) {
                bgStyle = { backgroundColor: 'rgba(250, 204, 21, 0.85)' };
              } else if (foundColors.length > 0) {
                // If cell belongs to multiple found words, use latest or gradient
                bgStyle = { backgroundColor: foundColors[foundColors.length - 1] };
              }

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  data-row={rowIndex}
                  data-col={colIndex}
                  id={`cell-${rowIndex}-${colIndex}`}
                  onPointerDown={(e) => {
                    e.currentTarget.releasePointerCapture?.(e.pointerId);
                    handleDragStart(rowIndex, colIndex);
                  }}
                  style={bgStyle}
                  className={`relative flex items-center justify-center rounded-lg font-black select-none transition-all duration-100 ${
                    puzzle.size >= 12
                      ? 'text-xs sm:text-sm font-bold'
                      : 'text-sm sm:text-base font-black'
                  } ${
                    inSelection
                      ? 'text-blue-950 scale-105 shadow-xs ring-1 ring-blue-500'
                      : isHinting
                      ? 'text-amber-950 scale-110 shadow-md ring-2 ring-amber-400 hint-flash-animation'
                      : foundColors.length > 0
                      ? 'text-zinc-950 font-black'
                      : 'text-zinc-700 hover:bg-zinc-100/80 active:scale-95'
                  }`}
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
        className="w-full mt-2 p-3 rounded-2xl bg-white shadow-xs border border-zinc-200/80 flex flex-col"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-800">
            Hidden Words ({foundWords.length} / {category.words.length})
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            {category.words.length - foundWords.length} left
          </span>
        </div>

        {/* Scrollable / wrap grid of words */}
        <div
          id="word-chips-container"
          className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1"
        >
          {category.words.map((word) => {
            const foundObj = foundWords.find((fw) => fw.word === word);
            const isFound = Boolean(foundObj);

            return (
              <span
                key={word}
                id={`word-badge-${word}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isFound
                    ? 'line-through text-[#c0c0c8] bg-zinc-100/90 border border-zinc-200/60'
                    : 'text-[#1a1a1a] bg-zinc-50 border border-zinc-200 shadow-2xs'
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
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white shadow-2xl text-center border border-zinc-200 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-3xl">
              ⏰
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-1">Time's Up!</h3>
            <p className="text-xs text-zinc-500 mb-4">
              You found {foundWords.length} of {category.words.length} words before time ran out.
            </p>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 mb-5 flex justify-around">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Score</div>
                <div className="font-mono font-bold text-base text-zinc-800">{score}</div>
              </div>
              <div className="w-px bg-zinc-200" />
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Bonus Words</div>
                <div className="font-mono font-bold text-base text-amber-600">
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
                className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-all"
              >
                Categories
              </button>
              <button
                onClick={() => {
                  playButtonTap();
                  setPuzzle(generatePuzzle(category));
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
