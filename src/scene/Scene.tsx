import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three'
import { useEffect, useRef, useState } from 'react'
import type { Mesh } from 'three'
import { Link } from 'react-router-dom'
import { useLoftStore } from '../state/store'
import { isDebugMode, isEditMode } from '../lib/debug'
import { DebugRig } from './DebugRig'
import { SceneEditor } from './SceneEditor'
import { EditorHud } from './EditorHud'
import { Editable } from './Editable'
import { Room } from './Room'
import { Desk } from './Desk'
import { Rug } from './Rug'
import { Plant, PLANT_POS } from './Plant'
import { Chair, CHAIR_POS } from './Chair'
import {
  AlarmClock,
  Mug,
  RubiksCube,
  ALARM_CLOCK_POS,
  ALARM_CLOCK_ROT,
  MUG_POS,
  MUG_ROT,
  RUBIKS_POS,
} from './DeskTopProps'
import { Corkboard } from './Corkboard'
import { Notebook, NOTEBOOK_POS } from './Notebook'
import { WindowView } from './WindowView'
import { CameraRig } from './CameraRig'

/**
 * Sun: a real emissive sphere sitting outside the window. The GodRays
 * post-effect samples this mesh to compute light shafts streaming through
 * the window mullions. Positioned where the painted sun disc lives in
 * WindowView so both align visually.
 */
/**
 * Sun mesh for GodRays sampling. Placed far outside the window so its
 * angular size is small and rays converge to near-parallel shafts.
 * `visible={false}` on the WHOLE mesh would hide it from rays too; instead
 * we render it but set a layer so GodRays sees it and the main camera
 * doesn't — the mesh itself is invisible from the room but the rays still
 * compute correctly.
 *
 * Simplest approach: keep it visible but tiny + far. Screen-space
 * contribution is small; rays do the heavy lifting.
 */
function SunMesh({ meshRef }: { meshRef: React.MutableRefObject<Mesh | null> }) {
  return (
    <mesh ref={(m) => (meshRef.current = m)} position={[20, 5, 1.0]}>
      <sphereGeometry args={[0.6, 24, 24]} />
      <meshBasicMaterial color="#fff3c8" toneMapped={false} />
    </mesh>
  )
}

/** Switch the shadow map type to PCFSoft for softer/longer shadows. */
function SoftShadows() {
  const { gl } = useThree()
  useEffect(() => {
    gl.shadowMap.type = PCFSoftShadowMap
    gl.shadowMap.needsUpdate = true
  }, [gl])
  return null
}

/**
 * Scene root. Long narrow upper-loft (X=3.5 × Z=5), window on right wall,
 * sun streams in from +X, camera on LEFT.
 *
 * Lighting = INFP golden-hour day:
 *  - warm low-angle directional sun (long soft shadows via PCFSoft)
 *  - warm hemisphere + cool bounce for warm/cool tension
 *  - real sun sphere + GodRays post-effect for volumetric light shafts
 *  - Bloom on bright pixels for window halo + glow
 */
export function Scene() {
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const debug = isDebugMode()
  const edit = isEditMode()
  const sunRef = useRef<Mesh | null>(null)
  const [sunReady, setSunReady] = useState(false)

  return (
    <div className="fixed inset-0 bg-neutral-900">
      <Canvas
        shadows
        camera={{ position: [-1.3, 1.5, 0.2], fov: 48 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        onPointerMissed={() => {
          if (activeAnchor) setActiveAnchor(null)
        }}
        onCreated={() => {
          // Signal that the scene is ready so the post-effects can be mounted
          // with a valid sun mesh ref.
          requestAnimationFrame(() => setSunReady(true))
        }}
      >
        <SoftShadows />
        <hemisphereLight args={['#ffcf8a', '#2a3550', 0.45]} />
        <ambientLight intensity={0.12} color="#ffe4c4" />

        {/* Sun — low angle for long soft shadows */}
        <directionalLight
          position={[20, 5, 1.0]}
          intensity={3.0}
          color="#ffb978"
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0003}
          shadow-radius={6}
        />
        <pointLight
          position={[1.4, 1.5, -1.0]}
          intensity={0.7}
          color="#ffc88a"
          distance={5}
        />
        <pointLight
          position={[-1.6, 1.8, -1.0]}
          intensity={0.35}
          color="#8aa8d6"
          distance={6}
        />

        <SunMesh meshRef={sunRef} />

        <WindowView />
        <Room />
        <Rug />
        <Desk />
        <Corkboard />

        <Editable name="notebook" position={NOTEBOOK_POS}><Notebook /></Editable>
        <Editable name="chair" position={CHAIR_POS}><Chair /></Editable>
        <Editable name="plant" position={PLANT_POS}><Plant /></Editable>
        <Editable name="alarm_clock" position={ALARM_CLOCK_POS} rotation={ALARM_CLOCK_ROT}><AlarmClock /></Editable>
        <Editable name="mug" position={MUG_POS} rotation={MUG_ROT}><Mug /></Editable>
        <Editable name="rubiks" position={RUBIKS_POS}><RubiksCube /></Editable>

        <CameraRig />
        {debug && <DebugRig />}
        {edit && <SceneEditor />}

        {sunReady && sunRef.current && (
          <EffectComposer multisampling={0} stencilBuffer={false}>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.3}
              kernelSize={KernelSize.LARGE}
              mipmapBlur
            />
            <GodRays
              sun={sunRef.current}
              density={0.98}
              decay={0.96}
              weight={0.4}
              exposure={0.35}
              samples={80}
              clampMax={1.0}
              blur
              blendFunction={BlendFunction.SCREEN}
            />
          </EffectComposer>
        )}
      </Canvas>

      {edit && <EditorHud />}

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
      {!activeAnchor && !debug && !edit && (
        <div className="fixed bottom-4 left-4 z-20 text-xs font-mono text-neutral-500 pointer-events-none">
          click the notebook on the desk
        </div>
      )}
      {debug && (
        <div className="fixed bottom-4 left-4 z-20 text-xs font-mono text-amber-400/80 bg-neutral-900/70 border border-amber-500/40 rounded px-3 py-2 backdrop-blur pointer-events-none space-y-0.5">
          <div className="font-bold tracking-widest">DEBUG</div>
          <div>left-drag: orbit · right-drag: pan · wheel: zoom</div>
          <div>wasd: move · q/e: down/up · shift: sprint</div>
        </div>
      )}
    </div>
  )
}
