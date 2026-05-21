import { useState } from 'react';
import { TimerProvider } from './context/TimerContext';
import { ARSceneAFrame } from './components/ARSceneAFrame';
import { OverlayUI } from './components/OverlayUI';

function App() {
  const [arStarted, setArStarted] = useState(false);

  return (
    <TimerProvider>
      <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        
        {!arStarted ? (
          <div className="ui-layer" style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-dark)' }}>
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--primary)' }}>AR Study Buddy</h1>
              <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
                Point your camera at the QR code marker to summon your study companion.
              </p>
              <button 
                className="glass-button primary" 
                style={{ width: '100%', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '12px' }}
                onClick={() => setArStarted(true)}
              >
                Start AR Camera
              </button>
            </div>
          </div>
        ) : (
          <>
            <ARSceneAFrame />
            <OverlayUI />
          </>
        )}
      </div>
    </TimerProvider>
  );
}

export default App;
