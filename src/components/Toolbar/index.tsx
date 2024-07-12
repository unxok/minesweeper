import { DIFFICULTY_PARAM_KEY, settingsChoices } from "@/App";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { DimensionsIcon, DividerVerticalIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Bomb, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getHighScores, paddZeroes } from "@/lib/utils";

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
    <div className="z-50 flex items-center justify-center gap-3 py-3">
      <span>
        <span className="text-muted-foreground">mode: </span>
        <span>{settingsChoices[selectedSettings]?.difficulty ?? "none"}</span>
      </span>
      <StartButton
        onClick={() => {
          // if (timer) {
          //   return restart();
          // }
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

const StartButton = (
  {
    // onClick,
    // setSelectedSettings,
  }: {
    onClick: () => void;
    setSelectedSettings: React.Dispatch<React.SetStateAction<number>>;
  },
) => {
  const scores = getHighScores();
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
                  <CardFooter>
                    <span className="text-muted-foreground">High score:</span>
                    &nbsp;
                    {scores.hasOwnProperty(difficulty) && (
                      <span>{scores[difficulty]}</span>
                    )}
                    {!scores.hasOwnProperty(difficulty) && <i>none</i>}
                  </CardFooter>
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
              window.location.href =
                window.location.origin +
                window.location.pathname +
                "/?" +
                DIFFICULTY_PARAM_KEY +
                "=" +
                selected;
              // console.log("did i make it?");
              // setSelectedSettings(selected);
              // setSelected(-1);
              // onClick();
            }}
          >
            start
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
