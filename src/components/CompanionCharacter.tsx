import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useTimer } from '../context/TimerContext';

export const CompanionCharacter: React.FC = () => {
  const { companionState, triggerCompanionReaction } = useTimer();
  const meshRef = useRef<THREE.Mesh>(null);

  // Load textures for the 2D sprite states
  const [idleTex, happyTex, focusTex] = useLoader(THREE.TextureLoader, [
    '/companion_idle.png',
    '/companion_happy.png',
    '/companion_focus.png'
  ]);

  // Determine active texture
  const activeTexture = useMemo(() => {
    if (companionState === 'happy') return happyTex;
    if (companionState === 'focus') return focusTex;
    return idleTex;
  }, [companionState, idleTex, happyTex, focusTex]);

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      // Float up and down
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.1;
      
      // Look at camera
      // meshRef.current.lookAt(state.camera.position); 
      // For AR tracking, usually the plane sits on the marker, so looking at camera is good for billboarding!
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={[0, 0.1, 0]} 
      scale={[1, 1, 1]}
      onClick={triggerCompanionReaction}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={activeTexture} 
        transparent={true} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
