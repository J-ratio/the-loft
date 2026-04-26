import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import { Link } from 'react-router-dom'
import { useLoftStore } from '../state/store'
import { Room } from './Room'
import { Desk } from './Desk'
import { Rug } from './Rug'
import { Plant } from './Plant'
import { Mug } from './Mug'
import { Chair } from './Chair'
import { DeskLamp } from './DeskLamp'
import { Bookshelf } from './Bookshelf'
import { CreativeClutter } from './CreativeClutter'
import { FairyLights } from './FairyLights'
import { WallArt } from './WallArt'
import { WindowView } from './WindowView'
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
        camera={{ position: [1.9, 1.45, 2.0], fov: 38 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        onPointerMissed={() => {
          // Click outside any interactive mesh → return home.
          if (activeAnchor) setActiveAnchor(null)
        }}
      >
        {/* Hemisphere: warm amber sky ↔ cool indigo "shadow" bounce.
            This is what kills the monochrome-orange feel. */}
        <hemisphereLight args={['#ffcf8a', '#2a3550', 0.55]} />

        {/* Very subtle ambient fill */}
        <ambientLight intensity={0.15} color="#ffe4c4" />

        {/* The sun: streaming IN THROUGH the window (back wall, right side).
            Position places it "outside" — rays travel into the room. */}
        <directionalLight
          position={[2.0, 2.5, -4]}
          intensity={3.0}
          color="#ffb978"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0005}
        />

        {/* Warm "bounced sun" fill at window height — softens shadows
            on the window-facing side of props. */}
        <pointLight
          position={[1.5, 1.6, -1.8]}
          intensity={0.6}
          color="#ffc88a"
          distance={5}
        />

        {/* Cool fill from the opposite (left) wall — simulates reflected
            skylight, breaks the all-warm palette. */}
        <pointLight
          position={[-2.0, 1.8, 0.5]}
          intensity={0.4}
          color="#8aa8d6"
          distance={6}
        />

        <WindowView />
        <Room />
        <Rug />
        <Bookshelf />
        <Desk />
        <Chair />
        <DeskLamp />
        <Plant />
        <Mug />
        <CreativeClutter />
        <WallArt />
        <FairyLights />
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
