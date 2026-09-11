import { DailyChallengeDef, DailyStreakInfo, DifficultyTier, GridCoord, PlacedWord } from '../types.ts';
import { GeneratedPuzzle } from './gridGenerator.ts';

// PRNG: Mulberry32 algorithm for high quality, fast 32-bit seeded pseudo-randomness
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Convert date string (YYYY-MM-DD) to numeric integer seed
export function dateKeyToSeed(dateKey: string): number {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = ((hash << 5) - hash) + dateKey.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 424242;
}

// Format local date as YYYY-MM-DD
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format friendly date: e.g. "Friday, Sep 11"
export function formatFriendlyDate(dateKey: string): { formattedDate: string; dayOfWeek: string } {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.toLocaleDateString(undefined, { weekday: 'long' });
    const formattedDate = date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return { formattedDate, dayOfWeek };
  } catch {
    return { formattedDate: dateKey, dayOfWeek: 'Today' };
  }
}

interface DailyThemeSource {
  name: string;
  emoji: string;
  tier: DifficultyTier;
  brainPerk: string;
  words: string[];
}

export const DAILY_THEMES_CATALOG: DailyThemeSource[] = [
  {
    name: 'Cosmic Voyage',
    emoji: '🌌',
    tier: 'Focus & Flow',
    brainPerk: 'Spatial Constellation Scanning +15%',
    words: ['GALAXY', 'NEBULA', 'ECLIPSE', 'PULSAR', 'COMET', 'ORBIT', 'PLANET', 'COSMOS', 'METEOR', 'STELLAR'],
  },
  {
    name: 'Zen Sanctuary',
    emoji: '🪷',
    tier: 'Warm-Up',
    brainPerk: 'Calm Clarity & Mindful Focus +12%',
    words: ['LOTUS', 'SERENE', 'BREATHE', 'HARMONY', 'SILENCE', 'TEMPLE', 'TRANQUIL', 'GARDEN', 'BALANCE', 'WISDOM'],
  },
  {
    name: 'Espresso Bar',
    emoji: '☕',
    tier: 'Pattern Hunter',
    brainPerk: 'Rapid Reflex & Recognition +15%',
    words: ['BARISTA', 'CARAMEL', 'ESPRESSO', 'MOCHA', 'AROMA', 'CINNAMON', 'LATTE', 'BEANS', 'BREW', 'ROAST'],
  },
  {
    name: 'Deep Sea Abyss',
    emoji: '🌊',
    tier: 'Synapse Surge',
    brainPerk: 'Depth Perception & Visual Agility +18%',
    words: ['DOLPHIN', 'CURRENT', 'JELLYFISH', 'TRENCH', 'CORAL', 'NAUTILUS', 'WHALE', 'ABYSS', 'SQUID', 'ANEMONE'],
  },
  {
    name: 'Emerald Jungle',
    emoji: '🌿',
    tier: 'Focus & Flow',
    brainPerk: 'Organic Pattern Recognition +14%',
    words: ['CANOPY', 'JAGUAR', 'ORCHID', 'MONKEY', 'TROPICAL', 'CASCADE', 'TOUCAN', 'LIANA', 'PARROT', 'BAMBOO'],
  },
  {
    name: 'Retro Arcade',
    emoji: '🕹️',
    tier: 'Pattern Hunter',
    brainPerk: 'Peripheral Target Tracking +16%',
    words: ['JOYSTICK', 'PIXELS', 'HIGHSCORE', 'RETRO', 'VECTOR', 'BITMAP', 'ARCADE', 'CONSOLE', 'INSERT', 'COIN'],
  },
  {
    name: 'Alpine Summit',
    emoji: '🏔️',
    tier: 'Cognitive Master',
    brainPerk: 'Multi-Directional Analysis +20%',
    words: ['SUMMIT', 'GLACIER', 'BLIZZARD', 'AVALANCHE', 'PINE', 'TIMBER', 'CLIFF', 'HORIZON', 'PASS', 'VALLEY'],
  },
  {
    name: 'Mythic Realm',
    emoji: '🐉',
    tier: 'Synapse Surge',
    brainPerk: 'Abstract Symbol Decoding +17%',
    words: ['DRAGON', 'PHOENIX', 'GRYPHON', 'WIZARD', 'POTION', 'CASTLE', 'CHIMERA', 'RELIC', 'SHADOW', 'KNIGHT'],
  },
  {
    name: 'Quantum Lab',
    emoji: '🔬',
    tier: 'Genius Mind',
    brainPerk: 'Complex Logic Synthesis +22%',
    words: ['CYBORG', 'SENSOR', 'QUANTUM', 'CIRCUIT', 'MATRIX', 'CHIPSET', 'PROTON', 'OPTIC', 'LASER', 'SERVER'],
  },
  {
    name: 'Autumn Harvest',
    emoji: '🍂',
    tier: 'Warm-Up',
    brainPerk: 'Warm Visual Scan Pace +10%',
    words: ['PUMPKIN', 'CHESTNUT', 'BREEZE', 'RUSSET', 'HARVEST', 'ACORN', 'GOLDEN', 'MAPLE', 'ORCHARD', 'CIDER'],
  },
  {
    name: 'Ancient Sands',
    emoji: '🏺',
    tier: 'Pattern Hunter',
    brainPerk: 'Cryptic Sequence Memory +15%',
    words: ['PHARAOH', 'SPHINX', 'PAPYRUS', 'DESERT', 'DYNASTY', 'TEMPLE', 'MONOLITH', 'SCARAB', 'OASIS', 'CARAVAN'],
  },
  {
    name: 'Grand Symphony',
    emoji: '🎻',
    tier: 'Focus & Flow',
    brainPerk: 'Rhythmic Cognitive Processing +14%',
    words: ['VIOLIN', 'CONCERTO', 'MAESTRO', 'MELODY', 'ALLEGRO', 'SONATA', 'HARMONY', 'OVERTURE', 'RHYTHM', 'CHORD'],
  },
  {
    name: 'Island Breeze',
    emoji: '🏝️',
    tier: 'Pattern Hunter',
    brainPerk: 'Visual Flow Relaxation +12%',
    words: ['LAGOON', 'HAMMOCK', 'COCONUT', 'CORAL', 'REEF', 'SANDBAR', 'SURFING', 'SUNSET', 'TIDES', 'BREEZE'],
  },
  {
    name: 'Culinary Master',
    emoji: '🍳',
    tier: 'Focus & Flow',
    brainPerk: 'Sequential Ingredient Linking +15%',
    words: ['GOURMET', 'TRUFFLE', 'SAFFRON', 'CUISINE', 'SIZZLE', 'BAKERY', 'RECIPE', 'SEASON', 'CHEF', 'FLAVOR'],
  },
  {
    name: 'Starlit Horizon',
    emoji: '✨',
    tier: 'Synapse Surge',
    brainPerk: 'Constellation Mapping +18%',
    words: ['AURORA', 'METEOR', 'TWILIGHT', 'CONSTELL', 'LUNAR', 'STARRY', 'RADIAN', 'ZENITH', 'CELEST', 'ORBIT'],
  },
  {
    name: 'Sweet Patisserie',
    emoji: '🥐',
    tier: 'Warm-Up',
    brainPerk: 'Visual Delight & Quick Scan +10%',
    words: ['CROISSANT', 'CINNAMON', 'MACARON', 'PASTRY', 'VANILLA', 'DOUGH', 'GLAZE', 'CUPCAKE', 'CARAMEL', 'SUGAR'],
  },
  {
    name: 'Aviation Pioneers',
    emoji: '✈️',
    tier: 'Pattern Hunter',
    brainPerk: 'Vector Trajectory Tracking +16%',
    words: ['PROPELLER', 'COMPASS', 'ALTITUDE', 'RUNWAY', 'COCKPIT', 'GLIDER', 'RADAR', 'HORIZON', 'FLIGHT', 'VECTOR'],
  },
  {
    name: 'Deep Forest Lore',
    emoji: '🌲',
    tier: 'Focus & Flow',
    brainPerk: 'Woodland Silhouette Sorting +14%',
    words: ['SEQUOIA', 'MOSS', 'STREAM', 'FIREFLY', 'BADGER', 'FOLIAGE', 'FERN', 'CANOPY', 'BRANCH', 'TIMBER'],
  },
];

const DAILY_DIRECTIONS: [number, number][] = [
  [0, 1],   // Right
  [0, -1],  // Left
  [1, 0],   // Down
  [-1, 0],  // Up
  [1, 1],   // Down-Right
  [-1, 1],  // Up-Right
  [1, -1],  // Down-Left
];

/**
 * Generate a fresh Daily Challenge definition deterministically based on dateKey.
 */
export function getDailyChallengeForDate(dateInput?: string | Date): DailyChallengeDef {
  let dateKey: string;
  if (!dateInput) {
    dateKey = getTodayDateKey();
  } else if (dateInput instanceof Date) {
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, '0');
    const day = String(dateInput.getDate()).padStart(2, '0');
    dateKey = `${year}-${month}-${day}`;
  } else {
    dateKey = dateInput;
  }

  const seed = dateKeyToSeed(dateKey);
  const rng = createPRNG(seed);

  // 1. Pick theme deterministically from catalog
  const themeIndex = Math.floor(rng() * DAILY_THEMES_CATALOG.length);
  const themeSource = DAILY_THEMES_CATALOG[themeIndex];

  // 2. Pick a unique sequence of 6 to 8 words for today's puzzle
  const wordsPool = [...themeSource.words];
  // Seeded shuffle using Fisher-Yates
  for (let i = wordsPool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [wordsPool[i], wordsPool[j]] = [wordsPool[j], wordsPool[i]];
  }
  const selectedWords = wordsPool.slice(0, 7);

  // 3. Grid size (9x9 or 10x10 is optimal for daily challenge speed & elegance)
  const maxWordLen = Math.max(...selectedWords.map((w) => w.length));
  const gridSize = Math.max(9, maxWordLen + 1);

  const { formattedDate, dayOfWeek } = formatFriendlyDate(dateKey);

  // Sequence ID: e.g. #DAILY-20260911-3E
  const hexSuffix = Math.floor(rng() * 256).toString(16).toUpperCase().padStart(2, '0');
  const sequenceId = `#DC-${dateKey.replace(/-/g, '')}-${hexSuffix}`;

  return {
    isDaily: true,
    dateKey,
    formattedDate,
    dayOfWeek,
    theme: themeSource.name,
    emoji: themeSource.emoji,
    tier: themeSource.tier,
    gridSize,
    words: selectedWords,
    allowedDirections: DAILY_DIRECTIONS,
    brainPerk: themeSource.brainPerk,
    targetSeconds: 65,
    coinReward: 120, // generous daily reward
    sequenceId,
  };
}

/**
 * Deterministic puzzle generator for Daily Challenge:
 * Uses the exact same seeded PRNG so that everyone playing the Daily Challenge
 * receives the exact same word layout, placement, and filler letters!
 */
export function generateDeterministicDailyPuzzle(daily: DailyChallengeDef): GeneratedPuzzle {
  const seed = dateKeyToSeed(daily.dateKey) + 9999;
  const rng = createPRNG(seed);

  const size = daily.gridSize;
  const words = [...daily.words];
  const allowedDirections = daily.allowedDirections;

  const maxBoardAttempts = 50;

  for (let attempt = 0; attempt < maxBoardAttempts; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array(size).fill(null),
    );
    const placedWords: PlacedWord[] = [];

    // Sort words descending by length
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    let allPlaced = true;

    for (const word of sortedWords) {
      const placed = tryPlaceWordSeeded(grid, word, size, allowedDirections, rng);
      if (placed) {
        placedWords.push(placed);
      } else {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced) {
      // Deterministically fill remaining null cells with uppercase letters A-Z using seeded PRNG
      const finalGrid: string[][] = grid.map((row) =>
        row.map((cell) => cell ?? String.fromCharCode(65 + Math.floor(rng() * 26))),
      );

      return {
        grid: finalGrid,
        size,
        placedWords,
      };
    }
  }

  // Fallback: place as many as possible
  const fallbackGrid: (string | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null),
  );
  const placedWords: PlacedWord[] = [];
  for (const word of words) {
    const placed = tryPlaceWordSeeded(fallbackGrid, word, size, allowedDirections, rng);
    if (placed) {
      placedWords.push(placed);
    }
  }
  const finalGrid: string[][] = fallbackGrid.map((row) =>
    row.map((cell) => cell ?? String.fromCharCode(65 + Math.floor(rng() * 26))),
  );

  return {
    grid: finalGrid,
    size,
    placedWords,
  };
}

function tryPlaceWordSeeded(
  grid: (string | null)[][],
  word: string,
  size: number,
  allowedDirs: [number, number][],
  rng: () => number,
): PlacedWord | null {
  const wordLen = word.length;

  // Seeded shuffle of directions
  const shuffledDirs = [...allowedDirs];
  for (let i = shuffledDirs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledDirs[i], shuffledDirs[j]] = [shuffledDirs[j], shuffledDirs[i]];
  }

  // Seeded shuffle of start coordinates
  const startPositions: GridCoord[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      startPositions.push({ row: r, col: c });
    }
  }
  for (let i = startPositions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [startPositions[i], startPositions[j]] = [startPositions[j], startPositions[i]];
  }

  for (const dir of shuffledDirs) {
    const [dRow, dCol] = dir;
    for (const start of startPositions) {
      const endRow = start.row + dRow * (wordLen - 1);
      const endCol = start.col + dCol * (wordLen - 1);

      // Check boundary
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        continue;
      }

      // Check overlap validity
      let canPlace = true;
      const coords: GridCoord[] = [];

      for (let i = 0; i < wordLen; i++) {
        const r = start.row + dRow * i;
        const c = start.col + dCol * i;
        const currentLetter = grid[r][c];

        if (currentLetter !== null && currentLetter !== word[i]) {
          canPlace = false;
          break;
        }
        coords.push({ row: r, col: c });
      }

      if (canPlace) {
        for (let i = 0; i < wordLen; i++) {
          const { row, col } = coords[i];
          grid[row][col] = word[i];
        }

        return {
          word,
          start,
          end: { row: endRow, col: endCol },
          direction: dir,
          coords,
        };
      }
    }
  }

  return null;
}
