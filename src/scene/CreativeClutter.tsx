/**
 * Creative clutter around the desk. Desk center at (0, 0, -3.15), top at y=0.725.
 * Positions are world coords.
 */
export function CreativeClutter() {
  const deskY = 0.755
  const deskX = 0
  const deskZ = -3.15

  return (
    <group>
      {/* Scattered paper (right side of desk, in front of lamp) */}
      {[
        { x: 0.35, z: 0.0, rot: 0.15, color: '#f5ecd8' },
        { x: 0.42, z: 0.12, rot: -0.22, color: '#f5ecd8' },
      ].map((s, i) => (
        <mesh
          key={`paper-${i}`}
          position={[deskX + s.x, deskY + 0.003 + i * 0.002, deskZ + s.z]}
          rotation={[-Math.PI / 2, 0, s.rot]}
        >
          <planeGeometry args={[0.13, 0.18]} />
          <meshStandardMaterial color={s.color} roughness={0.9} />
        </mesh>
      ))}

      {/* Sticky notes on desk */}
      {[
        { x: -0.3, z: -0.08, color: '#ffe66a', rot: 0.1 },
        { x: -0.2, z: 0.2, color: '#ff9ab8', rot: -0.15 },
        { x: -0.42, z: 0.15, color: '#a8e89c', rot: 0.25 },
      ].map((n, i) => (
        <mesh
          key={`note-${i}`}
          position={[deskX + n.x, deskY + 0.003, deskZ + n.z]}
          rotation={[-Math.PI / 2, 0, n.rot]}
        >
          <planeGeometry args={[0.06, 0.06]} />
          <meshStandardMaterial color={n.color} roughness={0.9} />
        </mesh>
      ))}

      {/* Rubik's cube */}
      <group position={[deskX + 0.3, deskY + 0.04, deskZ - 0.22]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#e8c842" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.036]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#c4322a" roughness={0.7} />
        </mesh>
        <mesh position={[0.036, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#2a6bc4" roughness={0.7} />
        </mesh>
      </group>

      {/* Headphones */}
      <group position={[deskX - 0.32, deskY + 0.05, deskZ + 0.2]} rotation={[0, 0.3, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.1, 0.01, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh castShadow position={[-0.095, -0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        <mesh castShadow position={[0.095, -0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>

      {/* Crumpled paper on the floor */}
      <mesh castShadow position={[-0.6, 0.05, -1.9]}>
        <dodecahedronGeometry args={[0.05, 0]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0.7, 0.04, -1.6]}>
        <dodecahedronGeometry args={[0.04, 0]} />
        <meshStandardMaterial color="#f5ecd8" roughness={0.95} />
      </mesh>

    </group>
  )
}
