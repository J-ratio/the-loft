import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { logBbox } from '../lib/bbox-log'

export const CHAIR_POS: [number, number, number] = [0, 0, -2.35]

/**
 * Armchair — Poly Haven ArmChair_01. Renders at local origin with a 180°
 * rotation baked in so front of chair faces +Z; caller positions.
 */
export function Chair() {
  const { scene } = useGLTF('/models/armchair.glb')
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('armchair', ref.current), [])
  return (
    <group ref={ref} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/armchair.glb')
