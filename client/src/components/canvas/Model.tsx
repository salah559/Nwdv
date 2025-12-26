import React, { useRef } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function Model(props: any) {
  const { scene } = useGLTF("/webdev.glb");
  const modelRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!modelRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Mouse interaction - rotation based on mouse position
    targetRotation.current.x = mouse.y * 0.3;
    targetRotation.current.y = mouse.x * 0.3;
    
    // Smooth easing to target rotation
    modelRef.current.rotation.x += (targetRotation.current.x - modelRef.current.rotation.x) * 0.1;
    modelRef.current.rotation.y += (targetRotation.current.y - modelRef.current.rotation.y) * 0.1;
    
    // Add subtle auto-rotation when not being dragged
    modelRef.current.rotation.y += 0.002;
    
    // Wave-like bobbing motion
    modelRef.current.position.y = Math.sin(t * 0.5) * 0.15;
    
    // Gentle pulsing scale
    const scale = 0.7 + Math.sin(t * 0.8) * 0.05;
    modelRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.15}
      floatingRange={[-0.05, 0.05]}
    >
      <primitive 
        object={scene} 
        ref={modelRef} 
        {...props} 
        scale={0.25}
      />
    </Float>
  );
}

useGLTF.preload("/webdev.glb");