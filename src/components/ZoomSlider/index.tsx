import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

export const ZoomSlider = ({
  boardRef,
  // value,
  // setValue,
}: {
  boardRef: React.RefObject<HTMLDivElement>;
  // value: number[];
  // setValue: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const [zoom, setZoom] = useState([0.75]);
  const min = 0.05;
  const max = 3.5;
  const step = 0.05;

  useEffect(() => {
    if (!boardRef.current) return;
    const cb = (e: WheelEvent) => {
      const sign = e.deltaY / Math.abs(e.deltaY);
      setZoom((prev) => {
        const val = prev[0] - step * sign;
        if (val < min) return [min];
        if (val > max) return [max];
        return [val];
      });
    };
    boardRef.current.addEventListener("wheel", cb);

    return () => {
      window.removeEventListener("wheel", cb);
    };
  }, []);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.style.transform = "scale(" + zoom + ")";
  }, [zoom]);

  return (
    <Slider
      value={zoom}
      onValueChange={(v) => setZoom(v)}
      min={min}
      max={max}
      step={step}
      className="w-3/4 py-5"
      label={(v) => Math.floor(v[0] * 100)}
    />
  );
};
