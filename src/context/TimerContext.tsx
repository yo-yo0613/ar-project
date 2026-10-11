import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type TimerMode = 'work' | 'break';
export type AppState = 'selection' | 'ready' | 'focusing' | 'completed' | 'feeding';
export type CompanionState = 'idle' | 'sad' | 'angry' | 'happy';
export type ModeType = 'menu' | 'ar' | 'pure';

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
  setPresetDuration: (mins: number) => void;
  setMode: (mode: TimerMode) => void;
  companionState: CompanionState;
  setCompanionState: (state: CompanionState) => void;
  triggerCompanionReaction: () => void;
  
  // App Flow & Dual Mode States
  appState: AppState;
  setAppState: (state: AppState) => void;
  subject: string;
  setSubject: (subject: string) => void;
  feedCompanion: () => void;
  isTargetFound: boolean;
  setIsTargetFound: (found: boolean) => void;
  isGracePeriod: boolean;
  
  modeType: ModeType;
  setModeType: (mode: ModeType) => void;
  
  // Anti-gravity & Anti-distraction States
  isDistracted: boolean;
  recoverFromDistraction: () => void;
  
  // Exit Confirmation Modal
  isConfirmingExit: boolean;
  openExitConfirm: () => void;
  closeExitConfirm: () => void;
  confirmExitToMenu: () => void;

  // Library Silent & Continuous Vibration Alarm States (Option A)
  isLibraryMode: boolean;
  setIsLibraryMode: (val: boolean) => void;
  isAlarmActive: boolean;
  stopAlarm: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  
  // Dual Mode & App Flow
  const [modeType, setModeType] = useState<ModeType>('menu');
  const [appState, setAppState] = useState<AppState>('selection');
  const [subject, setSubject] = useState<string>('英文');
  const [companionState, setCompanionState] = useState<CompanionState>('idle');
  const [isTargetFoundRaw, setIsTargetFoundRaw] = useState<boolean>(false);
  const [isGracePeriod, setIsGracePeriod] = useState<boolean>(false);
  
  // Anti-gravity Distraction & Exit Modal States
  const [isDistracted, setIsDistracted] = useState<boolean>(false);
  const [isConfirmingExit, setIsConfirmingExit] = useState<boolean>(false);

  // Library Silent & Continuous Vibration Alarm States (Option A)
  const [isLibraryMode, setIsLibraryMode] = useState<boolean>(true);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);
  const vibrationIntervalRef = useRef<number | null>(null);
  const alarmTimeoutRef = useRef<number | null>(null);
  
  const [audioUrl, setAudioUrl] = useState<string>('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  
  const targetEndTime = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const graceTimerRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  const stopAlarm = () => {
    setIsAlarmActive(false);
    if (vibrationIntervalRef.current) {
      window.clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    if (alarmTimeoutRef.current) {
      window.clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  };

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  // AR Grace period handler (Option A: 15 seconds buffer when target lost)
  const setIsTargetFound = (found: boolean) => {
    if (found) {
      if (graceTimerRef.current) {
        window.clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
      setIsGracePeriod(false);
      setIsTargetFoundRaw(true);
    } else {
      // If we previously had the target, start 15s grace buffer
      if (isTargetFoundRaw) {
        setIsGracePeriod(true);
        if (graceTimerRef.current) window.clearTimeout(graceTimerRef.current);
        graceTimerRef.current = window.setTimeout(() => {
          setIsTargetFoundRaw(false);
          setIsGracePeriod(false);
          graceTimerRef.current = null;
        }, 15000); // 15s grace period
      } else {
        setIsTargetFoundRaw(false);
      }
    }
  };

  // Screen WakeLock management (keep screen on during focus)
  useEffect(() => {
    const manageWakeLock = async () => {
      if (isActive && appState === 'focusing' && !isDistracted) {
        if ('wakeLock' in navigator) {
          try {
            wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          } catch (err) {
            console.log('WakeLock error:', err);
          }
        }
      } else {
        if (wakeLockRef.current) {
          try {
            await wakeLockRef.current.release();
          } catch (_) {}
          wakeLockRef.current = null;
        }
      }
    };
    manageWakeLock();

    return () => {
      if (wakeLockRef.current) {
        try {
          wakeLockRef.current.release();
        } catch (_) {}
        wakeLockRef.current = null;
      }
    };
  }, [isActive, appState, isDistracted]);

  // Anti-distraction: Page Visibility API & blur detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isActive && appState === 'focusing' && document.hidden) {
        // User switched tabs or minimized app!
        setIsDistracted(true);
        setCompanionState('angry');
        setIsActive(false); // Pause timer during violation
        targetEndTime.current = null;
        
        // Vibrate to warn
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 300]);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, appState]);

  // Recover from distraction (re-assemble physics and resume)
  const recoverFromDistraction = () => {
    setIsDistracted(false);
    setCompanionState('sad'); // Back to tired focus
    setIsActive(true);
    targetEndTime.current = Date.now() + timeLeft * 1000;
  };

  // Quick duration capsules (15m / 25m / 45m)
  const setPresetDuration = (mins: number) => {
    setWorkDuration(mins);
    if (!isActive) {
      setTimeLeft(mins * 60);
    }
  };

  // Triggered when user pokes the companion
  const triggerCompanionReaction = () => {
    if (appState === 'focusing' && !isDistracted) {
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

  // Main countdown loop
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && targetEndTime.current !== null && !isDistracted) {
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
          
          setIsAlarmActive(true);

          // Only play audio alarm if NOT in Library Silent Mode
          if (!isLibraryMode && audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          }

          // Continuous Gentle Pulse Vibration (Option A: Heartbeat [150, 100, 150] every 1.5s)
          if ('vibrate' in navigator) {
            navigator.vibrate([150, 100, 150]);
          }
          if (vibrationIntervalRef.current) window.clearInterval(vibrationIntervalRef.current);
          vibrationIntervalRef.current = window.setInterval(() => {
            if ('vibrate' in navigator) {
              navigator.vibrate([150, 100, 150]);
            }
          }, 1500);

          // 30s auto-stop fuse to protect battery & prevent long resonance
          if (alarmTimeoutRef.current) window.clearTimeout(alarmTimeoutRef.current);
          alarmTimeoutRef.current = window.setTimeout(() => {
            stopAlarm();
          }, 30000);

          // Native notification
          const title = mode === 'work' ? 'Focus Session Complete!' : 'Break Time Over!';
          const body = mode === 'work' ? 'Great job! Time for a break.' : 'Ready to focus again?';
          
          if ('Notification' in window && Notification.permission === 'granted') {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, { 
                  body, 
                  icon: '/IMG_6057.PNG',
                  vibrate: [150, 100, 150, 100, 150] 
                } as any);
              }).catch(() => {
                new Notification(title, { body, icon: '/IMG_6057.PNG' });
              });
            } else {
              new Notification(title, { body, icon: '/IMG_6057.PNG' });
            }
          }
        }
      }, 200); 
    } else if (!isActive && appState === 'focusing' && !isDistracted) {
      setCompanionState('angry'); // "生氣/暫停中"
      targetEndTime.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, appState, isDistracted, isLibraryMode]);

  const toggleTimer = async () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }

    if (!isActive) {
      targetEndTime.current = Date.now() + timeLeft * 1000;
      setAppState('focusing');
      setIsDistracted(false);
      
      if (audioRef.current) {
        audioRef.current.load();
      }
    } else {
      targetEndTime.current = null;
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    stopAlarm();
    setIsActive(false);
    targetEndTime.current = null;
    setIsDistracted(false);
    setAppState('selection');
    setCompanionState('idle');
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const feedCompanion = () => {
    stopAlarm();
    setAppState('feeding');
    setCompanionState('happy');
  };

  // Safe Home Exit Flow (No reload!)
  const openExitConfirm = () => {
    if (appState === 'selection') {
      // Already at selection, directly return to menu
      setModeType('menu');
    } else {
      setIsConfirmingExit(true);
    }
  };

  const closeExitConfirm = () => {
    setIsConfirmingExit(false);
  };

  const confirmExitToMenu = () => {
    stopAlarm();
    setIsConfirmingExit(false);
    setIsActive(false);
    targetEndTime.current = null;
    setIsDistracted(false);
    setAppState('selection');
    setCompanionState('idle');
    setTimeLeft(workDuration * 60);
    setModeType('menu');
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
      setPresetDuration,
      setMode,
      companionState,
      setCompanionState,
      triggerCompanionReaction,
      appState,
      setAppState,
      subject,
      setSubject,
      feedCompanion,
      isTargetFound: modeType === 'pure' ? true : isTargetFoundRaw,
      setIsTargetFound,
      isGracePeriod,
      modeType,
      setModeType,
      isDistracted,
      recoverFromDistraction,
      isConfirmingExit,
      openExitConfirm,
      closeExitConfirm,
      confirmExitToMenu,
      isLibraryMode,
      setIsLibraryMode,
      isAlarmActive,
      stopAlarm
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

