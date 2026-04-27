import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { logBbox } from '../lib/bbox-log'
import { DESK_TOP_Y, DESK_BOARD_DEPTH } from './Desk'

// Board center Z: -3.5 + depth/2. Prop offsets are relative to that.
const DESK_X = 0
const DESK_Z = -3.5 + DESK_BOARD_DEPTH / 2

function AssetOnDesk({
  url,
  label,
  offsetX,
  offsetZ,
  rotY,
  liftY = 0,
  /** Per-asset Y offset to nudge visible base onto surface (some GLTF bboxes
   *  include invisible geometry below visible meshes, making items look floaty). */
  sinkY = 0,
}: {
  url: string
  label: string
  offsetX: number
  offsetZ: number
  rotY: number
  liftY?: number
  sinkY?: number
}) {
  const { scene } = useGLTF(url)
  const ref = useRef<Group>(null!)
  useEffect(() => {
    logBbox(label, ref.current)
  }, [label])
  return (
    <group
      ref={ref}
      position={[DESK_X + offsetX, DESK_TOP_Y + liftY - sinkY, DESK_Z + offsetZ]}
      rotation={[0, rotY, 0]}
    >
      <primitive object={scene} />
    </group>
  )
}

export const Stationery = () => (
  <AssetOnDesk
    url="/models/stationery.glb"
    label="stationery"
    offsetX={-0.55}
    offsetZ={-0.22}
    rotY={0.3}
  />
)
export const AlarmClock = () => (
  <AssetOnDesk
    url="/models/alarm_clock.glb"
    label="alarm_clock"
    offsetX={0.6}
    offsetZ={-0.22}
    rotY={0.2}
  />
)
export const Mug = () => (
  <AssetOnDesk
    url="/models/mug.glb"
    label="mug"
    offsetX={-0.65}
    offsetZ={0.05}
    rotY={-0.3}
  />
)
export const RubiksCube = () => (
  <AssetOnDesk
    url="/models/rubiks.glb"
    label="rubiks"
    offsetX={0.35}
    offsetZ={0.12}
    rotY={0.5}
  />
)

useGLTF.preload('/models/stationery.glb')
useGLTF.preload('/models/alarm_clock.glb')
useGLTF.preload('/models/mug.glb')
useGLTF.preload('/models/rubiks.glb')
