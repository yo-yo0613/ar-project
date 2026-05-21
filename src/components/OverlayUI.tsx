import React, { useState } from 'react';
import { PomodoroTimer } from './PomodoroTimer';
import { useTimer } from '../context/TimerContext';
import { Settings, X } from 'lucide-react';

export const OverlayUI: React.FC = () => {
  const { workDuration, breakDuration, setWorkDuration, setBreakDuration, isActive } = useTimer();
  const [showSettings, setShowSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  return (
    <div className="ui-layer">
      {/* Top Bar: Title & Settings toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          AR Study Buddy
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="glass-button" 
            onClick={() => setShowTimer(!showTimer)}
            style={{ padding: '0 12px', height: '40px', fontSize: '0.9rem', fontWeight: 'bold' }}
          >
            {showTimer ? 'Hide Timer' : 'Show Timer'}
          </button>
          <button 
            className="glass-button" 
            onClick={() => setShowSettings(!showSettings)}
            style={{ width: '40px', height: '40px' }}
            disabled={isActive}
            title={isActive ? "Pause timer to change settings" : "Settings"}
          >
            {showSettings ? <X size={18} /> : <Settings size={18} />}
          </button>
        </div>
      </div>

      {/* Settings Modal (if open) */}
      {showSettings && !isActive && (
        <div className="glass-panel" style={{ 
          position: 'absolute', 
          top: '80px', 
          right: '2rem', 
          padding: '20px', 
          width: '250px',
          animation: 'pulse 0.3s ease-out'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Settings</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Focus Duration (mins)
            </label>
            <input 
              type="number" 
              className="glass-input" 
              value={workDuration} 
              onChange={(e) => setWorkDuration(Number(e.target.value) || 25)}
              min={1}
              max={120}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Break Duration (mins)
            </label>
            <input 
              type="number" 
              className="glass-input" 
              value={breakDuration} 
              onChange={(e) => setBreakDuration(Number(e.target.value) || 5)}
              min={1}
              max={60}
            />
          </div>
        </div>
      )}

      {/* Bottom Area: Timer */}
      <div style={{ 
        alignSelf: 'center', 
        marginBottom: '2rem', 
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        opacity: showTimer ? 1 : 0,
        transform: showTimer ? 'translateY(0)' : 'translateY(50px)',
        pointerEvents: showTimer ? 'auto' : 'none'
      }}>
        <PomodoroTimer />
      </div>
    </div>
  );
};
