import React, { useEffect, useRef, useState } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { createRoot, events, useFrame } from '@react-three/fiber';
import { CompanionCharacter } from './CompanionCharacter';

import { createPortal } from '@react-three/fiber';

// Update AR tracking within R3F's own loop
const MindARUpdater: React.FC<{ mindar: any }> = ({ mindar }) => {
  useFrame(() => {
    if (mindar) {
      mindar.update(); 
    }
  });
  return null;
};

// Wrapper component to bridge MindAR and R3F
const MindARScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mindarThree, setMindarThree] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize MindAR
    const mindar = new MindARThree({
      container: containerRef.current,
      imageTargetSrc: '/targets.mind',
      uiScanning: "no",
      uiLoading: "yes"
    });

    setMindarThree(mindar);
    const { renderer, scene, camera } = mindar;

    // Start MindAR
    const startAR = async () => {
      try {
        const anchor = mindar.addAnchor(0); // Anchor MUST be added before start()
        await mindar.start();
        
        // Force MindAR to recalculate video layout
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
        
        // Prevent R3F from overwriting MindAR's camera projection matrix
        (camera as any).manual = true;
        
        // Setup R3F Root inside MindAR's scene
        const root = createRoot(containerRef.current!);
        root.configure({
          camera: camera,
          scene: scene,
          gl: renderer,
          events,
          size: { width: window.innerWidth, height: window.innerHeight, top: 0, left: 0 }
        });
        
        // Render our React Tree
        // R3F will automatically start its own animation loop.
        root.render(
          <>
            <MindARUpdater mindar={mindar} />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
            {createPortal(
              <React.Suspense fallback={null}>
                <CompanionCharacter />
              </React.Suspense>,
              anchor.group
            )}
          </>
        );

      } catch (err) {
        console.error("Error starting MindAR", err);
      }
    };

    startAR();

    return () => {
      if (mindarThree) {
        mindarThree.stop();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, overflow: 'hidden' }} 
    />
  );
};

export const ARScene: React.FC = () => {
  return (
    <div className="ar-container">
      <MindARScene />
    </div>
  );
};
