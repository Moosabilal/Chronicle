// FloatingMarbles — GSAP ScrollTrigger parallax
// NOTE: @gsap/react's useGSAP cannot be used inside R3F canvas (different React root).
// We use plain useEffect + GSAP directly, which works correctly.
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

interface MarbleProps {
  position: [number, number, number]
  scale: number
  speed: number
  distort: number
  color: string
  roughness?: number
  metalness?: number
  scrollShift?: { x: number; y: number; z: number }
}

function Marble({
  position,
  scale,
  speed,
  distort,
  color,
  roughness = 0.15,
  metalness = 0.1,
  scrollShift = { x: 0, y: 0, z: 0 },
}: MarbleProps) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Idle float animation
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
  })

  // GSAP scroll parallax — use plain useEffect (not useGSAP) inside R3F canvas
  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        group.position.x = position[0] + scrollShift.x * p
        group.position.y = position[1] + scrollShift.y * p
        group.position.z = position[2] + scrollShift.z * p
        group.rotation.z = p * 0.8 * speed
      },
    })

    return () => trigger.kill()
  }, [position, scrollShift, speed])

  return (
    <group ref={groupRef} position={position}>
      <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2} floatingRange={[-0.3, 0.3]}>
        <mesh ref={meshRef} scale={scale} castShadow>
          <Sphere args={[1, 64, 64]}>
            <MeshDistortMaterial
              color={color}
              distort={distort}
              speed={1.2}
              roughness={roughness}
              metalness={metalness}
            />
          </Sphere>
        </mesh>
      </Float>
    </group>
  )
}

const marbles: MarbleProps[] = [
  { position: [-5.5, 2.5, -4],  scale: 1.8, speed: 0.6, distort: 0.35, color: '#EDE9E0', roughness: 0.2,  metalness: 0.05, scrollShift: { x: 1.5,  y: -2.0, z: -1.5 } },
  { position: [5.0, -1.5, -6],  scale: 2.4, speed: 0.4, distort: 0.2,  color: '#DDD8CE', roughness: 0.1,  metalness: 0.15, scrollShift: { x: -2.0, y: -1.0, z: -2.0 } },
  { position: [0.5, 3.5, -8],   scale: 1.2, speed: 0.8, distort: 0.45, color: '#F2EEE8', roughness: 0.3,  metalness: 0.0,  scrollShift: { x: 0.5,  y: -3.0, z: 1.0  } },
  { position: [-3.0, -3.0, -5], scale: 1.0, speed: 1.0, distort: 0.3,  color: '#E8E3DA', roughness: 0.15, metalness: 0.08, scrollShift: { x: 2.0,  y: 1.5,  z: -1.0 } },
  { position: [6.0, 3.0, -10],  scale: 3.0, speed: 0.3, distort: 0.15, color: '#D6D0C6', roughness: 0.05, metalness: 0.2,  scrollShift: { x: -1.0, y: -2.5, z: 2.0  } },
  { position: [-6.5, -0.5, -7], scale: 1.5, speed: 0.7, distort: 0.4,  color: '#EAE5DC', roughness: 0.25, metalness: 0.05, scrollShift: { x: 1.0,  y: 2.0,  z: -1.5 } },
]

export function FloatingMarbles() {
  return (
    <>
      {marbles.map((props, i) => (
        <Marble key={i} {...props} />
      ))}
    </>
  )
}
