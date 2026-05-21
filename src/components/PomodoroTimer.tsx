import React from 'react';
import { useTimer } from '../context/TimerContext';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const PomodoroTimer: React.FC = () => {
  const { timeLeft, isActive, toggleTimer, resetTimer, mode, workDuration, breakDuration } = useTimer();

  const totalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
  const percentage = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SVG Circle properties
  const radius = 60;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600, color: mode === 'work' ? '#FF4D85' : '#4DFFB8' }}>
        {mode === 'work' ? 'Focus Session' : 'Break Time'}
      </div>

      <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="150"
          height="150"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="75"
            cy="75"
          />
          <circle
            className="progress-ring__circle"
            stroke={mode === 'work' ? '#FF4D85' : '#4DFFB8'}
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="75"
            cy="75"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              strokeLinecap: 'round'
            }}
          />
        </svg>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <button 
          className="glass-button primary" 
          onClick={toggleTimer}
          style={{ width: '48px', height: '48px' }}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '4px' }} />}
        </button>
        <button 
          className="glass-button" 
          onClick={resetTimer}
          style={{ width: '48px', height: '48px' }}
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};
