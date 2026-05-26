import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type TimerMode = 'work' | 'break';

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
  const [audioUrl, setAudioUrl] = useState<string>('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  
  const targetEndTime = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request Notification Permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    audioRef.current = new Audio(audioUrl);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  // Triggered when user pokes the companion
  const triggerCompanionReaction = () => {
    setCompanionState('happy');
    setTimeout(() => {
      setCompanionState(isActive ? 'focus' : 'idle');
    }, 2000);
  };

  // Reset timer when duration or mode changes (if not active)
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration, mode, isActive]);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && targetEndTime.current !== null) {
      setCompanionState('focus');
      
      interval = window.setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((targetEndTime.current! - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // Timer finished!
          setIsActive(false);
          targetEndTime.current = null;
          setCompanionState('happy'); 
          
          // Play Audio
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }

          // Show Notification (Native Mobile Style via Service Worker)
          const title = mode === 'work' ? 'Focus Session Complete!' : 'Break Time Over!';
          const body = mode === 'work' ? 'Great job! Time for a break.' : 'Ready to focus again?';
          
          if ('Notification' in window && Notification.permission === 'granted') {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, { 
                  body, 
                  icon: '/companion_happy.png',
                  vibrate: [200, 100, 200, 100, 200, 100, 200] 
                });
              }).catch(err => {
                // Fallback if SW is not ready
                new Notification(title, { body, icon: '/companion_happy.png' });
              });
            } else {
              new Notification(title, { body, icon: '/companion_happy.png' });
            }
          } else {
            alert(`${title}\n${body}`); // Fallback
          }

          // Switch modes automatically
          setTimeout(() => {
            setMode(prev => prev === 'work' ? 'break' : 'work');
          }, 3000);
        }
      }, 200); // Check frequently (5 times a second)
    } else if (!isActive) {
      setCompanionState('idle');
      targetEndTime.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode]);

  const toggleTimer = () => {
    if (!isActive) {
      // Starting the timer
      targetEndTime.current = Date.now() + timeLeft * 1000;
    } else {
      // Pausing the timer
      targetEndTime.current = null;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    targetEndTime.current = null;
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
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
