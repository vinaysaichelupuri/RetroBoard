import React, { useEffect, useState, useRef } from "react";

interface CountdownTimerProps {
  timer: {
    isRunning: boolean;
    startTimestamp: number;
    duration: number;
    isEnded:boolean;
  } | undefined;
  updateTimer: (timer: { isRunning: boolean; startTimestamp: number; duration: number; isEnded:boolean}) => void;
  isCreator: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timer, updateTimer,isCreator}) => {
  const [customMinutes, setCustomMinutes] = useState(1);
  const beepSound = useRef<HTMLAudioElement | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);

useEffect(() => {
  if (!timer) return;
  let interval: NodeJS.Timeout | null = null;

  const update = () => {
    if (timer.isRunning) {
      const elapsed = Math.floor((Date.now() - timer.startTimestamp) / 1000);
      const left = Math.max(timer.duration - elapsed, 0);
      setTimeLeft(left);

      if (left > 0 && left <= 3) {
        beepSound.current?.play().catch(() => {});
      }

      // When timer reaches zero, set isEnded: true and isRunning: false
      if (left === 0 && timer.isRunning && !timer.isEnded) {
        updateTimer({
          ...timer,
          isRunning: false,
          isEnded: true,
          duration: 0,
        });
      }
    } else {
      setTimeLeft(timer.duration);
    }
  };

  update();
  if (timer.isRunning) {
    interval = setInterval(update, 1000);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [timer, updateTimer]);


  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Timer controls
  const setTimer = (minutes: number) => {
    updateTimer({
      isRunning: false,
      startTimestamp: Date.now(),
      duration: minutes * 60,
      isEnded:false
    });
  };

  const startTimer = () => {
    if (!timer) return;
    updateTimer({
      ...timer,
      isRunning: true,
      startTimestamp: Date.now(),
      isEnded:false
    });
  };

  const stopTimer = () => {
    if (!timer) return;
    // Calculate remaining time
    const elapsed = Math.floor((Date.now() - timer.startTimestamp) / 1000);
    const left = Math.max(timer.duration - elapsed, 0);
    updateTimer({
      isRunning: false,
      startTimestamp: timer.startTimestamp,
      duration: left,
      isEnded:true,
    });
  };

  const resetTimer = () => {
    if (!timer) return;
    updateTimer({
      isRunning: false,
      startTimestamp: Date.now(),
      duration: 0,
      isEnded:true,
    });
  };


  return (
    <div className="p-3 border rounded-md w-80 text-center bg-white shadow-sm">
      <audio ref={beepSound} src="/beep.mp3" preload="auto" />
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-semibold">Voting Countdown</h4>
        <span className="text-2xl font-mono">{formatTime(timeLeft)}</span>
      </div>
      {isCreator && (
        <>
          <div className="flex items-center justify-center gap-2 mb-2">
            <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => setTimer(3)}>3m</button>
            <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => setTimer(5)}>5m</button>
            <input
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-12 h-8 border rounded text-center text-sm"
              min={1}
            />
            <button className="px-2 py-1 bg-purple-500 text-white rounded" onClick={() => setTimer(customMinutes)}>
              Set
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={startTimer}>Start</button>
            <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={stopTimer}>Stop</button>
            <button className="px-2 py-1 bg-gray-500 text-white rounded" onClick={resetTimer}>Reset</button>
          </div>
        </>
      )}
    </div>
  );
};