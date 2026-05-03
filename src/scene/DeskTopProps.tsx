import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group, MeshStandardMaterial, Mesh } from 'three'
import { logBbox } from '../lib/bbox-log'
import { DESK_TOP_Y, DESK_BOARD_DEPTH } from './Desk'

/**
 * Desk-top prop defaults. Each prop renders at its local origin with a
 * baked-in rotation; Scene.tsx places it in world space via <Editable>.
 * Caller can override with DEFAULT_* positions exported here.
 */

const DESK_X = 0
const DESK_Z = -3.5 + DESK_BOARD_DEPTH / 2

export const ALARM_CLOCK_POS: [number, number, number] = [0.6, 0.85, -3.37]
export const ALARM_CLOCK_ROT: [number, number, number] = [-3.142, 0.197, -3.142]
export const MUG_POS: [number, number, number] = [-0.65, 0.85, -3.1]
export const MUG_ROT: [number, number, number] = [0, 0, -0.291]
export const RUBIKS_POS: [number, number, number] = [DESK_X + 0.35, DESK_TOP_Y, DESK_Z + 0.12]

function AssetAtOrigin({
  url,
  label,
  rotation = [0, 0, 0],
  patchGlass = false,
}: {
  url: string
  label: string
  rotation?: [number, number, number]
  /** If the asset has a translucent/glass material that renders as opaque
   *  black due to alpha-sort issues, patch it on mount. Matches materials
   *  whose name contains "glass" (case-insensitive). */
  patchGlass?: boolean
}) {
  const { scene } = useGLTF(url)
  const ref = useRef<Group>(null!)
  useEffect(() => {
    logBbox(label, ref.current)
    if (!patchGlass) return
    scene.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of mats) {
        const mat = m as MeshStandardMaterial
        if (!mat?.name) continue
        if (mat.name.toLowerCase().includes('glass')) {
          mat.transparent = true
          mat.depthWrite = false
          mat.opacity = 0.35
          mat.needsUpdate = true
        }
      }
    })
  }, [label, patchGlass, scene])
  return (
    <group ref={ref} rotation={rotation}>
      <primitive object={scene} />
    </group>
  )
}

export const AlarmClock = () => (
  <AssetAtOrigin url="/models/alarm_clock.glb" label="alarm_clock" patchGlass />
)
export const Mug = () => (
  <AssetAtOrigin url="/models/mug.glb" label="mug" />
)
export const RubiksCube = () => (
  <AssetAtOrigin url="/models/rubiks.glb" label="rubiks" rotation={[0, 0.5, 0]} />
)

useGLTF.preload('/models/alarm_clock.glb')
useGLTF.preload('/models/mug.glb')
useGLTF.preload('/models/rubiks.glb')
