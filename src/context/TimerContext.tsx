import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type TimerMode = 'work' | 'break';
export type AppState = 'selection' | 'ready' | 'focusing' | 'completed' | 'feeding';
export type CompanionState = 'idle' | 'sad' | 'angry' | 'happy';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  workDuration: number;
  breakDuration: number;
  audioUrl: string;
  setAudioUrl: (url: string) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  setWorkDuration: (mins: number) => void;
  setBreakDuration: (mins: number) => void;
  setMode: (mode: TimerMode) => void;
  companionState: CompanionState;
  setCompanionState: (state: CompanionState) => void;
  triggerCompanionReaction: () => void;
  
  // New App Flow States
  appState: AppState;
  setAppState: (state: AppState) => void;
  subject: string;
  setSubject: (subject: string) => void;
  feedCompanion: () => void;
  isTargetFound: boolean;
  setIsTargetFound: (found: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  
  // New App Flow
  const [appState, setAppState] = useState<AppState>('selection');
  const [subject, setSubject] = useState<string>('英文');
  const [companionState, setCompanionState] = useState<CompanionState>('idle');
  const [isTargetFound, setIsTargetFound] = useState<boolean>(false);
  
  const [audioUrl, setAudioUrl] = useState<string>('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  
  const targetEndTime = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  // Triggered when user pokes the companion
  const triggerCompanionReaction = () => {
    if (appState === 'focusing') {
      setCompanionState('happy');
      setTimeout(() => {
        setCompanionState(isActive ? 'sad' : 'angry');
      }, 2000);
    }
  };

  // Reset timer when duration or mode changes (if not active)
  useEffect(() => {
    if (!isActive && appState !== 'completed' && appState !== 'feeding') {
      setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration, mode, isActive, appState]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && targetEndTime.current !== null) {
      // During active focus
      setAppState('focusing');
      setCompanionState('sad'); // "專注疲累"
      
      interval = window.setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((targetEndTime.current! - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // Timer finished!
          setIsActive(false);
          targetEndTime.current = null;
          setAppState('completed');
          setCompanionState('happy'); // "完成開心"
          
          // Play Audio
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }

          // Show Notification
          const title = mode === 'work' ? 'Focus Session Complete!' : 'Break Time Over!';
          const body = mode === 'work' ? 'Great job! Time for a break.' : 'Ready to focus again?';
          
          if ('Notification' in window && Notification.permission === 'granted') {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, { 
                  body, 
                  icon: '/IMG_6057.png',
                  vibrate: [200, 100, 200, 100, 200, 100, 200] 
                } as any);
              }).catch(() => {
                new Notification(title, { body, icon: '/IMG_6057.png' });
              });
            } else {
              new Notification(title, { body, icon: '/IMG_6057.png' });
            }
          }
        }
      }, 200); 
    } else if (!isActive && appState === 'focusing') {
      // Paused state
      setCompanionState('angry'); // "生氣/暫停中"
      targetEndTime.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, appState]);

  const toggleTimer = async () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }

    if (!isActive) {
      // Starting the timer
      targetEndTime.current = Date.now() + timeLeft * 1000;
      setAppState('focusing');
      
      if (audioRef.current) {
        audioRef.current.load();
      }
    } else {
      // Pausing the timer
      targetEndTime.current = null;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    targetEndTime.current = null;
    setAppState('selection');
    setCompanionState('idle');
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const feedCompanion = () => {
    setAppState('feeding');
    setCompanionState('happy');
  };

  return (
    <TimerContext.Provider value={{
      timeLeft,
      isActive,
      mode,
      workDuration,
      breakDuration,
      audioUrl,
      setAudioUrl,
      toggleTimer,
      resetTimer,
      setWorkDuration,
      setBreakDuration,
      setMode,
      companionState,
      setCompanionState,
      triggerCompanionReaction,
      appState,
      setAppState,
      subject,
      setSubject,
      feedCompanion,
      isTargetFound,
      setIsTargetFound
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
