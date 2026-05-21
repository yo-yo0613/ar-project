import React, { useEffect, useRef, useState } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import { createRoot, events } from '@react-three/fiber';
import { CompanionCharacter } from './CompanionCharacter';

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
        await mindar.start();
        
        // Setup R3F Root inside MindAR's scene
        const root = createRoot(containerRef.current!);
        root.configure({
          camera: camera,
          scene: scene,
          gl: renderer,
          events,
          size: { width: window.innerWidth, height: window.innerHeight, top: 0, left: 0 }
        });

        const anchor = mindar.addAnchor(0); // Anchor 0 is the first marker in targets.mind
        
        // We render our R3F component tree attached to the anchor
        root.render(
          <primitive object={anchor.group}>
            <CompanionCharacter />
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 10]} intensity={2} />
          </primitive>
        );

        // Custom render loop
        renderer.setAnimationLoop(() => {
          mindar.update(); // Update AR tracking
          renderer.render(scene, camera);
        });

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
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1 }} 
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
