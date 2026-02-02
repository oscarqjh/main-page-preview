"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Colors from requirements
const BG_COLOR = "#0369a1";
const FG_COLOR = "#fed7aa";

interface AnimatedCircuitProps {
  seed?: string;
  className?: string;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function CircuitScene({ seedValue }: { seedValue: number }) {
  const { viewport } = useThree();
  const count = 40;
  const connectionDistance = Math.min(viewport.width, viewport.height) * 0.25; // Adaptive distance
  
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    const gridCols = 8;
    const gridRows = 5;
    
    // Adaptive size based on viewport
    // Ensure it fills the space but keeps padding
    const width = viewport.width * 0.9;
    const height = viewport.height * 0.9;
    
    const slots = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        slots.push({
          x: (c / gridCols - 0.5) * width,
          y: (r / gridRows - 0.5) * height,
          baseX: (c / gridCols - 0.5) * width,
          baseY: (r / gridRows - 0.5) * height
        });
      }
    }
    
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seedValue + i * 123) * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    
    for (let i = 0; i < Math.min(count, slots.length); i++) {
      const slot = slots[i];
      const jitterX = (seededRandom(seedValue + i * 777) - 0.5) * 2;
      const jitterY = (seededRandom(seedValue + i * 888) - 0.5) * 2;
      
      temp.push({
        position: new THREE.Vector3(slot.x + jitterX, slot.y + jitterY, 0),
        basePosition: new THREE.Vector3(slot.baseX, slot.baseY, 0),
        velocity: new THREE.Vector3(
          (seededRandom(seedValue + i * 111) - 0.5) * 0.01,
          (seededRandom(seedValue + i * 222) - 0.5) * 0.01,
          0
        ),
        offset: seededRandom(seedValue + i * 333) * Math.PI * 2,
        speed: 0.2 + seededRandom(seedValue + i * 444) * 0.5
      });
    }
    return temp;
  }, [seedValue, viewport.width, viewport.height]);

  const maxConnections = count * 8; 
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxConnections * 2 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [maxConnections]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return;

    const time = state.clock.getElapsedTime();
    let lineIndex = 0;
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;

    particles.forEach((particle, i) => {
      const floatRange = 1.0;
      const x = particle.basePosition.x + Math.sin(time * particle.speed + particle.offset) * floatRange;
      const y = particle.basePosition.y + Math.cos(time * particle.speed * 0.7 + particle.offset + 2) * floatRange;
      
      particle.position.set(x, y, 0);

      dummy.position.copy(particle.position);
      const scale = 0.6 + Math.sin(time + particle.offset) * 0.2; 
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position);
        
        if (dist < connectionDistance) {
          if (lineIndex < maxConnections * 2 * 3) {
            const p1 = particles[i].position;
            const p2 = particles[j].position;
            
            linePositions[lineIndex++] = p1.x;
            linePositions[lineIndex++] = p1.y;
            linePositions[lineIndex++] = p1.z;
            
            linePositions[lineIndex++] = p2.x;
            linePositions[lineIndex++] = p2.y;
            linePositions[lineIndex++] = p2.z;
          }
        }
      }
    }

    for (let k = lineIndex; k < linePositions.length; k++) {
      linePositions[k] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
  });

  return (
    <>
      <color attach="background" args={[BG_COLOR]} />
      
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color={FG_COLOR} />
      </instancedMesh>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color={FG_COLOR} transparent opacity={0.4} />
      </lineSegments>
    </>
  );
}

export function AnimatedCircuit({ seed = "default", className = "" }: AnimatedCircuitProps) {
  const seedValue = useMemo(() => hashString(seed), [seed]);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return (
    <div className={`w-full h-full bg-[#0369a1] ${className}`} />
  );

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <CircuitScene seedValue={seedValue} />
      </Canvas>
    </div>
  );
}
