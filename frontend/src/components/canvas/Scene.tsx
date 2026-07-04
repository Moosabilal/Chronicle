import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { AdaptiveDpr, AdaptiveEvents, Environment, PerformanceMonitor } from '@react-three/drei'
import { FloatingMarbles } from './FloatingMarbles'

/* ─── Background 3D Canvas ─────────────────────────────────────────────────── */
export function Scene() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        shadows
      >
        <PerformanceMonitor />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        
        <ambientLight intensity={1.4} color="#FDF8F0" />

        
        <directionalLight
          position={[6, 8, 4]}
          intensity={1.8}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        
        <directionalLight
          position={[-5, -3, 2]}
          intensity={0.5}
          color="#E8ECF4"
        />

        
        <pointLight position={[0, 5, 5]} intensity={0.6} color="#FFF5E6" />

        <Suspense fallback={null}>
          
          <Environment preset="dawn" />
          <FloatingMarbles />
        </Suspense>
      </Canvas>
    </div>
  )
}
