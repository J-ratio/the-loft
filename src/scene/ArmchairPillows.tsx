import { useGLTF } from '@react-three/drei'

/**
 * Throw pillows on the armchair seat. Armchair at (0, 0, -2.55), seat top
 * around y=0.45 (arm chair is 0.9m tall, seat ~50% up).
 */
export function ArmchairPillows() {
  const { scene } = useGLTF('/models/pillows.glb')
  return (
    <primitive
      object={scene}
      position={[0, 0.45, -2.6]}
      rotation={[0, 0.15, 0]}
    />
  )
}

useGLTF.preload('/models/pillows.glb')
