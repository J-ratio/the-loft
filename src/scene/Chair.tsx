import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Office chair in front of the desk (desk at z=-3.15).
 * Chair sits at z=-2.45, facing -Z (into the desk).
 */
export function Chair({ position = [0, 0, -2.45] }: Props) {
  return (
    <group position={position} rotation={[0, Math.PI + 0.15, 0]}>
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.48, 0.08, 0.44]} />
        <meshStandardMaterial color="#a83b2f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.545, 0]}>
        <boxGeometry args={[0.42, 0.01, 0.38]} />
        <meshStandardMaterial color="#c44a3e" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0.88, -0.19]}>
        <boxGeometry args={[0.46, 0.62, 0.08]} />
        <meshStandardMaterial color="#a83b2f" roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.2
        const z = Math.sin(angle) * 0.2
        return (
          <mesh key={i} castShadow position={[x, 0.05, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.22, 0.04, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
          </mesh>
        )
      })}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2
        const x = Math.cos(angle) * 0.29
        const z = Math.sin(angle) * 0.29
        return (
          <mesh key={`w-${i}`} castShadow position={[x, 0.025, z]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 8]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}
