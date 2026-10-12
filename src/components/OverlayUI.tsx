import React, { useState, useRef } from 'react';
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
    setSubject,
    feedCompanion,
    isTargetFound,
    triggerCompanionReaction,
    companionState,
    workDuration,
    breakDuration,
    setBreakDuration,
    setPresetDuration,
    setPresetSeconds,
    startBreakSession,
    skipBreak,
    startNextFocusSession,
    isQuickTest,
    modeType,
    isGracePeriod,
    isConfirmingExit,
    openExitConfirm,
    closeExitConfirm,
    confirmExitToMenu,
    isLibraryMode,
    setIsLibraryMode,
    isAlarmActive,
    stopAlarm
  } = useTimer();

  const subjects = ['國文', '英文', '數學', '自然', '社會'];
  const subjectColors = ['#D97777', '#7799D9', '#77D988', '#D9D377', '#D9A177'];
  const [subjectIndex, setSubjectIndex] = useState(1); // Default to 英文

  // Touch Swipe tracking for Subject Selection
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 40) {
      prevSubject();
    } else if (diff < -40) {
      nextSubject();
    }
    touchStartX.current = null;
  };

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
    if (isAlarmActive) {
      if (appState === 'break_completed') {
        return '☕ 休息時間結束囉！\n充電完畢，準備好繼續加油了嗎？';
      }
      return '時間到囉！\n點擊螢幕任意處關閉提醒並餵食~';
    }

    if (modeType === 'ar' && isGracePeriod) {
      return '卡片移開囉！\n我先在這邊等你~(15秒)';
    }

    switch (appState) {
      case 'selection': return '左右滑動或點擊選擇科目';
      case 'ready': return '挑個時間，準備開始專注囉！';
      case 'focusing': 
        return isActive ? '怎麼來看我啦~ 快認真！' : '你按了暫停，快回來專心！';
      case 'completed': return '好棒！完成專注了！\n先來餵我吃草莓慶祝吧！🍓';
      case 'feeding': return '草莓好好吃！🍓\n辛苦啦，準備好就點擊開始休息吧～';
      case 'breaking': return '辛苦啦～閉上眼睛深呼吸，\n看看遠方綠樹或喝口水吧！🍃';
      case 'break_completed': return `✨ 充電完畢！\n準備好繼續讀【${subject}】了嗎？`;
      default: return '嗨！';
    }
  };

  const getMascotImage = () => {
    if (companionState === 'happy') return '/IMG_6057.PNG';
    if (companionState === 'sad') return '/IMG_6055.PNG';
    if (companionState === 'angry') return '/IMG_6056.PNG';
    return '/IMG_6054.PNG'; // idle & relaxed
  };

  const nextSubject = () => setSubjectIndex((i) => (i + 1) % subjects.length);
  const prevSubject = () => setSubjectIndex((i) => (i - 1 + subjects.length) % subjects.length);

  return (
    <div className="ui-layer" style={{ padding: '20px 20px 0 20px', pointerEvents: 'none' }}>
      
      {/* Screen Glow Breathing Animation on Alarm (Tap anywhere to immediately silence!) */}
      {isAlarmActive && (
        <div 
          onClick={stopAlarm}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'auto',
            boxShadow: 'inset 0 0 60px rgba(217, 119, 119, 0.75)',
            animation: 'pulse 1.2s infinite ease-in-out',
            zIndex: 150,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '65px'
          }}
        >
          <div style={{
            background: 'rgba(217, 119, 119, 0.95)',
            color: '#FFFFFF',
            borderRadius: '999px',
            border: '2px solid #FFFFFF',
            padding: '8px 22px',
            fontWeight: 800,
            fontSize: '0.92rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            animation: 'float 2s infinite ease-in-out'
          }}>
            🔔 點擊螢幕任意處立即靜音 🔕
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="icon-button" 
          onClick={openExitConfirm} 
          style={{ pointerEvents: 'auto' }}
          title="回首頁"
        >
          <Home size={32} color="#5C4033" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {appState === 'breaking' ? (
            <span style={{ 
              fontSize: '0.8rem', 
              background: '#E8F5E9', 
              padding: '4px 10px', 
              borderRadius: '999px',
              border: '2px solid #5C4033',
              color: '#2E7D32',
              fontWeight: 800
            }}>
              🍃 休息放鬆中
            </span>
          ) : appState === 'focusing' ? (
            <span style={{ 
              fontSize: '0.8rem', 
              background: '#FFF3E0', 
              padding: '4px 10px', 
              borderRadius: '999px',
              border: '2px solid #5C4033',
              color: '#E65100',
              fontWeight: 800
            }}>
              📖 專注中
            </span>
          ) : (
            <span style={{ 
              fontSize: '0.8rem', 
              background: modeType === 'ar' ? '#E8D5B7' : '#FFFFFF', 
              padding: '4px 10px', 
              borderRadius: '999px',
              border: '2px solid #5C4033',
              color: '#5C4033',
              fontWeight: 800
            }}>
              {modeType === 'ar' ? '📷 AR 模式' : '📖 桌面模式'}
            </span>
          )}
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#5C4033' }}>
            {appState !== 'selection' ? subject : ''}
          </div>
        </div>
      </div>

      {/* Center: Speech Bubble & Mascot */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'flex-end', 
        paddingBottom: '20px' 
      }}>
        <div className="speech-bubble" style={{ 
          pointerEvents: 'auto', 
          textAlign: 'center', 
          whiteSpace: 'pre-line', 
          marginBottom: '20px', 
          opacity: isTargetFound ? 1 : 0, 
          transition: 'all 0.3s ease' 
        }}>
          {getSpeechText()}
        </div>
        
        {isTargetFound && (
          <img 
            src={getMascotImage()} 
            alt="Mascot" 
            onClick={triggerCompanionReaction}
            style={{ 
              width: '260px', 
              height: 'auto', 
              pointerEvents: 'auto', 
              cursor: 'pointer', 
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
              animation: 'float 4s infinite ease-in-out',
              opacity: isGracePeriod ? 0.6 : 1,
              transition: 'opacity 0.4s ease'
            }} 
          />
        )}
      </div>

      {/* Bottom Panel */}
      <div className="panel" style={{ 
        minHeight: '190px', 
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        padding: '16px'
      }}>
        
        {/* State 1: Subject Selection (Supports Touch Swipe) */}
        {appState === 'selection' && (
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center' }}
          >
            <button className="icon-button" onClick={prevSubject}><ChevronLeft size={44}/></button>
            <div 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} 
              onClick={() => { setSubject(subjects[subjectIndex]); setAppState('ready'); }}
            >
              <Book size={68} color={subjectColors[subjectIndex]} fill={subjectColors[subjectIndex]} style={{ opacity: 0.95 }}/>
              <span style={{ fontWeight: 800, marginTop: '8px', fontSize: '1.2rem', color: '#5C4033' }}>
                {subjects[subjectIndex]}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8B6B52', marginTop: '2px' }}>
                點擊確認 / 左右滑動
              </span>
            </div>
            <button className="icon-button" onClick={nextSubject}><ChevronRight size={44}/></button>
          </div>
        )}

        {/* State 2: Ready State (Includes 15m / 25m / 45m Quick Duration Capsules) */}
        {appState === 'ready' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
            {/* Quick Duration Capsules (Option A) */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[15, 25, 45].map((mins) => {
                const isSelected = workDuration === mins && timeLeft === mins * 60;
                return (
                  <button
                    key={mins}
                    onClick={() => setPresetDuration(mins)}
                    style={{
                      background: isSelected ? '#B88655' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#5C4033',
                      border: '2px solid #5C4033',
                      borderRadius: '999px',
                      padding: '5px 14px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 3px 0 #5C4033' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {mins} 分
                  </button>
                );
              })}
              <button
                onClick={() => setPresetSeconds(5)}
                style={{
                  background: timeLeft === 5 ? '#D97777' : '#FFFFFF',
                  color: timeLeft === 5 ? '#FFFFFF' : '#D97777',
                  border: '2px solid #D97777',
                  borderRadius: '999px',
                  padding: '5px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: timeLeft === 5 ? '0 3px 0 #5C4033' : 'none',
                  transition: 'all 0.15s ease'
                }}
                title="快速測試 5 秒後的震動與提醒"
              >
                ⚡ 5秒測試
              </button>
            </div>

            {/* Library Mode Switch (Option A) */}
            <button
              onClick={() => setIsLibraryMode(!isLibraryMode)}
              style={{
                background: isLibraryMode ? '#E8D5B7' : '#FFFFFF',
                border: '2px solid #5C4033',
                borderRadius: '999px',
                padding: '4px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#5C4033',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: isLibraryMode ? '0 2px 0 #5C4033' : 'none'
              }}
            >
              {isLibraryMode ? '🤫 圖書館靜音震動模式 (ON)' : '🔔 正常響鈴模式'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button className="icon-button" onClick={() => setAppState('selection')} title="重選科目">
                <Undo size={32}/>
              </button>
              <button className="action-button" onClick={toggleTimer} style={{ width: '160px' }}>
                START
              </button>
            </div>
          </div>
        )}

        {/* State 3: Focusing State */}
        {appState === 'focusing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <button className="icon-button" onClick={openExitConfirm} title="放棄專注">
              <Undo size={32}/>
            </button>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, width: '150px', textAlign: 'center', color: '#5C4033' }}>
              {formatTime(timeLeft)}
            </div>
            <button className="icon-button" onClick={toggleTimer} title={isActive ? '暫停' : '繼續'}>
              {isActive ? <Pause size={38} fill="#5C4033"/> : <Play size={38} fill="#5C4033"/>}
            </button>
          </div>
        )}

        {/* State 4: Completed State (Focus done, prompt feed & break) */}
        {appState === 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'column', width: '100%' }}>
            {isAlarmActive ? (
              <button 
                className="action-button" 
                onClick={() => { stopAlarm(); feedCompanion(); }} 
                style={{ 
                  width: '240px', 
                  backgroundColor: '#D97777',
                  animation: 'pulse 1.2s infinite ease-in-out',
                  boxShadow: '0 6px 0 #5C4033',
                  fontSize: '1.05rem',
                  padding: '12px'
                }}
              >
                🔕 關閉提醒並餵食怪獸
              </button>
            ) : (
              <>
                <button 
                  className="action-button" 
                  onClick={feedCompanion} 
                  style={{ width: '220px', backgroundColor: '#D97777', fontSize: '1rem', padding: '9px' }}
                >
                  🍓 餵食草莓慶祝！
                </button>

                {/* Smart Break Duration Capsules (Issue 4 Option A) */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#8B6B52', fontWeight: 700 }}>休息時長：</span>
                  {[5, 10].map((mins) => {
                    const isSelected = breakDuration === mins;
                    return (
                      <button
                        key={mins}
                        onClick={() => setBreakDuration(mins)}
                        style={{
                          background: isSelected ? '#77D988' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#5C4033',
                          border: '2px solid #5C4033',
                          borderRadius: '999px',
                          padding: '3px 12px',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 2px 0 #5C4033' : 'none'
                        }}
                      >
                        {mins} 分
                      </button>
                    );
                  })}
                  {isQuickTest && (
                    <button
                      onClick={() => setBreakDuration(0.083)}
                      style={{
                        background: breakDuration < 1 ? '#D97777' : '#FFFFFF',
                        color: breakDuration < 1 ? '#FFFFFF' : '#D97777',
                        border: '2px solid #D97777',
                        borderRadius: '999px',
                        padding: '3px 10px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ 5秒測試
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', marginTop: '4px' }}>
                  <button 
                    className="action-button" 
                    onClick={() => startBreakSession()} 
                    style={{ flex: 1, maxWidth: '210px', backgroundColor: '#B88655', fontSize: '0.95rem', padding: '10px' }}
                  >
                    ☕ 開始休息 {isQuickTest && breakDuration < 1 ? '5秒' : `${breakDuration}分`} ➔
                  </button>
                  <button 
                    className="action-button" 
                    onClick={skipBreak} 
                    style={{ padding: '10px 14px', backgroundColor: '#D4A373', fontSize: '0.88rem' }}
                  >
                    跳過休息
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* State 5: Feeding State (Physical Strawberries Falling) */}
        {appState === 'feeding' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#8B6B52', fontWeight: 700 }}>休息時長：</span>
              {[5, 10].map((mins) => {
                const isSelected = breakDuration === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => setBreakDuration(mins)}
                    style={{
                      background: isSelected ? '#77D988' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#5C4033',
                      border: '2px solid #5C4033',
                      borderRadius: '999px',
                      padding: '3px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {mins} 分
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
              <button 
                className="action-button" 
                onClick={() => startBreakSession()} 
                style={{ flex: 1, maxWidth: '210px', backgroundColor: '#B88655', fontSize: '0.96rem', padding: '10px' }}
              >
                ☕ 開始休息 {isQuickTest && breakDuration < 1 ? '5秒' : `${breakDuration}分`} ➔
              </button>
              <button 
                className="action-button" 
                onClick={skipBreak} 
                style={{ padding: '10px 14px', background: '#D4A373', fontSize: '0.88rem' }}
              >
                回科目選擇
              </button>
            </div>
          </div>
        )}

        {/* State 6: Breaking State (Issue 3 Option A: Relaxed Rest Countdown) */}
        {appState === 'breaking' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
            <div style={{
              background: '#E8F5E9',
              border: '2px solid #5C4033',
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🍃 休息放鬆中
            </div>
            
            <div style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', color: '#5C4033' }}>
              {formatTime(timeLeft)}
            </div>

            <button 
              className="action-button" 
              onClick={skipBreak} 
              style={{ padding: '8px 20px', fontSize: '0.88rem', background: '#D4A373' }}
            >
              提前結束休息
            </button>
          </div>
        )}

        {/* State 7: Break Completed (Issue 5 Option A: Next Pomodoro Cycle Loop) */}
        {appState === 'break_completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
            {isAlarmActive ? (
              <button 
                className="action-button" 
                onClick={stopAlarm} 
                style={{ 
                  width: '230px', 
                  backgroundColor: '#77D988',
                  animation: 'pulse 1.2s infinite ease-in-out',
                  boxShadow: '0 6px 0 #5C4033',
                  fontSize: '1rem',
                  padding: '11px'
                }}
              >
                🔕 關閉提醒，充電完畢！
              </button>
            ) : (
              <>
                <div style={{
                  background: '#FFF3E0',
                  border: '2px solid #5C4033',
                  borderRadius: '999px',
                  padding: '4px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: '#E65100'
                }}>
                  ✨ 充電完畢！繼續讀【{subject}】
                </div>

                <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                  <button 
                    className="action-button" 
                    onClick={startNextFocusSession} 
                    style={{ flex: 1, maxWidth: '210px', backgroundColor: '#7799D9', fontSize: '0.98rem', padding: '11px' }}
                  >
                    🚀 開始下一輪專注 ➔
                  </button>
                  <button 
                    className="action-button" 
                    onClick={resetTimer} 
                    style={{ padding: '11px 16px', backgroundColor: '#D4A373', fontSize: '0.88rem' }}
                  >
                    更換科目
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Safe Exit Confirmation Modal (Option A) */}
      {isConfirmingExit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 200,
          backgroundColor: 'rgba(92, 64, 51, 0.55)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          pointerEvents: 'auto'
        }}>
          <div className="panel" style={{
            padding: '28px 24px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '3px solid #5C4033',
            boxShadow: '0 8px 0 #5C4033',
            animation: 'pulse 0.25s ease-out'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#5C4033', marginBottom: '10px' }}>
              確定要放棄本次專注嗎？🥺
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#8B6B52', marginBottom: '24px', lineHeight: 1.6, fontWeight: 600 }}>
              小怪獸正在陪你專注讀書呢！現在退出，當前的計時進度將會重置喔。
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="action-button" 
                onClick={closeExitConfirm} 
                style={{ padding: '12px 20px', fontSize: '1rem', background: '#B88655' }}
              >
                繼續專注
              </button>
              <button 
                className="action-button" 
                onClick={confirmExitToMenu} 
                style={{ padding: '12px 20px', fontSize: '1rem', background: '#D97777' }}
              >
                放棄回首頁
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

