import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { ACESFilmicToneMapping, PCFSoftShadowMap, HalfFloatType } from 'three'
import { useEffect, useRef } from 'react'
import type { DirectionalLight } from 'three'
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
import { Dreamcatcher, DREAMCATCHER_POS, DREAMCATCHER_ROT, DREAMCATCHER_SCALE } from './Dreamcatcher'
import { Headphones, HEADPHONES_POS, HEADPHONES_ROT, HEADPHONES_SCALE } from './Headphones'
import { Sketchpad, SKETCHPAD_POS } from './Sketchpad'


function SoftShadows() {
  const { gl } = useThree()
  useEffect(() => {
    gl.shadowMap.type = PCFSoftShadowMap
    gl.shadowMap.needsUpdate = true
  }, [gl])
  return null
}

function SunLight() {
  const lightRef = useRef<DirectionalLight>(null)
  const { scene } = useThree()
  useEffect(() => {
    if (!lightRef.current) return
    lightRef.current.target.position.set(-1.5, 0, -2.0)
    scene.add(lightRef.current.target)
    return () => { scene.remove(lightRef.current!.target) }
  }, [scene])
  return (
    <directionalLight
      ref={lightRef}
      position={[6, 2.5, -0.8]}
      intensity={3.5}
      color="#ffb978"
      castShadow
      shadow-mapSize={[4096, 4096]}
      shadow-camera-left={-6}
      shadow-camera-right={6}
      shadow-camera-top={6}
      shadow-camera-bottom={-6}
      shadow-camera-near={0.1}
      shadow-camera-far={20}
      shadow-bias={-0.0003}
      shadow-radius={2}
    />
  )
}

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
        gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        onPointerMissed={() => {
          if (activeAnchor) setActiveAnchor(null)
        }}
      >
        <SoftShadows />
        <hemisphereLight args={['#ffcf8a', '#2a3550', 0.45]} />
        <ambientLight intensity={0.12} color="#ffe4c4" />

        <SunLight />
        <pointLight
          position={[1.4, 1.5, -1.0]}
          intensity={0.7}
          color="#ffc88a"
          distance={5}
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
        <Editable name="dreamcatcher" position={DREAMCATCHER_POS} rotation={DREAMCATCHER_ROT} scale={DREAMCATCHER_SCALE}><Dreamcatcher /></Editable>
        <Editable name="headphones" position={HEADPHONES_POS} rotation={HEADPHONES_ROT} scale={HEADPHONES_SCALE}><Headphones /></Editable>
        <Editable name="sketchpad" position={SKETCHPAD_POS}><Sketchpad /></Editable>

        <CameraRig />
        {debug && <DebugRig />}
        {edit && <SceneEditor />}

        <EffectComposer multisampling={0} frameBufferType={HalfFloatType}>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.3}
            kernelSize={KernelSize.LARGE}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {edit && <EditorHud />}

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
