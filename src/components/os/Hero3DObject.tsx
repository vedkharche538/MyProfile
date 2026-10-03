"use client";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  Hero3DObject — Draggable 3D wireframe shape (R3F + Three.js)      ║
 * ║                                                                    ║
 * ║  An abstract icosahedron with edges glowing neon, surrounded by    ║
 *  an orbiting ring of particles. Drag to rotate. Auto-rotates when      ║
 *  not being dragged.                                                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Icosahedron, Edges, Float } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function NeonCore() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !meshRef.current.userData.dragging) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group>
      <Icosahedron ref={meshRef as any} args={[1.4, 1]}>
        {/* Transparent dark material */}
        <meshBasicMaterial
          color="#0A0A0F"
          transparent
          opacity={0.4}
          wireframe={false}
        />
        {/* Glowing edges */}
        <Edges threshold={15} color="#00FFE1" />
      </Icosahedron>

      {/* Inner glowing sphere */}
      <Icosahedron args={[0.7, 0]}>
        <meshBasicMaterial color="#FF006E" wireframe />
      </Icosahedron>

      {/* Outer wireframe shell */}
      <Icosahedron args={[2.0, 0]}>
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.3} />
      </Icosahedron>
    </group>
  );
}

function OrbitingParticles({ count = 24 }: { count?: number }) {
  const groupRef = useRef<THREE.Group | null>(null);

  const positions = useMemo(() => {
    return Array.from({ length: count }, () => {
      const radius = 2.5 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        color: ["#00FFE1", "#FF006E", "#8B5CF6", "#B6FF00"][Math.floor(Math.random() * 4)],
        size: Math.random() * 0.05 + 0.03,
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00FFE1" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#FF006E" />

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <NeonCore />
      </Float>

      <OrbitingParticles count={28} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        rotateSpeed={0.6}
        makeDefault
      />
    </>
  );
}

export function Hero3DObject({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      data-cursor="drag"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
