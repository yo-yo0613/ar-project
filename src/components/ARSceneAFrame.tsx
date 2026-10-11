// @ts-nocheck
import React, { useMemo, useEffect, useRef } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import '../aframe-components'; // Import our custom dynamic-sprite component
import { useTimer } from '../context/TimerContext';

export const ARSceneAFrame: React.FC = () => {
  const { companionState, triggerCompanionReaction, setIsTargetFound } = useTimer();
  const targetRef = useRef<any>(null);

  useEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement) return;

    const onTargetFound = () => {
      console.log('Target found!');
      setIsTargetFound(true);
    };

    const onTargetLost = () => {
      console.log('Target lost!');
      setIsTargetFound(false);
    };

    targetElement.addEventListener('targetFound', onTargetFound);
    targetElement.addEventListener('targetLost', onTargetLost);

    return () => {
      targetElement.removeEventListener('targetFound', onTargetFound);
      targetElement.removeEventListener('targetLost', onTargetLost);
    };
  }, [setIsTargetFound]);

  const activeTexturePath = useMemo(() => {
    if (companionState === 'happy') return '/IMG_6057.PNG';
    if (companionState === 'sad') return '/IMG_6055.PNG';
    if (companionState === 'angry') return '/IMG_6056.PNG';
    return '/IMG_6054.PNG'; // idle
  }, [companionState]);

  return (
    <div className="ar-container" onClick={triggerCompanionReaction}>
      <a-scene 
        mindar-image="imageTargetSrc: /targets.mind; uiScanning: no; uiLoading: no;" 
        color-space="sRGB" 
        renderer="colorManagement: true, physicallyCorrectLights" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        
        <a-entity ref={targetRef} mindar-image-target="targetIndex: 0">
        </a-entity>
      </a-scene>
    </div>
  );
};
