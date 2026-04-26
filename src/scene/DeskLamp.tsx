import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Anglepoise-style desk lamp — black metal arm, peach shade with
 * emissive interior + warm point light. The second foundational light.
 */
export function DeskLamp({ position = [0.55, 0.725, -1.3] }: Props) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh castShadow position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.08, 0.09, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Lower arm */}
      <mesh castShadow position={[0, 0.17, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Elbow joint */}
      <mesh castShadow position={[-0.045, 0.31, 0]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Upper arm */}
      <mesh castShadow position={[-0.09, 0.29, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Shade — peach/pink, angled down toward desk */}
      <mesh
        castShadow
        position={[-0.15, 0.3, 0]}
        rotation={[0, 0, -0.9]}
      >
        <coneGeometry args={[0.12, 0.16, 20, 1, true]} />
        <meshStandardMaterial
          color="#e68a6a"
          roughness={0.6}
          side={2}
        />
      </mesh>
      {/* Emissive bulb under the shade */}
      <mesh position={[-0.12, 0.25, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#fff0cc"
          emissive="#ffd488"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Warm point light from the lamp */}
      <pointLight
        position={[-0.12, 0.22, 0]}
        intensity={0.9}
        distance={2.2}
        color="#ffc488"
        decay={2}
      />
    </group>
  )
}
