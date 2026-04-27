import { useGLTF } from '@react-three/drei'

/**
 * GLTF-backed props that sit on the desk top.
 * Desk center at (0, 0, -3.15), top at y=0.73 (WoodenTable_01 real top height).
 */

const DESK_TOP_Y = 0.73
const DESK_X = 0
const DESK_Z = -3.15

export function Stationery() {
  const { scene } = useGLTF('/models/stationery.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X - 0.5, DESK_TOP_Y, DESK_Z - 0.18]}
      rotation={[0, 0.3, 0]}
    />
  )
}

export function Books() {
  const { scene } = useGLTF('/models/books.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X + 0.55, DESK_TOP_Y, DESK_Z - 0.22]}
      rotation={[0, -0.2, 0]}
    />
  )
}

export function AlarmClock() {
  const { scene } = useGLTF('/models/alarm_clock.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X + 0.25, DESK_TOP_Y, DESK_Z - 0.22]}
      rotation={[0, 0.2, 0]}
    />
  )
}

export function RubberDuck() {
  const { scene } = useGLTF('/models/duck.glb')
  return (
    <primitive
      object={scene}
      position={[DESK_X - 0.15, DESK_TOP_Y, DESK_Z + 0.2]}
      rotation={[0, 0.5, 0]}
    />
  )
}

useGLTF.preload('/models/stationery.glb')
useGLTF.preload('/models/books.glb')
useGLTF.preload('/models/alarm_clock.glb')
useGLTF.preload('/models/duck.glb')
