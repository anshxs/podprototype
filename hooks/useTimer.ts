import { useState, useEffect, useCallback } from 'react';
import { TIMER_DURATIONS } from '@/lib/constants';

export type TimerMode = 'work' | 'break' | 'longBreak';

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleTimerComplete = useCallback(() => {
    if (mode === 'work') {
      setSessionsCompleted((prev) => prev + 1);
      // Switch to break
      const isLongBreak = sessionsCompleted % 4 === 3;
      const nextMode = isLongBreak ? 'longBreak' : 'break';
      setMode(nextMode);
      setTimeLeft(TIMER_DURATIONS[nextMode] * 60);
    } else {
      // Break finished, go back to work
      setMode('work');
      setTimeLeft(TIMER_DURATIONS.work * 60);
    }
  }, [mode, sessionsCompleted]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(TIMER_DURATIONS.work * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setSessionsCompleted((prev) => prev + 1);
      const isLongBreak = sessionsCompleted % 4 === 3;
      const nextMode = isLongBreak ? 'longBreak' : 'break';
      setMode(nextMode);
      setTimeLeft(TIMER_DURATIONS[nextMode] * 60);
    } else {
      setMode('work');
      setTimeLeft(TIMER_DURATIONS.work * 60);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    formatTime: () => formatTime(timeLeft),
    getDurationLabel: () => {
      if (mode === 'work') return 'Work Session';
      if (mode === 'break') return 'Short Break';
      return 'Long Break';
    },
  };
}
