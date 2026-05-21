// @ts-nocheck
import React, { useMemo } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import { useTimer } from '../context/TimerContext';

export const ARSceneAFrame: React.FC = () => {
  const { companionState, triggerCompanionReaction } = useTimer();

  const activeTexturePath = useMemo(() => {
    if (companionState === 'happy') return '/companion_happy.png';
    if (companionState === 'focus') return '/companion_focus.png';
    return '/companion_idle.png';
  }, [companionState]);

  return (
    <div className="ar-container" onClick={triggerCompanionReaction}>
      <a-scene 
        mindar-image="imageTargetSrc: /targets.mind; uiScanning: no; uiLoading: yes;" 
        color-space="sRGB" 
        renderer="colorManagement: true, physicallyCorrectLights" 
        vr-mode-ui="enabled: false" 
        device-orientation-permission-ui="enabled: false"
      >
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        
        <a-entity mindar-image-target="targetIndex: 0">
          <a-plane 
            src={activeTexturePath} 
            position="0 0 0" 
            height="1" 
            width="1" 
            rotation="0 0 0"
            material="transparent: true;"
          ></a-plane>
        </a-entity>
      </a-scene>
    </div>
  );
};
