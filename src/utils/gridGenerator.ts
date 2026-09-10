import { Category, GridCoord, LevelDef, PlacedWord } from '../types.ts';
import { getGridSizeForCategory } from '../data/categories.ts';

const DIRECTIONS: [number, number][] = [
  [0, 1],   // Right
  [0, -1],  // Left
  [1, 0],   // Down
  [-1, 0],  // Up
  [1, 1],   // Down-Right
  [-1, -1], // Up-Left
  [1, -1],  // Down-Left
  [-1, 1],  // Up-Right
];

export interface GeneratedPuzzle {
  grid: string[][];
  size: number;
  placedWords: PlacedWord[];
}

export function generatePuzzle(target: Category | LevelDef): GeneratedPuzzle {
  const isLevel = 'levelNumber' in target;
  const size = isLevel ? target.gridSize : getGridSizeForCategory(target);
  const words = [...target.words];
  const allowedDirections = isLevel ? target.allowedDirections : DIRECTIONS;

  // Try generating board until all words are successfully placed
  const maxBoardAttempts = 60;

  for (let attempt = 0; attempt < maxBoardAttempts; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array(size).fill(null),
    );
    const placedWords: PlacedWord[] = [];

    // Sort words descending by length to place longer words first
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    let allPlaced = true;

    for (const word of sortedWords) {
      const placed = tryPlaceWord(grid, word, size, allowedDirections);
      if (placed) {
        placedWords.push(placed);
      } else {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced) {
      // Fill remaining null cells with random uppercase letters A-Z
      const finalGrid: string[][] = grid.map((row) =>
        row.map((cell) => cell ?? String.fromCharCode(65 + Math.floor(Math.random() * 26))),
      );

      return {
        grid: finalGrid,
        size,
        placedWords,
      };
    }
  }

  // Fallback board generation if dense category:
  // Place as many as possible and fill rest
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null),
  );
  const placedWords: PlacedWord[] = [];
  for (const word of words) {
    const placed = tryPlaceWord(grid, word, size, allowedDirections);
    if (placed) {
      placedWords.push(placed);
    }
  }
  const finalGrid: string[][] = grid.map((row) =>
    row.map((cell) => cell ?? String.fromCharCode(65 + Math.floor(Math.random() * 26))),
  );

  return {
    grid: finalGrid,
    size,
    placedWords,
  };
}

export function generatePuzzleForLevel(level: LevelDef): GeneratedPuzzle {
  return generatePuzzle(level);
}

function tryPlaceWord(
  grid: (string | null)[][],
  word: string,
  size: number,
  allowedDirs?: [number, number][],
): PlacedWord | null {
  const wordLen = word.length;
  // Shuffle directions and coordinate candidates
  const directionsToUse = allowedDirs && allowedDirs.length > 0 ? allowedDirs : DIRECTIONS;
  const shuffledDirs = [...directionsToUse].sort(() => Math.random() - 0.5);

  const startPositions: GridCoord[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      startPositions.push({ row: r, col: c });
    }
  }
  startPositions.sort(() => Math.random() - 0.5);

  for (const dir of shuffledDirs) {
    const [dRow, dCol] = dir;
    for (const start of startPositions) {
      const endRow = start.row + dRow * (wordLen - 1);
      const endCol = start.col + dCol * (wordLen - 1);

      // Check boundary
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        continue;
      }

      // Check if cells are free or have matching characters
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
        // Place the letters into grid
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

/**
 * Returns line coordinates from start to end if they form a straight line in one of 8 directions,
 * otherwise returns null.
 */
export function getLineCoords(start: GridCoord, end: GridCoord): GridCoord[] | null {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  if (dRow === 0 && dCol === 0) {
    return [start];
  }

  const stepRow = dRow === 0 ? 0 : dRow > 0 ? 1 : -1;
  const stepCol = dCol === 0 ? 0 : dCol > 0 ? 1 : -1;

  const absRow = Math.abs(dRow);
  const absCol = Math.abs(dCol);

  // Must be horizontal, vertical, or diagonal
  if (dRow !== 0 && dCol !== 0 && absRow !== absCol) {
    return null;
  }

  const steps = Math.max(absRow, absCol);
  const coords: GridCoord[] = [];

  for (let i = 0; i <= steps; i++) {
    coords.push({
      row: start.row + stepRow * i,
      col: start.col + stepCol * i,
    });
  }

  return coords;
}

/**
 * Extracts string from grid coordinates
 */
export function coordsToWord(grid: string[][], coords: GridCoord[]): string {
  return coords.map((c) => grid[c.row]?.[c.col] || '').join('');
}

/**
 * Calculates a smooth, forgiving line of coordinates from startCell based on the user's finger offset (dx, dy).
 * Uses magnetic angle snapping to lock to the nearest allowed direction (or all 8 directions),
 * and projects finger distance along that ray to determine step count.
 * This guarantees effortless, natural finger sliding that never drops connection or glitches on diagonals.
 */
export function calculateMagneticLine(
  start: GridCoord,
  dx: number,
  dy: number,
  cellSize: number,
  gridSize: number,
  allowedDirs?: [number, number][],
): GridCoord[] {
  const dist = Math.hypot(dx, dy);

  // Still inside starting cell: 1 letter selected
  if (dist < cellSize * 0.28) {
    return [start];
  }

  // 8 direction sectors (each 45°: ±22.5°)
  const ALL_DIRECTIONS = [
    { dRow: 0, dCol: 1 },   // 0: Right (0°)
    { dRow: 1, dCol: 1 },   // 1: Down-Right (45°)
    { dRow: 1, dCol: 0 },   // 2: Down (90°)
    { dRow: 1, dCol: -1 },  // 3: Down-Left (135°)
    { dRow: 0, dCol: -1 },  // 4: Left (180°)
    { dRow: -1, dCol: -1 }, // 5: Up-Left (225°)
    { dRow: -1, dCol: 0 },  // 6: Up (270°)
    { dRow: -1, dCol: 1 },  // 7: Up-Right (315°)
  ];

  let candidateDirs = ALL_DIRECTIONS;
  if (allowedDirs && allowedDirs.length > 0) {
    const filtered = ALL_DIRECTIONS.filter((d) =>
      allowedDirs.some((ad) => ad[0] === d.dRow && ad[1] === d.dCol),
    );
    if (filtered.length > 0) {
      candidateDirs = filtered;
    }
  }

  // Find candidate direction closest to finger angle using cosine similarity (dot product)
  let bestDir = candidateDirs[0];
  let maxDot = -Infinity;

  for (const dir of candidateDirs) {
    const isDiag = dir.dRow !== 0 && dir.dCol !== 0;
    const ux = isDiag ? dir.dCol * 0.7071 : dir.dCol;
    const uy = isDiag ? dir.dRow * 0.7071 : dir.dRow;

    const dot = (dx / dist) * ux + (dy / dist) * uy;
    if (dot > maxDot) {
      maxDot = dot;
      bestDir = dir;
    }
  }

  const dir = bestDir;

  // Length of one cell step along this direction in pixel space
  const isDiagonal = dir.dRow !== 0 && dir.dCol !== 0;
  const stepPixelDist = isDiagonal ? cellSize * 1.4142 : cellSize;

  // Project finger vector (dx, dy) onto the direction unit vector
  const ux = isDiagonal ? dir.dCol * 0.7071 : dir.dCol;
  const uy = isDiagonal ? dir.dRow * 0.7071 : dir.dRow;
  const projectedDist = dx * ux + dy * uy;

  // Steps along ray: +0.42 offset ensures natural, forgiving cell activation
  let steps = Math.floor(projectedDist / stepPixelDist + 0.42);
  if (steps < 0) steps = 0;

  // Maximum steps allowed before hitting grid boundary
  const maxRowSteps = dir.dRow > 0 ? (gridSize - 1 - start.row) : dir.dRow < 0 ? start.row : 999;
  const maxColSteps = dir.dCol > 0 ? (gridSize - 1 - start.col) : dir.dCol < 0 ? start.col : 999;
  const maxSteps = Math.min(maxRowSteps, maxColSteps);

  steps = Math.min(steps, maxSteps);

  const coords: GridCoord[] = [];
  for (let i = 0; i <= steps; i++) {
    coords.push({
      row: start.row + i * dir.dRow,
      col: start.col + i * dir.dCol,
    });
  }

  return coords;
}

