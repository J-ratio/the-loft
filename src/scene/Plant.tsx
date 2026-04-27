import { useGLTF } from '@react-three/drei'
import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Potted plant on the right-wall window sill.
 * Uses the Poly Haven "Potted Plant 01" GLB at /models/plant.glb.
 * The import pipeline has already normalized height to 1.1m, base at y=0.
 */
export function Plant({ position = [1.5, 0.77, -0.6] }: Props) {
  const { scene } = useGLTF('/models/monstera.glb')
  return (
    <group position={position}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/monstera.glb')
