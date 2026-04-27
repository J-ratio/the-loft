import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
}

/**
 * Stylized Monstera on the RIGHT-wall window sill.
 * Sill y = 0.77, x = +1.65 (just inside the window frame).
 * Leaves spread toward -X (into the room) to catch the sun.
 */
export function Plant({ position = [1.5, 0.77, -0.6] }: Props) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.34, 16]} />
        <meshStandardMaterial color="#a65b3d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
        <meshStandardMaterial color="#2d1d12" roughness={1} />
      </mesh>

      {/* Stems */}
      {[
        { rot: 0.2, lean: [-0.05, 0, 0.02] as Vector3Tuple },
        { rot: -0.15, lean: [0.04, 0, 0.03] as Vector3Tuple },
        { rot: 0.08, lean: [-0.02, 0, -0.04] as Vector3Tuple },
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

      {/* Leaves — stretched outward to read as Monstera reaching for the window */}
      {[
        { pos: [-0.3, 0.75, 0.15] as Vector3Tuple, rot: [0.1, -0.4, 0.6] as Vector3Tuple, scale: 1.2 },
        { pos: [0.25, 0.82, 0.12] as Vector3Tuple, rot: [0.05, 0.6, -0.5] as Vector3Tuple, scale: 1.1 },
        { pos: [-0.2, 0.98, -0.15] as Vector3Tuple, rot: [-0.1, -0.3, 0.3] as Vector3Tuple, scale: 1.25 },
        { pos: [0.22, 0.62, -0.08] as Vector3Tuple, rot: [0.3, 0.4, 0.5] as Vector3Tuple, scale: 0.95 },
        { pos: [-0.35, 0.55, -0.05] as Vector3Tuple, rot: [0.4, -0.9, -0.4] as Vector3Tuple, scale: 0.9 },
        { pos: [0.05, 1.02, 0.05] as Vector3Tuple, rot: [-0.15, 0, 0.1] as Vector3Tuple, scale: 1.05 },
      ].map((l, i) => (
        <mesh
          key={`leaf-${i}`}
          castShadow
          position={l.pos}
          rotation={l.rot}
          scale={l.scale}
        >
          <circleGeometry args={[0.23, 10]} />
          <meshStandardMaterial color="#3f7a3a" roughness={0.7} side={2} />
        </mesh>
      ))}
    </group>
  )
}
