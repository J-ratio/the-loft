import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
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
 * Scene root. Long narrow upper-loft (X=3.5 × Z=5), window on right wall,
 * sun streams in from +X, camera sits on the LEFT and looks across toward
 * the window / down the room length.
 */
export function Scene() {
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const debug = isDebugMode()
  const edit = isEditMode()

  return (
    <div className="fixed inset-0 bg-neutral-900">
      <Canvas
        shadows
        camera={{ position: [-1.3, 1.5, 0.2], fov: 48 }}
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        onPointerMissed={() => {
          if (activeAnchor) setActiveAnchor(null)
        }}
      >
        <hemisphereLight args={['#ffcf8a', '#2a3550', 0.5]} />
        <ambientLight intensity={0.15} color="#ffe4c4" />

        <directionalLight
          position={[5, 3.5, -0.5]}
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
