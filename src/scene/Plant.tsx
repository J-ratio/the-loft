import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import type { Group, Vector3Tuple } from 'three'
import { logBbox } from '../lib/bbox-log'

type Props = {
  position?: Vector3Tuple
}

/**
 * Monstera on the right-wall window sill. Sketchfab asset, scaled to 0.55m.
 */
export function Plant({ position = [1.5, 0.77, -0.6] }: Props) {
  const { scene } = useGLTF('/models/monstera.glb')
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('monstera', ref.current), [])
  return (
    <group ref={ref} position={position}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/monstera.glb')
