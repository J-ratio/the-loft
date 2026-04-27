import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Mug on the desk (left side).
 */
export function Mug({ position = [-0.5, 0.76, -3.15] }: Props) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.045, 0.11, 20]} />
        <meshStandardMaterial color="#e8d9c0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.048, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.004, 20]} />
        <meshStandardMaterial color="#3d2414" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0.058, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.008, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#e8d9c0" roughness={0.5} />
      </mesh>
    </group>
  )
}
