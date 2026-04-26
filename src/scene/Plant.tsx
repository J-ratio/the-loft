import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Stylized Monstera — terracotta pot + a few vertical leaf planes.
 * Primitive, but reads as "houseplant" from the default camera angle.
 * Lives on the floor near the window for INFP "growth toward light".
 */
export function Plant({ position = [1.8, 0, -1.8] }: Props) {
  return (
    <group position={position}>
      {/* Terracotta pot */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.36, 16]} />
        <meshStandardMaterial color="#a65b3d" roughness={0.85} />
      </mesh>

      {/* Soil */}
      <mesh position={[0, 0.37, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
        <meshStandardMaterial color="#2d1d12" roughness={1} />
      </mesh>

      {/* Thin stems */}
      {[
        { rot: 0.15, lean: [0.05, 0, 0.02] as Vector3Tuple },
        { rot: -0.25, lean: [-0.06, 0, 0.04] as Vector3Tuple },
        { rot: 0.05, lean: [0.02, 0, -0.05] as Vector3Tuple },
      ].map((s, i) => (
        <mesh
          key={`stem-${i}`}
          castShadow
          position={[s.lean[0], 0.55, s.lean[2]]}
          rotation={[0, 0, s.rot]}
        >
          <cylinderGeometry args={[0.012, 0.015, 0.38, 6]} />
          <meshStandardMaterial color="#3a5a2a" roughness={0.9} />
        </mesh>
      ))}

      {/* Leaves — big rounded planes at varied angles */}
      {[
        { pos: [0.12, 0.75, 0.08] as Vector3Tuple, rot: [0.2, 0.4, 0.3] as Vector3Tuple, scale: 1 },
        { pos: [-0.14, 0.8, 0.1] as Vector3Tuple, rot: [0.1, -0.6, -0.2] as Vector3Tuple, scale: 1.1 },
        { pos: [0.06, 0.9, -0.1] as Vector3Tuple, rot: [-0.1, 0.2, 0.05] as Vector3Tuple, scale: 1.2 },
        { pos: [-0.08, 0.65, -0.05] as Vector3Tuple, rot: [0.3, -0.3, 0.4] as Vector3Tuple, scale: 0.85 },
        { pos: [0.16, 0.55, -0.02] as Vector3Tuple, rot: [0.4, 0.8, -0.3] as Vector3Tuple, scale: 0.9 },
      ].map((l, i) => (
        <mesh
          key={`leaf-${i}`}
          castShadow
          position={l.pos}
          rotation={l.rot}
          scale={l.scale}
        >
          <circleGeometry args={[0.22, 8]} />
          <meshStandardMaterial
            color="#3f7a3a"
            roughness={0.7}
            side={2 /* DoubleSide */}
          />
        </mesh>
      ))}
    </group>
  )
}
