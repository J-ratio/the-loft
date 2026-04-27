import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group, Vector3Tuple } from 'three'
import { logBbox } from '../lib/bbox-log'

type Props = {
  position?: Vector3Tuple
}

/**
 * Armchair in front of desk. Poly Haven ArmChair_01, preserved scale (~1m tall).
 */
export function Chair({ position = [0, 0, -2.35] }: Props) {
  const { scene } = useGLTF('/models/armchair.glb')
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('armchair', ref.current), [])
  return (
    <group ref={ref} position={position} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/armchair.glb')
