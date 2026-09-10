import { Category, GridCoord, PlacedWord } from '../types.ts';
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

export function generatePuzzle(category: Category): GeneratedPuzzle {
  const size = getGridSizeForCategory(category);
  const words = [...category.words];

  // Try generating board until all words are successfully placed
  const maxBoardAttempts = 50;

  for (let attempt = 0; attempt < maxBoardAttempts; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array(size).fill(null),
    );
    const placedWords: PlacedWord[] = [];

    // Sort words descending by length to place longer words first
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    let allPlaced = true;

    for (const word of sortedWords) {
      const placed = tryPlaceWord(grid, word, size);
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
    const placed = tryPlaceWord(grid, word, size);
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

function tryPlaceWord(
  grid: (string | null)[][],
  word: string,
  size: number,
): PlacedWord | null {
  const wordLen = word.length;
  // Shuffle directions and coordinate candidates
  const shuffledDirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

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
