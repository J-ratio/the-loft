import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Anglepoise lamp on the right side of the desk (desk center at (0, 0, -3.15)).
 * Positioned at x = +0.55 relative to desk, so world x = +0.55.
 */
export function DeskLamp({ position = [0.55, 0.725, -3.2] }: Props) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh castShadow position={[0, 0.17, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.045, 0.31, 0]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.09, 0.29, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.15, 0.3, 0]} rotation={[0, 0, -0.9]}>
        <coneGeometry args={[0.12, 0.16, 20, 1, true]} />
        <meshStandardMaterial color="#e68a6a" roughness={0.6} side={2} />
      </mesh>
      {/* Bulb — "off" during daytime: subtle, not emissive. */}
      <mesh position={[-0.12, 0.25, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#f0e4c8" roughness={0.4} />
      </mesh>
    </group>
  )
}
