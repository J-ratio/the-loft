import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { Link } from 'react-router-dom'
import { useLoftStore } from '../state/store'
import { Room } from './Room'
import { Desk } from './Desk'
import { Rug } from './Rug'
import { Plant } from './Plant'
import { Mug } from './Mug'
import { CameraRig } from './CameraRig'
import { AnchorOverlay } from '../overlays/AnchorOverlay'

/**
 * Top-level scene surface. Canvas + HTML overlay + minimal HUD.
 * The HUD lives outside the Canvas (design law #3: diegetic UI inside,
 * plain HTML for fast-travel outside).
 */
export function Scene() {
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)

  return (
    <div className="fixed inset-0 bg-neutral-900">
      <Canvas
        shadows
        camera={{ position: [2.2, 1.8, 2.4], fov: 35 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
        onPointerMissed={() => {
          // Click outside any interactive mesh → return home.
          if (activeAnchor) setActiveAnchor(null)
        }}
      >
        {/* Hemisphere: warm sky (golden hour) over warm ground bounce. */}
        <hemisphereLight
          args={['#ffd98a', '#6b4a2a', 0.5]}
        />

        {/* Warm bounce fill — simulates sunlight reflecting off walls. */}
        <ambientLight intensity={0.25} color="#ffcc99" />

        {/* The sun: streaming through the window (back-right), low and warm. */}
        <directionalLight
          position={[3.5, 3, -1]}
          intensity={3.2}
          color="#ffb978"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0005}
        />

        {/* A second warm fill from the window direction at eye height,
            no shadows — softens the shadowed side of props. */}
        <pointLight
          position={[2.2, 1.6, -1.5]}
          intensity={0.8}
          color="#ffc88a"
          distance={6}
        />

        <Room />
        <Rug />
        <Desk />
        <Plant />
        <Mug />
        <CameraRig />
      </Canvas>

      <AnchorOverlay />

      {/* HUD — plain HTML over the canvas */}
      <div className="fixed top-4 left-4 z-20 text-neutral-100 pointer-events-none">
        <div className="text-xs font-mono tracking-widest text-neutral-400">
          THE LOFT
        </div>
      </div>
      <div className="fixed bottom-4 right-4 z-20 pointer-events-auto">
        <Link
          to="/blog"
          className="text-xs font-mono text-neutral-400 hover:text-neutral-100 bg-neutral-900/70 border border-neutral-700 rounded px-3 py-1.5 backdrop-blur"
        >
          read as plain text →
        </Link>
      </div>
      {!activeAnchor && (
        <div className="fixed bottom-4 left-4 z-20 text-xs font-mono text-neutral-500 pointer-events-none">
          click the notebook on the desk
        </div>
      )}
    </div>
  )
}
