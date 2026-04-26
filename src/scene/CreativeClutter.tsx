/**
 * Group of small "creative clutter" props for light/INFP mode:
 * pencil cup, pencils, scattered paper, Rubik's cube, headphones,
 * crumpled paper on the floor, sticky notes on the desk.
 *
 * Design law #6: clutter is a feature, not a bug. This component is the
 * dedicated home for it — grouping makes light/dark swaps clean later.
 */
export function CreativeClutter() {
  const deskY = 0.755 // top of desk slab
  const deskCenter: [number, number, number] = [0, 0, -1.2]

  return (
    <group position={deskCenter}>
      {/* ---- Pencil cup with pencils (left-front of desk) ---- */}
      <group position={[-0.55, deskY + 0.02, 0.15]}>
        {/* Cup body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.12, 16]} />
          <meshStandardMaterial color="#d4a67a" roughness={0.7} />
        </mesh>
        {/* Pencils sticking up at angles */}
        {[
          { x: 0.01, z: 0.01, tilt: [0.1, 0, 0.05], color: '#d4a94b', h: 0.18 },
          { x: -0.015, z: -0.01, tilt: [0, 0, -0.08], color: '#8b3a2a', h: 0.16 },
          { x: 0.02, z: -0.02, tilt: [-0.05, 0, 0.1], color: '#3e5a2a', h: 0.2 },
          { x: -0.01, z: 0.02, tilt: [0.03, 0, 0], color: '#4a3a2e', h: 0.17 },
        ].map((p, i) => (
          <mesh
            key={`pencil-${i}`}
            castShadow
            position={[p.x, 0.05 + p.h / 2, p.z]}
            rotation={p.tilt as [number, number, number]}
          >
            <cylinderGeometry args={[0.005, 0.005, p.h, 6]} />
            <meshStandardMaterial color={p.color} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ---- Scattered paper sheets (right side of desk) ---- */}
      {[
        { x: 0.38, z: -0.08, rot: 0.15, color: '#f5ecd8' },
        { x: 0.42, z: 0.05, rot: -0.22, color: '#f5ecd8' },
        { x: 0.55, z: -0.15, rot: 0.4, color: '#fffaf0' },
      ].map((s, i) => (
        <mesh
          key={`paper-${i}`}
          position={[s.x, deskY + 0.003 + i * 0.002, s.z]}
          rotation={[-Math.PI / 2, 0, s.rot]}
        >
          <planeGeometry args={[0.13, 0.18]} />
          <meshStandardMaterial color={s.color} roughness={0.9} />
        </mesh>
      ))}

      {/* ---- Sticky notes on desk (small colored squares) ---- */}
      {[
        { x: -0.3, z: -0.08, color: '#ffe66a', rot: 0.1 },
        { x: -0.22, z: 0.12, color: '#ff9ab8', rot: -0.15 },
        { x: -0.38, z: 0.05, color: '#a8e89c', rot: 0.25 },
      ].map((n, i) => (
        <mesh
          key={`note-${i}`}
          position={[n.x, deskY + 0.003, n.z]}
          rotation={[-Math.PI / 2, 0, n.rot]}
        >
          <planeGeometry args={[0.06, 0.06]} />
          <meshStandardMaterial color={n.color} roughness={0.9} />
        </mesh>
      ))}

      {/* ---- Rubik's cube (right-back of desk) ---- */}
      <group position={[0.35, deskY + 0.04, -0.2]} rotation={[0, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>
        {/* Colored stickers — one small plane per visible face per color band. */}
        {/* Top (yellow) */}
        <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#e8c842" roughness={0.7} />
        </mesh>
        {/* Front (red) */}
        <mesh position={[0, 0, 0.036]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#c4322a" roughness={0.7} />
        </mesh>
        {/* Right (blue) */}
        <mesh position={[0.036, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.065, 0.065]} />
          <meshStandardMaterial color="#2a6bc4" roughness={0.7} />
        </mesh>
      </group>

      {/* ---- Headphones on the desk (simplified) ---- */}
      <group position={[-0.3, deskY + 0.05, -0.2]} rotation={[0, 0.3, 0]}>
        {/* Headband */}
        <mesh castShadow>
          <torusGeometry args={[0.1, 0.01, 6, 16, Math.PI]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        {/* Left earcup */}
        <mesh castShadow position={[-0.095, -0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Right earcup */}
        <mesh castShadow position={[0.095, -0.03, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      </group>

      {/* ---- Crumpled paper on the floor (in front of desk) ---- */}
      <mesh castShadow position={[-0.7, -0.69, 0.8]}>
        <dodecahedronGeometry args={[0.045, 0]} />
        <meshStandardMaterial color="#f0e8d0" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0.8, -0.71, 0.9]}>
        <dodecahedronGeometry args={[0.035, 0]} />
        <meshStandardMaterial color="#f5ecd8" roughness={0.95} />
      </mesh>

      {/* ---- Backpack leaning against desk (right leg) ---- */}
      <group position={[0.88, -0.45, 0.3]} rotation={[0, -0.3, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.3, 0.14]} />
          <meshStandardMaterial color="#3a5566" roughness={0.85} />
        </mesh>
        {/* Top flap */}
        <mesh castShadow position={[0, 0.155, 0]}>
          <boxGeometry args={[0.2, 0.04, 0.13]} />
          <meshStandardMaterial color="#2a3e4a" roughness={0.85} />
        </mesh>
        {/* Front pocket */}
        <mesh position={[0, -0.04, 0.072]}>
          <boxGeometry args={[0.14, 0.12, 0.012]} />
          <meshStandardMaterial color="#2a3e4a" roughness={0.85} />
        </mesh>
      </group>
    </group>
  )
}
