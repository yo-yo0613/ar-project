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
        padding: '16px 16px env(safe-area-inset-bottom, 16px) 16px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        <div style={{
          maxWidth: '360px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* Header Avatar & Title */}
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <img 
              src="/IMG_6054.PNG" 
              alt="Mascot Icon" 
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '3px solid #5C4033',
                padding: '4px',
                boxShadow: '0 4px 0 #5C4033',
                animation: 'float 3.5s infinite ease-in-out'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: '#B88655',
              color: '#FFFFFF',
              borderRadius: '50%',
              padding: '4px',
              border: '2px solid #5C4033',
              display: 'flex'
            }}>
              <Sparkles size={13} />
            </span>
          </div>

          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#5C4033',
            marginBottom: '4px',
            letterSpacing: '0.5px'
          }}>
            專注怪獸伴讀鐘 👾
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#8B6B52',
            marginBottom: '14px',
            fontWeight: 600
          }}>
            挑選今天陪伴你的專注方式吧！
          </p>

          {/* Dual Mode Cards (Compact and single-line titles) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            
            {/* Card 1: Mode 1 (AR Companion Mode) */}
            <div 
              onClick={() => setModeType('ar')}
              style={{
                background: 'var(--bg-panel)',
                border: '3px solid #5C4033',
                borderRadius: '20px',
                padding: '14px 16px',
                boxShadow: '0 4px 0 #5C4033',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              className="mode-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  background: '#B88655',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '6px',
                  display: 'flex',
                  border: '2px solid #5C4033',
                  flexShrink: 0
                }}>
                  <Camera size={20} />
                </div>
                <h3 style={{ 
                  fontSize: '1.12rem', 
                  fontWeight: 800, 
                  color: '#5C4033',
                  whiteSpace: 'nowrap',
                  margin: 0
                }}>
                  模式一：AR 伴讀模式
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#5C4033', lineHeight: 1.4, marginBottom: '10px', fontWeight: 600 }}>
                掃描實體卡片召喚怪獸監督！翻頁手晃自帶 15 秒寬限緩衝防閃退。
              </p>
              <button 
                className="action-button" 
                style={{ width: '100%', padding: '9px', fontSize: '0.98rem', background: '#B88655', borderRadius: '999px' }}
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
                borderRadius: '20px',
                padding: '14px 16px',
                boxShadow: '0 4px 0 #5C4033',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              className="mode-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  background: '#7799D9',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '6px',
                  display: 'flex',
                  border: '2px solid #5C4033',
                  flexShrink: 0
                }}>
                  <BookOpen size={20} />
                </div>
                <h3 style={{ 
                  fontSize: '1.12rem', 
                  fontWeight: 800, 
                  color: '#5C4033',
                  whiteSpace: 'nowrap',
                  margin: 0
                }}>
                  模式二：桌面純淨模式
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#5C4033', lineHeight: 1.4, marginBottom: '10px', fontWeight: 600 }}>
                不開鏡頭、零發熱超省電！怪獸直接在螢幕常亮待機，適合圖書館自習。
              </p>
              <button 
                className="action-button" 
                style={{ width: '100%', padding: '9px', fontSize: '0.98rem', background: '#7799D9', borderRadius: '999px' }}
              >
                開啟桌面專注 ➔
              </button>
            </div>

          </div>

          {/* Bottom Reminder */}
          <p style={{ marginTop: '14px', fontSize: '0.78rem', color: '#8B6B52', fontWeight: 600, margin: '14px 0 0 0' }}>
            💡 提示：專注中若滑開 App 回訊息，怪獸會生氣把介面散架喔！
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

