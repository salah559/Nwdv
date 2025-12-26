import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows, Stars } from "@react-three/drei";
import { Model } from "./Model";

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2.5, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Model position={[0, -2, 0]} />
          <Environment preset="city" />
          <ContactShadows position={[0, -2.8, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </Suspense>
        
        <Stars radius={100} depth={50} count={7000} factor={6} saturation={0.5} fade speed={2} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}