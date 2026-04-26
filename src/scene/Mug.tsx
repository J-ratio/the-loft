import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Ceramic mug on the desk — cylinder body + torus handle + dark coffee disc.
 * A single small prop that makes the desk feel inhabited.
 */
export function Mug({ position = [-0.55, 0.76, -1.15] }: Props) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.045, 0.11, 20]} />
        <meshStandardMaterial color="#e8d9c0" roughness={0.5} />
      </mesh>
      {/* Coffee surface (slightly below rim) */}
      <mesh position={[0, 0.048, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.004, 20]} />
        <meshStandardMaterial color="#3d2414" roughness={0.4} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.058, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.008, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#e8d9c0" roughness={0.5} />
      </mesh>
    </group>
  )
}
