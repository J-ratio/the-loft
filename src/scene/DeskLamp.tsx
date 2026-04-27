import { useGLTF } from '@react-three/drei'
import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Desk lamp on the desk (desk center at z=-3.15, top at y=0.725).
 * Using Poly Haven desk_lamp_arm_01 — anglepoise-style, 0.55m tall.
 *
 * Lamp sits "off" during daytime — no emissive or point light. Per user:
 * "lamp need not be on during daytime". Dark mode (v2+) will toggle it on.
 */
export function DeskLamp({ position = [0.55, 0.725, -3.2] }: Props) {
  const { scene } = useGLTF('/models/desk_lamp.glb')
  return (
    <group position={position}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/desk_lamp.glb')
