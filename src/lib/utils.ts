import { Cell, defaultCell, HIGH_SCORES_LS_KEY } from "@/App";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const paddZeroes = (num: number, length: number) => {
  const str = num.toString();
  const padd = length - str.length;
  let padded = "";
  for (let i = 0; i < padd; i++) {
    padded += "0";
  }
  padded += str;
  return padded;
};

export const initRows = (h: number) => {
  const rows: Cell[][] = [];
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < h; j++) {
      if (!rows[i]) {
        rows[i] = [];
      }
      rows[i].push({ ...defaultCell });
    }
  }
  return rows;
};

export const getRandNotInArr: (
  min: number,
  max: number,
  arr: number[],
) => number = (min, max, arr) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  if (arr.includes(num)) {
    return getRandNotInArr(min, max, arr);
  }
  return num;
};

export const scatterMines = (rows: Cell[][], mines: number) => {
  const copyRows = [...rows];
  const placedIndexes: number[][] = [];
  rows.forEach((_, i) => (placedIndexes[i] = []));

  for (let i = 0; i < mines; i++) {
    const row = getRandNotInArr(0, rows.length - 1, []);
    const cell = getRandNotInArr(0, rows[row].length - 1, placedIndexes[row]);
    placedIndexes[row].push(cell);
    copyRows[row][cell].isMine = true;
  }

  return copyRows;
};

export const calculateNeighbors = (rows: Cell[][]) => {
  const copyRows = [...rows];
  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell.isMine) return;
      let neighbors = 0;
      /* current row */
      if (row[cellIndex - 1]?.isMine) {
        neighbors++;
      }
      if (row[cellIndex + 1]?.isMine) {
        neighbors++;
      }
      /* previous row */
      if (rows[rowIndex - 1]?.[cellIndex - 1]?.isMine) {
        neighbors++;
      }
      if (rows[rowIndex - 1]?.[cellIndex]?.isMine) {
        neighbors++;
      }
      if (rows[rowIndex - 1]?.[cellIndex + 1]?.isMine) {
        neighbors++;
      }
      /* next row */
      if (rows[rowIndex + 1]?.[cellIndex - 1]?.isMine) {
        neighbors++;
      }
      if (rows[rowIndex + 1]?.[cellIndex]?.isMine) {
        neighbors++;
      }
      if (rows[rowIndex + 1]?.[cellIndex + 1]?.isMine) {
        neighbors++;
      }
      copyRows[rowIndex][cellIndex].neighbors = neighbors;
    });
  });

  return copyRows;
};

export const clickZeroCells = (
  rowIndex: number,
  cellIndex: number,
  rows: Cell[][],
) => {
  const isZero = rows[rowIndex][cellIndex].neighbors === 0;
  let copyRows = [...rows];

  /* current row */
  const left = copyRows[rowIndex]?.[cellIndex - 1];
  if (left && !left?.isClicked && !left?.isMine) {
    copyRows[rowIndex][cellIndex - 1].isClicked = true;
    if (left?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex, cellIndex - 1, copyRows);
    }
  }
  const right = copyRows[rowIndex]?.[cellIndex + 1];
  if (right && !right?.isClicked && !right?.isMine) {
    copyRows[rowIndex][cellIndex + 1].isClicked = true;
    if (isZero && right?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex, cellIndex + 1, copyRows);
    }
  }
  /* previous row */
  const topMiddle = copyRows[rowIndex - 1]?.[cellIndex];
  if (topMiddle && !topMiddle?.isClicked && !topMiddle?.isMine) {
    copyRows[rowIndex - 1][cellIndex].isClicked = true;
    if (isZero && topMiddle?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex - 1, cellIndex, copyRows);
    }
  }
  const topLeft = copyRows[rowIndex - 1]?.[cellIndex - 1];
  if (topLeft && !topLeft?.isClicked && !topLeft?.isMine) {
    copyRows[rowIndex - 1][cellIndex - 1].isClicked = true;
    if (isZero && topLeft?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex - 1, cellIndex - 1, copyRows);
    }
  }
  const topRight = copyRows[rowIndex - 1]?.[cellIndex + 1];
  if (topRight && !topRight?.isClicked && !topRight?.isMine) {
    copyRows[rowIndex - 1][cellIndex + 1].isClicked = true;
    if (isZero && topRight?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex - 1, cellIndex + 1, copyRows);
    }
  }
  /* next row */
  const bottomMiddle = copyRows[rowIndex + 1]?.[cellIndex];
  if (bottomMiddle && !bottomMiddle?.isClicked && !bottomMiddle?.isMine) {
    copyRows[rowIndex + 1][cellIndex].isClicked = true;
    if (isZero && bottomMiddle?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex + 1, cellIndex, copyRows);
    }
  }
  const bottomLeft = copyRows[rowIndex + 1]?.[cellIndex - 1];
  if (bottomLeft && bottomLeft?.isClicked && !bottomLeft?.isMine) {
    copyRows[rowIndex + 1][cellIndex - 1].isClicked = true;
    if (isZero && bottomLeft?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex + 1, cellIndex - 1, copyRows);
    }
  }
  const bottomRight = copyRows[rowIndex + 1]?.[cellIndex + 1];
  if (bottomRight && !bottomRight?.isClicked && !bottomRight?.isMine) {
    copyRows[rowIndex + 1][cellIndex + 1].isClicked = true;
    if (isZero && bottomRight?.neighbors === 0) {
      copyRows = clickZeroCells(rowIndex + 1, cellIndex + 1, copyRows);
    }
  }

  return copyRows;
};

export const getHighScores = () => {
  try {
    return JSON.parse(localStorage.getItem(HIGH_SCORES_LS_KEY) ?? "{}");
  } catch (_) {
    return {};
  }
};

export const registerHighScore = (difficulty: string, score: number) => {
  const currentScoresStr = localStorage.getItem(HIGH_SCORES_LS_KEY) ?? "{}";
  let currentScores: Record<string, number> = {};
  try {
    const json = JSON.parse(currentScoresStr);
    if (typeof json === "object") {
      currentScores = json as Record<string, number>;
    }
  } catch (_) {
    // if invalid then I don't care
  }
  currentScores[difficulty] = Math.max(currentScores[difficulty], score);
  localStorage.setItem(HIGH_SCORES_LS_KEY, JSON.stringify(currentScores));
};
