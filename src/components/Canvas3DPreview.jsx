import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, OrbitControls } from '@react-three/drei';

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 15]} />
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.1;
    }
  });

  const particlePositions = Array.from({ length: 40 }, () => [
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8
  ]);

  return (
    <group ref={groupRef}>
      {particlePositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={idx % 2 === 0 ? "#a855f7" : "#06b6d4"} />
        </mesh>
      ))}
    </group>
  );
}

export default function Canvas3DPreview() {
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/80">
      
      {/* Three.js Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} className="w-full h-full">
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#c084fc" />
        
        <AnimatedSphere />
        <FloatingParticles />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>

      {/* Glassmorphism Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
      
      {/* Floating Feature Badges */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-lg flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          ✦ Jaccard Match Algorithm
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-purple-500/30 text-xs font-semibold text-purple-300 shadow-lg flex items-center gap-1.5">
          ⚡ Escrow Credit Engine
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-lg flex items-center gap-1.5">
          🔒 Universal Unique Student IDs
        </div>
      </div>

    </div>
  );
}
