import React from 'react';
import { TimerProvider, useTimer } from './context/TimerContext';
import { ARSceneAFrame } from './components/ARSceneAFrame';
import { OverlayUI } from './components/OverlayUI';
import { AntiGravityCanvas } from './components/AntiGravityCanvas';
import { Camera, BookOpen, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { modeType, setModeType, isDistracted, appState } = useTimer();

  // Mode Selection Menu Screen (Option A: Storybook Warm Theme)
  if (modeType === 'menu') {
    return (
      <div style={{
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        overflowY: 'auto',
      }}>
        <div style={{
          maxWidth: '380px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* Header Avatar & Title */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <img 
              src="/IMG_6054.PNG" 
              alt="Mascot Icon" 
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3px solid #5C4033',
                padding: '6px',
                boxShadow: '0 6px 0 #5C4033',
                animation: 'float 3.5s infinite ease-in-out'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: '#B88655',
              color: '#FFFFFF',
              borderRadius: '50%',
              padding: '6px',
              border: '2px solid #5C4033',
              display: 'flex'
            }}>
              <Sparkles size={16} />
            </span>
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#5C4033',
            marginBottom: '6px',
            letterSpacing: '1px'
          }}>
            專注怪獸伴讀鐘 👾
          </h1>
          <p style={{
            fontSize: '0.95rem',
            color: '#8B6B52',
            marginBottom: '28px',
            fontWeight: 600
          }}>
            挑選今天陪伴你的專注方式吧！
          </p>

          {/* Dual Mode Cards (Option A) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
            
            {/* Card 1: Mode 1 (AR Companion Mode) */}
            <div 
              onClick={() => setModeType('ar')}
              style={{
                background: 'var(--bg-panel)',
                border: '3px solid #5C4033',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 6px 0 #5C4033',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              className="mode-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: '#B88655',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    border: '2px solid #5C4033'
                  }}>
                    <Camera size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#5C4033' }}>
                    模式一：AR 伴讀模式
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#5C4033', lineHeight: 1.5, marginBottom: '14px', fontWeight: 600 }}>
                掃描實體卡片召喚怪獸監督！翻頁手晃自帶 15 秒寬限緩衝防閃退。
              </p>
              <button 
                className="action-button" 
                style={{ width: '100%', padding: '10px', fontSize: '1.05rem', background: '#B88655' }}
              >
                開啟 AR 伴讀 ➔
              </button>
            </div>

            {/* Card 2: Mode 2 (Pure Desk Mode) */}
            <div 
              onClick={() => setModeType('pure')}
              style={{
                background: '#FFFFFF',
                border: '3px solid #5C4033',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 6px 0 #5C4033',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              className="mode-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: '#7799D9',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    border: '2px solid #5C4033'
                  }}>
                    <BookOpen size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#5C4033' }}>
                    模式二：桌面純淨專注
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#5C4033', lineHeight: 1.5, marginBottom: '14px', fontWeight: 600 }}>
                不開鏡頭、零發熱超省電！怪獸直接在螢幕常亮待機，適合圖書館自習。
              </p>
              <button 
                className="action-button" 
                style={{ width: '100%', padding: '10px', fontSize: '1.05rem', background: '#7799D9' }}
              >
                開啟桌面專注 ➔
              </button>
            </div>

          </div>

          {/* Bottom Reminder */}
          <p style={{ marginTop: '24px', fontSize: '0.8rem', color: '#8B6B52', fontWeight: 600 }}>
            💡 提示：專注中若滑開 App 去回訊息，怪獸會生氣把介面散架喔！
          </p>
        </div>
      </div>
    );
  }

  // Active Session View (Mode 1: AR or Mode 2: Pure)
  return (
    <div style={{ 
      width: '100%', 
      height: '100dvh', 
      overflow: 'hidden', 
      position: 'relative',
      backgroundColor: 'var(--bg-main)'
    }}>
      {/* If in AR mode, render A-Frame camera background */}
      {modeType === 'ar' && <ARSceneAFrame />}

      {/* Main Overlay UI Layer (Works identically across both modes) */}
      <OverlayUI />

      {/* Anti-gravity Physics Canvas: Triggered on Distraction Violation */}
      {isDistracted && <AntiGravityCanvas scenario="distracted" />}

      {/* Anti-gravity Physics Canvas: Triggered on Feeding / Break Relaxation */}
      {appState === 'feeding' && <AntiGravityCanvas scenario="reward" />}
    </div>
  );
};

function App() {
  return (
    <TimerProvider>
      <MainContent />
    </TimerProvider>
  );
}

export default App;

