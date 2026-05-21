import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type TimerMode = 'work' | 'break';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  workDuration: number;
  breakDuration: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  setWorkDuration: (mins: number) => void;
  setBreakDuration: (mins: number) => void;
  setMode: (mode: TimerMode) => void;
  companionState: 'idle' | 'happy' | 'focus';
  setCompanionState: (state: 'idle' | 'happy' | 'focus') => void;
  triggerCompanionReaction: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [companionState, setCompanionState] = useState<'idle' | 'happy' | 'focus'>('idle');

  // Triggered when user pokes the companion
  const triggerCompanionReaction = () => {
    setCompanionState('happy');
    setTimeout(() => {
      setCompanionState(isActive ? 'focus' : 'idle');
    }, 2000);
  };

  useEffect(() => {
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  }, [workDuration, breakDuration, mode]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
      setCompanionState('focus');
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setCompanionState('happy'); // Celebrate finishing a session
      // Switch modes automatically?
      setTimeout(() => {
        setMode(prev => prev === 'work' ? 'break' : 'work');
      }, 3000);
    } else if (!isActive) {
      setCompanionState('idle');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  return (
    <TimerContext.Provider value={{
      timeLeft,
      isActive,
      mode,
      workDuration,
      breakDuration,
      toggleTimer,
      resetTimer,
      setWorkDuration,
      setBreakDuration,
      setMode,
      companionState,
      setCompanionState,
      triggerCompanionReaction
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
