import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { logBbox } from '../lib/bbox-log'

export const PLANT_POS: [number, number, number] = [1.641, 0.725, -0.284]

/**
 * Monstera — Sketchfab asset. Renders at local origin; caller positions.
 */
export function Plant() {
  const { scene } = useGLTF('/models/monstera.glb')
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('monstera', ref.current), [])
  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/monstera.glb')
