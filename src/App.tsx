import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Board } from "./components/Board";
import { Toolbar } from "./components/Toolbar";
import {
  calculateNeighbors,
  scatterMines,
  initRows,
  registerHighScore,
  scatterTraps,
} from "./lib/utils";

export type Cell = {
  isMine: boolean;
  neighbors: number;
  isFlagged: boolean;
  isClicked: boolean;
  isTrap: boolean;
};

export const defaultCell: Cell = {
  isMine: false,
  neighbors: 0,
  isFlagged: false,
  isClicked: false,
  isTrap: false,
};

export type Settings = {
  difficulty: string;
  size: [w: number, h: number];
  mines: number;
  traps?: boolean;
};

export const settingsChoices: Settings[] = [
  { difficulty: "easy", size: [8, 8], mines: 10 },
  { difficulty: "easy+", size: [9, 9], mines: 10 },
  { difficulty: "easy++", size: [10, 10], mines: 10 },
  { difficulty: "medium", size: [13, 15], mines: 40 },
  { difficulty: "medium+", size: [15, 15], mines: 40 },
  { difficulty: "medium++", size: [16, 16], mines: 40 },
  { difficulty: "expert", size: [16, 30], mines: 99, traps: true },
  { difficulty: "IMPOSSIBLE", size: [30, 30], mines: 200 },
];

export const gameWidth = 400;
export const gameHeight = 400;
export const DIFFICULTY_PARAM_KEY = "d";
export const HIGH_SCORES_LS_KEY = "high-scores";

function App() {
  const params = new URLSearchParams(window.location.search);
  const num = Number(params.get(DIFFICULTY_PARAM_KEY));
  const selected = Number.isNaN(num) ? 0 : num;
  const [selectedSettings, setSelectedSettings] = useState(selected);
  const settings = settingsChoices[selectedSettings];
  const [rows, setRows] = useState(
    calculateNeighbors(
      scatterMines(initRows(settings.size[1]), settings.mines),
    ),
  );
  const [remainingFlags, setRemainingFlags] = useState(settings.mines);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    setRows(() => {
      const newRows = calculateNeighbors(
        scatterMines(initRows(settings.size[1]), settings.mines),
      );
      return newRows;
      // if (!settings.traps) return newRows;
      // return scatterTraps(newRows, settings.mines);
    });
    setRemainingFlags(settingsChoices[selectedSettings].mines);
    setIsGameOver(false);
  }, [selectedSettings]);

  useEffect(() => {
    const isWinner = rows.flat().every((cell) => {
      return !cell.isMine || cell.isFlagged;
    });
    if (!isWinner) return;
    window.clearInterval(timerRef.current);
    setIsWinner(true);
    registerHighScore(settings.difficulty, timer);
  }, [remainingFlags]);

  return (
    <main className="dark flex flex-col items-center overflow-hidden">
      <h1 className="z-50 text-4xl font-bold tracking-wide">Minesweeper</h1>
      <Toolbar
        selectedSettings={selectedSettings}
        setSelectedSettings={setSelectedSettings}
        remainingFlags={remainingFlags}
        timer={timer}
        setTimer={setTimer}
        timerRef={timerRef}
      />
      {isGameOver && (
        <span className="z-50 text-lg font-bold tracking-wide text-destructive">
          GAME OVER :(
        </span>
      )}
      {isWinner && (
        <span className="z-50 text-lg font-bold tracking-wide">
          YOU WIN!! :D
        </span>
      )}
      <Board
        rows={rows}
        setRows={setRows}
        settings={settings}
        isGameOver={isGameOver}
        setIsGameOver={setIsGameOver}
        timerRef={timerRef}
        setRemainingFlags={setRemainingFlags}
      />
    </main>
  );
}

export default App;
