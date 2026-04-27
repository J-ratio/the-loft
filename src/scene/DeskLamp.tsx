import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group, Vector3Tuple } from 'three'
import { logBbox } from '../lib/bbox-log'

type Props = {
  position?: Vector3Tuple
}

/**
 * Desk lamp — Poly Haven desk_lamp_arm_01 (preserved scale ~0.9m tall).
 * "Off" during daytime per user.
 */
// Native lamp pivot is 0.08m below its base. Desk top at 0.85 → lift to 0.93.
export function DeskLamp({ position = [0.55, 0.93, -3.3] }: Props) {
  const { scene } = useGLTF('/models/desk_lamp.glb')
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('desk_lamp', ref.current), [])
  return (
    <group ref={ref} position={position}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/desk_lamp.glb')
