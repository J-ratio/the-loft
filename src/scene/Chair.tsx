import { useGLTF } from '@react-three/drei'
import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Armchair in front of the desk. Using Poly Haven ArmChair_01 — cozy,
 * mid-century, matches the "lived in" INFP vibe better than an office chair.
 * Rotated to face the desk (-Z).
 */
export function Chair({ position = [0, 0, -2.55] }: Props) {
  const { scene } = useGLTF('/models/armchair.glb')
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/armchair.glb')
