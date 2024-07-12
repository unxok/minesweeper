import { Bomb, Flag, PieChart } from "lucide-react";
import "./App.css";
import { Button, buttonVariants } from "./components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ScrollArea } from "./components/ui/scroll-area";
import { DimensionsIcon, DividerVerticalIcon } from "@radix-ui/react-icons";
import { One } from "./components/Numbers/One";
import { Two } from "./components/Numbers/Two";
import { Three } from "./components/Numbers/Three";
import { Four } from "./components/Numbers/Four";
import { Five } from "./components/Numbers/Five";
import { Six } from "./components/Numbers/Six";
import { Seven } from "./components/Numbers/Seven";
import { Eight } from "./components/Numbers/Eight";

type Cell = {
  isMine: boolean;
  neighbors: number;
  isFlagged: boolean;
  isClicked: boolean;
};

const defaultCell: Cell = {
  isMine: false,
  neighbors: 0,
  isFlagged: false,
  isClicked: false,
};

const initRows = (h: number) => {
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

const getRandNotInArr = (min: number, max: number, arr: number[]) => {
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  if (arr.includes(num)) {
    return getRandNotInArr(min, max, arr);
  }
  return num;
};

const scatterMines = (rows: Cell[][], mines: number) => {
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

const calculateNeighbors = (rows: Cell[][]) => {
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

const clickZeroCells = (
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

const gameWidth = 500;
const gameHeight = 500;

function App() {
  const [selectedSettings, setSelectedSettings] = useState(0);
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
    setRows(() =>
      calculateNeighbors(
        scatterMines(initRows(settings.size[1]), settings.mines),
      ),
    );
    setRemainingFlags(settingsChoices[selectedSettings].mines);
    setIsGameOver(false);
  }, [selectedSettings]);

  useEffect(() => {
    const isWinner = rows.flat().every((cell) => {
      return !cell.isMine || cell.isFlagged;
    });
    if (!isWinner) return;
    setIsWinner(true);
    window.clearInterval(timerRef.current);
  }, [remainingFlags]);

  return (
    <main className="dark flex flex-col items-center">
      <h1 className="text-4xl font-bold tracking-wide">Minesweeper</h1>
      <Toolbar
        selectedSettings={selectedSettings}
        setSelectedSettings={setSelectedSettings}
        remainingFlags={remainingFlags}
        timer={timer}
        setTimer={setTimer}
        timerRef={timerRef}
      />
      {isGameOver && (
        <span className="text-lg font-bold tracking-wide text-destructive">
          GAME OVER :(
        </span>
      )}
      {isWinner && (
        <span className="text-lg font-bold tracking-wide">YOU WIN!! :D</span>
      )}
      <div
        className="flex flex-wrap items-center justify-center"
        style={{ width: gameWidth, height: gameHeight }}
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex + "row-of-cells"} className="flex w-full">
            {row.map((cell, cellIndex) => (
              <span
                key={rowIndex + cellIndex + "cell"}
                className={`flex items-center justify-center border transition-colors hover:bg-secondary/50 ${cell.isClicked ? "bg-secondary" : "bg-background"} ${cell.isFlagged && "border-2 border-destructive"} ${cell.isClicked ? "cursor-default" : "cursor-pointer"}`}
                style={{
                  width: gameWidth / settings.size[0],
                  height: gameHeight / settings.size[1],
                }}
                onClick={() => {
                  if (cell.isClicked || cell.isFlagged || isGameOver) return;
                  setRows((prev) => {
                    let copy = [...prev];
                    copy[rowIndex][cellIndex].isClicked = true;
                    if (cell.isMine) {
                      setIsGameOver(true);
                      window.clearInterval(timerRef.current);
                      return copy.map((row) =>
                        row.map((c) => {
                          if (c.isMine) {
                            return { ...c, isClicked: true };
                          }
                          return c;
                        }),
                      );
                    }

                    return clickZeroCells(rowIndex, cellIndex, copy);
                  });
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (cell.isClicked && !cell.isFlagged) return;
                  setRemainingFlags((prev) => {
                    if (cell.isFlagged) {
                      // flag removed
                      return prev + 1;
                    }
                    // flag added
                    return prev - 1;
                  });
                  setRows((prev) => {
                    const copy = [...prev];
                    copy[rowIndex][cellIndex] = {
                      ...cell,
                      isFlagged: !cell.isFlagged,
                    };
                    return copy;
                  });
                }}
              >
                {cell.isFlagged && (
                  <Flag size={"80%"} className="text-destructive" />
                )}
                {cell.isClicked && (
                  <span className="pointer-events-none flex items-center justify-center">
                    {cell.isMine ? (
                      <Bomb size={"80%"} className="text-destructive" />
                    ) : cell.neighbors === 1 ? (
                      <One className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 2 ? (
                      <Two className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 3 ? (
                      <Three className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 4 ? (
                      <Four className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 5 ? (
                      <Five className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 6 ? (
                      <Six className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 7 ? (
                      <Seven className="h-4/5 w-4/5" />
                    ) : cell.neighbors === 8 ? (
                      <Eight className="h-4/5 w-4/5" />
                    ) : (
                      ""
                    )}
                  </span>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

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

type Settings = {
  difficulty: string;
  size: [w: number, h: number];
  mines: number;
};

const settingsChoices: Settings[] = [
  { difficulty: "easy", size: [8, 8], mines: 10 },
  { difficulty: "easy+", size: [9, 9], mines: 10 },
  { difficulty: "easy++", size: [10, 10], mines: 10 },
  { difficulty: "medium", size: [13, 15], mines: 40 },
  { difficulty: "medium+", size: [15, 15], mines: 40 },
  { difficulty: "medium++", size: [16, 16], mines: 40 },
  { difficulty: "expert", size: [16, 30], mines: 99 },
  { difficulty: "IMPOSSIBLE", size: [30, 30], mines: 200 },
];

export const Toolbar = ({
  selectedSettings,
  setSelectedSettings,
  remainingFlags,
  timer,
  setTimer,
  timerRef,
}: {
  selectedSettings: number;
  setSelectedSettings: React.Dispatch<React.SetStateAction<number>>;
  remainingFlags: number;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  timerRef: React.MutableRefObject<number>;
}) => {
  const start = () => {
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const restart = () => {
    window.clearInterval(timerRef.current);
    // clear other stuff
    setTimer(0);
    start();
  };

  useEffect(() => restart(), []);

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <span>
        <span className="text-muted-foreground">mode: </span>
        <span>{settingsChoices[selectedSettings]?.difficulty ?? "none"}</span>
      </span>
      <StartButton
        onClick={() => {
          if (timer) {
            return restart();
          }
          start();
        }}
        setSelectedSettings={setSelectedSettings}
      />

      <span className="flex gap-2">
        {remainingFlags}
        <Flag />
      </span>
      <Button variant={"outline"} className="w-24">
        {paddZeroes(timer, 6)}
      </Button>
    </div>
  );
};

export const StartButton = ({
  onClick,
  setSelectedSettings,
}: {
  onClick: () => void;
  setSelectedSettings: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [selected, setSelected] = useState(-1);
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "default" })}>
        new game
      </DialogTrigger>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Game options</DialogTitle>
          <DialogDescription>
            Please select a difficulty below
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-60 px-4">
          <ul className="flex flex-col gap-3">
            {settingsChoices.map(({ difficulty, size: [w, h], mines }, i) => (
              <li key={i + "settingchoice"}>
                <Card
                  className="cursor-pointer transition-colors hover:bg-secondary"
                  onClick={() => setSelected(i)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{difficulty}</CardTitle>
                    <CardDescription className="flex items-center [&>span]:flex [&>span]:items-center [&>span]:gap-1">
                      <span>
                        {h}x{w} <DimensionsIcon />
                      </span>
                      <DividerVerticalIcon className="inline" />
                      <span>
                        {mines} <Bomb size={".75rem"} />
                      </span>
                      <DividerVerticalIcon className="inline" />
                      <span>
                        {((mines / (w * h)) * 100).toFixed(2)}%
                        <PieChart size={".75rem"} />
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <DialogFooter className="flex w-full flex-row items-center justify-between sm:justify-between">
          <div>
            <span className="text-muted-foreground">selected: </span>
            <span>{settingsChoices[selected]?.difficulty ?? "none"}</span>
          </div>
          <DialogClose
            className={buttonVariants({ variant: "default" })}
            disabled={selected === -1}
            onClick={() => {
              setSelectedSettings(selected);
              setSelected(-1);
              onClick();
            }}
          >
            start
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
