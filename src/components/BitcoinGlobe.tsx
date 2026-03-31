"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function GlobeCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (wireRef.current) {
      wireRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
    }
    if (glowRef.current) {
      const scale = 1.02 + Math.sin(t * 0.5) * 0.01;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Inner glow sphere */}
      <Sphere ref={glowRef} args={[1.6, 32, 32]}>
        <meshBasicMaterial
          color="#F7931A"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main globe - dark with subtle surface */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#111111"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere ref={wireRef} args={[1.52, 32, 32]}>
        <meshBasicMaterial
          color="#F7931A"
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>
    </group>
  );
}

function ConnectionArcs() {
  const groupRef = useRef<THREE.Group>(null);

  // India (lat 20, lon 77) as the center point
  const indiaPos = useMemo(() => latLonToVec3(20, 77, 1.52), []);

  // Connection points - major remittance corridors
  const connections = useMemo(
    () => [
      { lat: 37, lon: -122, label: "US West" },  // San Francisco
      { lat: 40, lon: -74, label: "US East" },    // New York
      { lat: 51, lon: 0, label: "London" },        // London
      { lat: 25, lon: 55, label: "Dubai" },        // Dubai
      { lat: 1, lon: 103, label: "Singapore" },    // Singapore
      { lat: 35, lon: 139, label: "Tokyo" },       // Tokyo
      { lat: -33, lon: 151, label: "Sydney" },     // Sydney
    ],
    []
  );

  useFrame(() => {
    // Rotation handled by OrbitControls autoRotate
  });

  return (
    <group ref={groupRef}>
      {/* India marker - glowing point */}
      <mesh position={indiaPos}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#F7931A" />
      </mesh>

      {/* India glow */}
      <mesh position={indiaPos}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#F7931A" transparent opacity={0.3} />
      </mesh>

      {/* Connection points and arcs */}
      {connections.map((conn, i) => {
        const pos = latLonToVec3(conn.lat, conn.lon, 1.52);
        return (
          <group key={i}>
            <mesh position={pos}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#F7931A" transparent opacity={0.6} />
            </mesh>
            <ArcLine start={indiaPos} end={pos} index={i} />
          </group>
        );
      })}
    </group>
  );
}

function ArcLine({
  start,
  end,
  index,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  index: number;
}) {
  const ref = useRef<THREE.Line | null>(null);

  const curve = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.2 + index * 0.05);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end, index]);

  const points = useMemo(() => curve.getPoints(40), [curve]);
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.getElapsedTime() * 0.8 + index) * 0.1;
    }
  });

  return (
    <primitive
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#F7931A", transparent: true, opacity: 0.2 }))}
      ref={ref}
    />
  );
}

function StarField() {
  const points = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  return (
    <Points positions={points} stride={3}>
      <PointMaterial
        color="#F7931A"
        size={0.015}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </Points>
  );
}

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function BitcoinGlobe() {
  return (
    <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 3, 5]} intensity={0.8} color="#F7931A" />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#3B82F6" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          rotateSpeed={0.4}
        />

        <StarField />
        <GlobeCore />
        <ConnectionArcs />
      </Canvas>
    </div>
  );
}
