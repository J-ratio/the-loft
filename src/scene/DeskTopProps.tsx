import { useGLTF } from '@react-three/drei'

/**
 * GLTF-backed props on the desk top.
 * Desk at (0, 0, -3.15), desk top y ~0.73 (desk_set height 0.78 base to top).
 */

const DESK_TOP_Y = 0.73
const DESK_X = 0
const DESK_Z = -3.15

export function Stationery() {
  const { scene } = useGLTF('/models/stationery.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X - 0.4, DESK_TOP_Y, DESK_Z - 0.15]}
      rotation={[0, 0.3, 0]}
    />
  )
}

export function AlarmClock() {
  const { scene } = useGLTF('/models/alarm_clock.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X + 0.35, DESK_TOP_Y, DESK_Z - 0.22]}
      rotation={[0, 0.2, 0]}
    />
  )
}

export function Mug() {
  const { scene } = useGLTF('/models/mug.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X - 0.55, DESK_TOP_Y, DESK_Z + 0.1]}
      rotation={[0, -0.3, 0]}
    />
  )
}

export function RubiksCube() {
  const { scene } = useGLTF('/models/rubiks.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X + 0.1, DESK_TOP_Y, DESK_Z + 0.18]}
      rotation={[0, 0.5, 0]}
    />
  )
}

useGLTF.preload('/models/stationery.glb')
useGLTF.preload('/models/alarm_clock.glb')
useGLTF.preload('/models/mug.glb')
useGLTF.preload('/models/rubiks.glb')
