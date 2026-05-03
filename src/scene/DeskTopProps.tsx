import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
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
}: {
  url: string
  label: string
  rotation?: [number, number, number]
}) {
  const { scene } = useGLTF(url)
  const ref = useRef<Group>(null!)
  useEffect(() => {
    logBbox(label, ref.current)
  }, [label])
  return (
    <group ref={ref} rotation={rotation}>
      <primitive object={scene} />
    </group>
  )
}

export const AlarmClock = () => (
  <AssetAtOrigin url="/models/alarm_clock.glb" label="alarm_clock" />
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
