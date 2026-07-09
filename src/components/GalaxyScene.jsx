import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ── Fondo de estrellas con tinte sakura ──────────────────────
function StarField({ count = 6000, minRadius = 14, maxRadius = 46, spreadY = 26, size = 0.14 }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffb3d9"),
      new THREE.Color("#d9b3ff"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#ff8fc7"),
    ];
    for (let i = 0; i < count; i++) {
      // distribucion esferica pareja para que se vean estrellas
      // arriba, abajo y en todas direcciones, no solo en un anillo plano
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * (spreadY / maxRadius) + (Math.random() - 0.5) * spreadY * 0.4;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count, minRadius, maxRadius, spreadY]);

  const ref = useRef();
  const matRef = useRef();
  useFrame(({ clock }, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
    if (matRef.current) {
      // titilar suave del brillo general de las estrellas
      matRef.current.opacity = 0.72 + Math.sin(clock.elapsedTime * 0.9) * 0.13;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Posiciones en espiral tipo galaxia ────────────────────────
function useSpiralPositions(count) {
  return useMemo(() => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const positions = [];
    for (let i = 0; i < count; i++) {
      const radius = 3.2 + i * 1.45;
      const angle = i * goldenAngle;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.sin(i * 1.35) * 1.7;
      positions.push([x, y, z]);
    }
    return positions;
  }, [count]);
}

// ── Foto flotante + frase ─────────────────────────────────────
function MemoryPlanet({ memory, position, onFocus }) {
  const texture = useTexture(memory.image);
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.lookAt(state.camera.position);
    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.05;
      glowRef.current.scale.setScalar(pulse * (hovered ? 1.15 : 1));
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.05]} ref={glowRef}>
        <circleGeometry args={[1.55, 48]} />
        <meshBasicMaterial
          color="#ff9fd4"
          transparent
          opacity={hovered ? 0.28 : 0.16}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.15 : 1}
        onClick={(e) => {
          e.stopPropagation();
          onFocus(memory, position);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[1.15, 48]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <ringGeometry args={[1.16, 1.34, 48]} />
        <meshBasicMaterial
          color="#ffb3d9"
          transparent
          opacity={hovered ? 0.95 : 0.5}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, -1.75, 0]}
        fontSize={0.32}
        maxWidth={3.4}
        lineHeight={1.3}
        textAlign="center"
        anchorX="center"
        anchorY="top"
        color="#ffe3f2"
        outlineWidth={0.012}
        outlineColor="#2a0620"
      >
        {memory.phrase}
      </Text>
    </group>
  );
}

// ── Camara: se acerca suavemente al recuerdo enfocado ─────────
function CameraRig({ focus, controlsRef }) {
  useFrame((state, delta) => {
    if (!focus || !controlsRef.current) return;
    const target = new THREE.Vector3(...focus.position);
    const dir = target.clone();
    if (dir.lengthSq() === 0) dir.set(0, 0, 1);
    dir.normalize();
    const camGoal = target.clone().add(dir.multiplyScalar(3.6));
    camGoal.y += 0.4;
    const t = Math.min(delta * 2.4, 1);
    state.camera.position.lerp(camGoal, t);
    controlsRef.current.target.lerp(target, t);
    controlsRef.current.update();
  });
  return null;
}

export default function GalaxyScene({ memories, intro }) {
  const [focus, setFocus] = useState(null);
  const controlsRef = useRef();
  const positions = useSpiralPositions(memories.length);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 5, 20], fov: 55 }}>
        <color attach="background" args={["#050208"]} />
        <ambientLight intensity={0.7} />
        {/* Varias capas de estrellas para que se vean llenas arriba, abajo
            y a lo lejos sin importar cuanto te alejes con el zoom */}
        <StarField count={5000} minRadius={12} maxRadius={60} spreadY={40} size={0.13} />
        <StarField count={3500} minRadius={60} maxRadius={110} spreadY={90} size={0.22} />
        <StarField count={2000} minRadius={110} maxRadius={170} spreadY={150} size={0.3} />
        <Suspense fallback={null}>
          {memories.map((m, i) => (
            <MemoryPlanet
              key={m.id}
              memory={m}
              position={positions[i]}
              onFocus={(mem, pos) => setFocus({ ...mem, position: pos })}
            />
          ))}
          {intro && (
            <Text
              position={[0, 7, 0]}
              fontSize={1.1}
              maxWidth={10}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
              color="#ffd7ec"
              outlineWidth={0.02}
              outlineColor="#2a0620"
            >
              {intro}
            </Text>
          )}
        </Suspense>
        <CameraRig focus={focus} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          zoomSpeed={0.9}
          minDistance={3.5}
          maxDistance={95}
          autoRotate={!focus}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {focus && (
        <button
          onClick={() => setFocus(null)}
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            padding: "8px 18px",
            background: "rgba(10,10,10,0.75)",
            border: "1px solid rgba(232,96,154,0.4)",
            color: "#f07ab0",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            borderRadius: 20,
            backdropFilter: "blur(6px)",
          }}
        >
          ← Volver a la galaxia
        </button>
      )}
    </div>
  );
}
