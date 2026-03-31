"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Helpers ──────────────────────────────────────────────────

function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Indian Cities (destinations) ─────────────────────────────

const indianCities = [
  { name: "Mumbai", lat: 19.07, lon: 72.87 },
  { name: "Delhi", lat: 28.61, lon: 77.2 },
  { name: "Bangalore", lat: 12.97, lon: 77.59 },
  { name: "Chennai", lat: 13.08, lon: 80.27 },
  { name: "Hyderabad", lat: 17.38, lon: 78.47 },
  { name: "Kolkata", lat: 22.57, lon: 88.36 },
  { name: "Pune", lat: 18.52, lon: 73.85 },
  { name: "Ahmedabad", lat: 23.02, lon: 72.57 },
];

// ─── Global Source Cities ─────────────────────────────────────

const globalCities = [
  { name: "San Francisco", lat: 37.77, lon: -122.42 },
  { name: "New York", lat: 40.71, lon: -74.01 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "Singapore", lat: 1.35, lon: 103.82 },
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "Frankfurt", lat: 50.11, lon: 8.68 },
  { name: "Hong Kong", lat: 22.32, lon: 114.17 },
];

// ─── Globe Core ───────────────────────────────────────────────

function GlobeCore() {
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
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[1.6, 32, 32]}>
        <meshBasicMaterial
          color="#F7931A"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Main globe */}
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#111111"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Wireframe */}
      <Sphere ref={wireRef} args={[1.52, 32, 32]}>
        <meshBasicMaterial
          color="#F7931A"
          wireframe
          transparent
          opacity={0.06}
        />
      </Sphere>
    </group>
  );
}

// ─── City Marker with Pulse ───────────────────────────────────

function CityMarker({
  position,
  isIndian,
  pulseIntensity,
}: {
  position: THREE.Vector3;
  isIndian: boolean;
  pulseIntensity: number;
}) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      // Pulse decays over time, pulseIntensity is fed from parent
      mat.opacity = isIndian
        ? 0.15 + pulseIntensity * 0.6
        : 0.1 + pulseIntensity * 0.3;
      const s = 1 + pulseIntensity * 2;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Core dot */}
      <mesh position={position}>
        <sphereGeometry args={[isIndian ? 0.03 : 0.018, 12, 12]} />
        <meshBasicMaterial
          color={isIndian ? "#F7931A" : "#F7931A"}
          transparent
          opacity={isIndian ? 0.9 : 0.5}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[isIndian ? 0.06 : 0.035, 12, 12]} />
        <meshBasicMaterial color="#F7931A" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ─── Animated Transaction Arc ─────────────────────────────────

interface TransactionArc {
  id: number;
  sourceIdx: number;
  destIdx: number;
  progress: number; // 0 to 1
  speed: number;
  active: boolean;
}

function TravelingDot({
  curve,
  progress,
}: {
  curve: THREE.QuadraticBezierCurve3;
  progress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const pos = curve.getPoint(progress);
      meshRef.current.position.copy(pos);

      // Size pulses as it travels — bigger in the middle
      const sizeFactor = Math.sin(progress * Math.PI);
      meshRef.current.scale.setScalar(0.6 + sizeFactor * 0.8);
    }

    // Trail dot slightly behind
    if (trailRef.current) {
      const trailProgress = Math.max(0, progress - 0.06);
      const pos = curve.getPoint(trailProgress);
      trailRef.current.position.copy(pos);
      trailRef.current.scale.setScalar(0.3 + Math.sin(progress * Math.PI) * 0.4);
    }
  });

  return (
    <group>
      {/* Main traveling dot */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#FFD54F" transparent opacity={0.95} />
      </mesh>

      {/* Trail dot */}
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.02, 6, 6]} />
        <meshBasicMaterial color="#F7931A" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function ArcPath({
  curve,
  progress,
}: {
  curve: THREE.QuadraticBezierCurve3;
  progress: number;
}) {
  const lineRef = useRef<THREE.Line>(null);

  // Show the arc line only up to the current progress (trail effect)
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry();
  }, []);

  useFrame(() => {
    if (lineRef.current) {
      const numPoints = Math.max(2, Math.floor(progress * 40));
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= numPoints; i++) {
        pts.push(curve.getPoint((i / 40) * (progress > 0 ? 1 : 0)));
      }
      // Only draw up to progress
      const drawnPts: THREE.Vector3[] = [];
      for (let i = 0; i <= Math.floor(progress * 40); i++) {
        drawnPts.push(curve.getPoint(i / 40));
      }
      if (drawnPts.length >= 2) {
        lineRef.current.geometry.setFromPoints(drawnPts);
      }

      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + (1 - progress) * 0.2;
    }
  });

  return (
    <primitive
      ref={lineRef}
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: "#F7931A",
            transparent: true,
            opacity: 0.25,
          })
        )
      }
    />
  );
}

// ─── Transaction Manager ──────────────────────────────────────

function LiveTransactions({
  onArrival,
}: {
  onArrival: (destIdx: number) => void;
}) {
  const [transactions, setTransactions] = useState<TransactionArc[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  // Pre-compute curves for all source→dest pairs
  const curves = useMemo(() => {
    const result: THREE.QuadraticBezierCurve3[][] = [];
    for (let s = 0; s < globalCities.length; s++) {
      result[s] = [];
      for (let d = 0; d < indianCities.length; d++) {
        const start = latLonToVec3(
          globalCities[s].lat,
          globalCities[s].lon,
          1.52
        );
        const end = latLonToVec3(
          indianCities[d].lat,
          indianCities[d].lon,
          1.52
        );
        const mid = new THREE.Vector3()
          .addVectors(start, end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.0 + Math.random() * 0.3);
        result[s][d] = new THREE.QuadraticBezierCurve3(start, mid, end);
      }
    }
    return result;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Spawn new transactions at random intervals (every 0.8-2.5s)
    if (t - lastSpawn.current > 0.8 + Math.random() * 1.7) {
      lastSpawn.current = t;
      const sourceIdx = Math.floor(Math.random() * globalCities.length);
      const destIdx = Math.floor(Math.random() * indianCities.length);

      setTransactions((prev) => {
        // Limit concurrent transactions
        const active = prev.filter((tx) => tx.active);
        if (active.length >= 5) return prev;

        return [
          ...prev.filter((tx) => tx.active),
          {
            id: nextId.current++,
            sourceIdx,
            destIdx,
            progress: 0,
            speed: 0.25 + Math.random() * 0.2, // 0.25-0.45 = ~2-4 second travel
            active: true,
          },
        ];
      });
    }

    // Update all active transactions
    setTransactions((prev) =>
      prev.map((tx) => {
        if (!tx.active) return tx;
        const newProgress = tx.progress + tx.speed * (1 / 60);
        if (newProgress >= 1) {
          // Transaction arrived — trigger pulse
          onArrival(tx.destIdx);
          return { ...tx, progress: 1, active: false };
        }
        return { ...tx, progress: newProgress };
      })
    );
  });

  return (
    <group>
      {transactions
        .filter((tx) => tx.active)
        .map((tx) => (
          <group key={tx.id}>
            <ArcPath
              curve={curves[tx.sourceIdx][tx.destIdx]}
              progress={tx.progress}
            />
            <TravelingDot
              curve={curves[tx.sourceIdx][tx.destIdx]}
              progress={tx.progress}
            />
          </group>
        ))}
    </group>
  );
}

// ─── Static Base Arcs (subtle background connections) ─────────

function BaseArcs() {
  const arcs = useMemo(() => {
    // Show faint arcs from a few key cities to India center
    const india = latLonToVec3(20, 77, 1.52);
    return [
      { start: latLonToVec3(37.77, -122.42, 1.52), end: india },
      { start: latLonToVec3(51.51, -0.13, 1.52), end: india },
      { start: latLonToVec3(25.2, 55.27, 1.52), end: india },
      { start: latLonToVec3(1.35, 103.82, 1.52), end: india },
    ].map(({ start, end }) => {
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(2.1);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(40);
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, []);

  return (
    <group>
      {arcs.map((geo, i) => (
        <primitive
          key={i}
          object={
            new THREE.Line(
              geo,
              new THREE.LineBasicMaterial({
                color: "#F7931A",
                transparent: true,
                opacity: 0.06,
              })
            )
          }
        />
      ))}
    </group>
  );
}

// ─── Star Field ───────────────────────────────────────────────

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

// ─── Scene Orchestrator ───────────────────────────────────────

function GlobeScene() {
  // Track pulse intensity per Indian city (decays over time)
  const [pulses, setPulses] = useState<number[]>(
    new Array(indianCities.length).fill(0)
  );
  const pulsesRef = useRef(pulses);
  pulsesRef.current = pulses;

  // Decay pulses each frame
  useFrame(() => {
    setPulses((prev) => {
      let changed = false;
      const next = prev.map((p) => {
        if (p > 0.01) {
          changed = true;
          return p * 0.95; // Exponential decay
        }
        return 0;
      });
      return changed ? next : prev;
    });
  });

  const handleArrival = useCallback((destIdx: number) => {
    setPulses((prev) => {
      const next = [...prev];
      next[destIdx] = 1; // Full pulse on arrival
      return next;
    });
  }, []);

  // Precompute city positions
  const indianPositions = useMemo(
    () =>
      indianCities.map((c) => latLonToVec3(c.lat, c.lon, 1.52)),
    []
  );

  const globalPositions = useMemo(
    () =>
      globalCities.map((c) => latLonToVec3(c.lat, c.lon, 1.52)),
    []
  );

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]} intensity={0.8} color="#F7931A" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#3B82F6" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        rotateSpeed={0.4}
      />

      <StarField />
      <GlobeCore />
      <BaseArcs />

      {/* Indian city markers */}
      {indianPositions.map((pos, i) => (
        <CityMarker
          key={`in-${i}`}
          position={pos}
          isIndian={true}
          pulseIntensity={pulsesRef.current[i] || 0}
        />
      ))}

      {/* Global city markers */}
      {globalPositions.map((pos, i) => (
        <CityMarker
          key={`gl-${i}`}
          position={pos}
          isIndian={false}
          pulseIntensity={0}
        />
      ))}

      {/* Live transaction arcs */}
      <LiveTransactions onArrival={handleArrival} />
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────

export default function BitcoinGlobe() {
  return (
    <div className="w-[260px] h-[260px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
