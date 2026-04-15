import {useState, useCallback, useRef, useEffect} from 'react';

export interface VisualizerStep<T = any> {
  state: T;
  highlights: Record<string, number[]>; // e.g. { comparing: [0,1], sorted: [5,6] }
  explanation: string;
}

type PlaybackState = 'idle' | 'playing' | 'paused' | 'done';

interface VisualizerEngine<T> {
  steps: VisualizerStep<T>[];
  currentStepIndex: number;
  currentStep: VisualizerStep<T> | null;
  playbackState: PlaybackState;
  speed: number;
  totalSteps: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  setSteps: (steps: VisualizerStep<T>[]) => void;
}

export function useVisualizerEngine<T = any>(
  initialSteps: VisualizerStep<T>[] = [],
): VisualizerEngine<T> {
  const [steps, setStepsState] = useState<VisualizerStep<T>[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const scheduleNextStep = useCallback(() => {
    clearTimer();
    const delay = Math.max(100, 800 / speed);
    timerRef.current = window.setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          setPlaybackState('done');
          return prev;
        }
        scheduleNextStep();
        return next;
      });
    }, delay);
  }, [steps.length, speed, clearTimer]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setPlaybackState('playing');
    scheduleNextStep();
  }, [steps.length, currentStepIndex, scheduleNextStep]);

  const pause = useCallback(() => {
    clearTimer();
    setPlaybackState('paused');
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    clearTimer();
    setPlaybackState('paused');
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length, clearTimer]);

  const stepBack = useCallback(() => {
    clearTimer();
    setPlaybackState('paused');
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStepIndex(0);
    setPlaybackState('idle');
  }, [clearTimer]);

  const goToStep = useCallback((index: number) => {
    clearTimer();
    setPlaybackState('paused');
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  }, [steps.length, clearTimer]);

  const setSteps = useCallback((newSteps: VisualizerStep<T>[]) => {
    clearTimer();
    setStepsState(newSteps);
    setCurrentStepIndex(0);
    setPlaybackState('idle');
  }, [clearTimer]);

  // When speed changes during playback, reschedule
  useEffect(() => {
    if (playbackState === 'playing') {
      clearTimer();
      scheduleNextStep();
    }
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex] ?? null,
    playbackState,
    speed,
    totalSteps: steps.length,
    play,
    pause,
    stepForward,
    stepBack,
    reset,
    goToStep,
    setSpeed,
    setSteps,
  };
}
