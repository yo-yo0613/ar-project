import React, { useEffect, useRef, useState } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { createRoot, events, useFrame } from '@react-three/fiber';
import { CompanionCharacter } from './CompanionCharacter';

// R3F Component to sync with MindAR anchor
const ARAnchorSync: React.FC<{ anchorGroup: import('three').Group, mindar: any }> = ({ anchorGroup, mindar }) => {
  const groupRef = useRef<import('three').Group>(null);
  
  useFrame(() => {
    if (mindar) {
      mindar.update(); // Update AR tracking within R3F's own loop!
    }
    if (groupRef.current && anchorGroup) {
      // Sync visibility and matrix from MindAR's anchor to our R3F group
      groupRef.current.matrix.copy(anchorGroup.matrix);
      groupRef.current.visible = anchorGroup.visible;
    }
  });

  return (
    <group ref={groupRef} matrixAutoUpdate={false}>
      <React.Suspense fallback={null}>
        <CompanionCharacter />
      </React.Suspense>
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
    </group>
  );
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
        root.render(<ARAnchorSync anchorGroup={anchor.group} mindar={mindar} />);

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
