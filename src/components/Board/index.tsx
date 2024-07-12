import { AnimatePresence, motion } from "framer-motion";
import { Flag, Shovel } from "lucide-react";
import { Eight } from "../Numbers/Eight";
import { Five } from "../Numbers/Five";
import { Four } from "../Numbers/Four";
import { One } from "../Numbers/One";
import { Seven } from "../Numbers/Seven";
import { Six } from "../Numbers/Six";
import { Three } from "../Numbers/Three";
import { Two } from "../Numbers/Two";
import { useRef, useState } from "react";
import { Cell, gameHeight, gameWidth, Settings } from "@/App";
import { ZoomSlider } from "../ZoomSlider";
import { clickZeroCells } from "@/lib/utils";
import { Mine } from "../Mine";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Board = ({
  rows,
  setRows,
  settings,
  isGameOver,
  setIsGameOver,
  timerRef,
  setRemainingFlags,
}: {
  rows: Cell[][];
  setRows: React.Dispatch<React.SetStateAction<Cell[][]>>;
  settings: Settings;
  isGameOver: boolean;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  timerRef: React.MutableRefObject<number>;
  setRemainingFlags: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [clickIsFlag, setClickIsFlag] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [boardPan, setBoardPan] = useState<[x: number, y: number]>([0, 0]);
  const boardRef = useRef<HTMLDivElement>(null);

  const onContextMenu = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | null,
    cell: Cell,
    cellIndex: number,
    rowIndex: number,
  ) => {
    if (e) {
      e.preventDefault();
    }
    if ((cell.isClicked && !cell.isFlagged) || isGameOver) return;
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
  };
  return (
    <>
      <motion.div
        onPanStart={() => setIsPanning(true)}
        onPan={(_, { delta: { x: dx, y: dy } }) => {
          setBoardPan(([x, y]) => [x + dx, y + dy]);
        }}
        onPanEnd={() => setIsPanning(false)}
        ref={boardRef}
        className="flex touch-none flex-wrap items-center justify-center bg-background"
        style={{
          width: gameWidth,
          height: gameHeight,
          translate: boardPan[0] + "px " + boardPan[1] + "px",
          pointerEvents: isPanning ? "none" : "auto",
        }}
      >
        {rows.map((row, rowIndex) => (
          <div
            onDragStart={(e) => e.preventDefault()}
            key={rowIndex + "row-of-cells"}
            className="flex w-full"
          >
            {row.map((cell, cellIndex) => (
              <span
                key={rowIndex + cellIndex + "cell"}
                className={`flex items-center justify-center border transition-colors hover:bg-secondary/50 ${cell.isClicked ? "bg-secondary" : "bg-background"} ${(cell.isFlagged || cell.isTrap) && "border-2 border-destructive"} ${cell.isTrap && "border-dashed"} ${cell.isClicked ? "cursor-default" : "cursor-pointer"}`}
                style={{
                  width: gameWidth / settings.size[0],
                  height: gameHeight / settings.size[1],
                }}
                onClick={() => {
                  if (clickIsFlag) {
                    return onContextMenu(null, cell, cellIndex, rowIndex);
                  }
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
                onContextMenu={(e) =>
                  onContextMenu(e, cell, cellIndex, rowIndex)
                }
              >
                <AnimatePresence>
                  {cell.isFlagged && (
                    <motion.div
                      className="flex items-center justify-center"
                      // key={cellIndex + "flag"}
                      initial={{ translateY: -50, opacity: 0 }}
                      animate={{ translateY: 0, rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                    >
                      <Flag size={"80%"} className="text-destructive" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {cell.isClicked && (
                  <span
                    onDragStart={(e) => e.preventDefault()}
                    className="pointer-events-none flex items-center justify-center"
                  >
                    {cell.isMine ? (
                      <div className="flex items-center justify-center bg-destructive">
                        <Mine className="h-full w-full" />
                      </div>
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
      </motion.div>
      {/* <Button
        onClick={() => {
          setRows((prev) => {
            const noMines = prev.map((row) =>
              row.map((c) => ({ ...c, isMine: false }) as Cell),
            );
            const withMines = scatterMines(noMines, settings.mines);
            return calculateNeighbors(withMines);
          });
        }}
      >
        randomize
      </Button> */}
      <div className="absolute bottom-10 left-1/2 flex w-full -translate-x-1/2 flex-col items-center justify-center">
        <ZoomSlider boardRef={boardRef} />
        <Tabs
          className="z-50 pt-2"
          value={clickIsFlag ? "flag" : "mine"}
          onValueChange={(v) => {
            setClickIsFlag(v === "flag");
          }}
        >
          <TabsList className="bg-destructive">
            <TabsTrigger value="mine">
              <Shovel />
            </TabsTrigger>
            <TabsTrigger value="flag">
              <Flag />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};
