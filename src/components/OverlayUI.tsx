import React, { useState } from 'react';
import { useTimer } from '../context/TimerContext';
import { Home, ChevronLeft, ChevronRight, Book, Undo, Play, Pause } from 'lucide-react';

export const OverlayUI: React.FC = () => {
  const { 
    timeLeft, 
    isActive, 
    toggleTimer, 
    resetTimer, 
    appState, 
    setAppState, 
    subject, 
    feedCompanion,
    isTargetFound,
    triggerCompanionReaction,
    companionState
  } = useTimer();

  const subjects = ['國文', '英文', '數學', '自然', '社會'];
  const subjectColors = ['#D97777', '#7799D9', '#77D988', '#D9D377', '#D9A177'];
  const [subjectIndex, setSubjectIndex] = useState(1); // Default to 英文

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSpeechText = () => {
    switch (appState) {
      case 'selection': return '滑動選擇科目';
      case 'ready': return '點擊下方按鈕開始計時';
      case 'focusing': 
        return isActive ? '怎麼來看我啦~' : '你按了暫停，快回來專心！';
      case 'completed': return '好棒！完成了！來跟我玩吧！';
      case 'feeding': return '謝謝你陪我玩！\n(點擊BACK選擇其他科目)';
      default: return '嗨！';
    }
  };

  const getMascotImage = () => {
    if (companionState === 'happy') return '/IMG_6057.png'; // previously 4.jpg
    if (companionState === 'sad') return '/IMG_6055.png'; // previously 2.jpg
    if (companionState === 'angry') return '/IMG_6056.png'; // previously 3.jpg
    return '/IMG_6054.png'; // idle, previously 1.jpg
  };

  const nextSubject = () => setSubjectIndex((i) => (i + 1) % subjects.length);
  const prevSubject = () => setSubjectIndex((i) => (i - 1 + subjects.length) % subjects.length);

  return (
    <div className="ui-layer" style={{ padding: '20px 20px 0 20px', pointerEvents: 'none' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="icon-button" onClick={() => window.location.reload()} style={{ pointerEvents: 'auto' }}>
          <Home size={32} color="#5C4033" />
        </button>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#5C4033' }}>
          {appState !== 'selection' ? subject : ''}
        </div>
      </div>

      {/* Center: Speech Bubble & Mascot (appears above the panel) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        paddingBottom: '20px' 
      }}>
        <div className="speech-bubble" style={{ pointerEvents: 'auto', textAlign: 'center', whiteSpace: 'pre-line', marginBottom: '20px', opacity: isTargetFound ? 1 : 0, transition: 'opacity 0.3s' }}>
          {getSpeechText()}
        </div>
        
        {isTargetFound && (
          <img 
            src={getMascotImage()} 
            alt="Mascot" 
            onClick={triggerCompanionReaction}
            style={{ 
              width: '280px', 
              height: 'auto', 
              pointerEvents: 'auto', 
              cursor: 'pointer', 
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))',
              animation: 'float 4s infinite ease-in-out'
            }} 
          />
        )}
      </div>

      {/* Bottom Panel */}
      <div className="panel" style={{ 
        height: '180px', 
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        
        {appState === 'selection' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="icon-button" onClick={prevSubject}><ChevronLeft size={40}/></button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} 
                 onClick={() => { setAppState('ready'); }}>
              <Book size={64} color={subjectColors[subjectIndex]} fill={subjectColors[subjectIndex]} style={{ opacity: 0.9 }}/>
              <span style={{ fontWeight: 800, marginTop: '8px', fontSize: '1.1rem' }}>{subjects[subjectIndex]}</span>
            </div>
            <button className="icon-button" onClick={nextSubject}><ChevronRight size={40}/></button>
          </div>
        )}

        {appState === 'ready' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <button className="icon-button" onClick={() => setAppState('selection')}><Undo size={32}/></button>
            <button className="action-button" onClick={toggleTimer} style={{ width: '160px' }}>START</button>
          </div>
        )}

        {appState === 'focusing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <button className="icon-button" onClick={resetTimer}><Undo size={32}/></button>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, width: '150px', textAlign: 'center' }}>
              {formatTime(timeLeft)}
            </div>
            <button className="icon-button" onClick={toggleTimer}>
              {isActive ? <Pause size={36} fill="#5C4033"/> : <Play size={36} fill="#5C4033"/>}
            </button>
          </div>
        )}

        {appState === 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexDirection: 'column' }}>
             <button className="action-button" onClick={feedCompanion} style={{ width: '160px' }}>餵食</button>
          </div>
        )}

        {appState === 'feeding' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <button className="action-button" onClick={resetTimer} style={{ width: '160px', background: '#D4A373' }}>BACK</button>
          </div>
        )}

      </div>
    </div>
  );
};
