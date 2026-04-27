/**
 * Upper-loft room — narrow and long.
 *
 * Dimensions:
 *   X width  = 3.5  (x ∈ [-1.75, +1.75])
 *   Z depth  = 5.0  (z ∈ [-3.5,  +1.5])  ← back wall at z=-3.5
 *   Y height = 3.0
 *
 * Walls:
 *   back   (z=-3.5) solid — hosts desk + Timeline corkboard
 *   left   (x=-1.75) solid
 *   right  (x=+1.75) has a window opening: x-plane, z ∈ [-2.0, 0], y ∈ [0.7, 2.3]
 *                    (so 2.0 wide × 1.6 tall, centered at z=-1.0, y=1.5)
 *   front  (z=+1.5) no wall (camera side)
 */
export function Room() {
  const wallColor = '#f0e2c4'
  const sideWallColor = '#e8d9bc'
  const floorColor = '#b08a5c'

  // Window opening bounds on right wall
  const WIN_Z_MIN = -2.0
  const WIN_Z_MAX = 0.0
  const WIN_Y_MIN = 0.7
  const WIN_Y_MAX = 2.3

  return (
    <group>
      {/* ---- Floor ---- */}
      <mesh receiveShadow position={[0, 0, -1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 5.0]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} />
      </mesh>

      {/* ---- Back wall (solid, z = -3.5) ---- */}
      <mesh receiveShadow position={[0, 1.5, -3.5]}>
        <planeGeometry args={[3.5, 3.0]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* ---- Left wall (solid, x = -1.75) ---- */}
      <mesh receiveShadow position={[-1.75, 1.5, -1.0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.0, 3.0]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.95} />
      </mesh>

      {/* ---- Right wall (x = +1.75), built around a window hole ---- */}
      {/* Above window */}
      <mesh
        receiveShadow
        position={[1.75, (WIN_Y_MAX + 3.0) / 2, -1.0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[5.0, 3.0 - WIN_Y_MAX]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.95} />
      </mesh>
      {/* Below window */}
      <mesh
        receiveShadow
        position={[1.75, WIN_Y_MIN / 2, -1.0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[5.0, WIN_Y_MIN]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.95} />
      </mesh>
      {/* Behind window (z < WIN_Z_MIN, between -3.5 and -2.0) */}
      <mesh
        receiveShadow
        position={[1.75, (WIN_Y_MIN + WIN_Y_MAX) / 2, (-3.5 + WIN_Z_MIN) / 2]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[Math.abs(-3.5 - WIN_Z_MIN), WIN_Y_MAX - WIN_Y_MIN]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.95} />
      </mesh>
      {/* In front of window (z > WIN_Z_MAX, between 0 and 1.5) */}
      <mesh
        receiveShadow
        position={[1.75, (WIN_Y_MIN + WIN_Y_MAX) / 2, (WIN_Z_MAX + 1.5) / 2]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[1.5 - WIN_Z_MAX, WIN_Y_MAX - WIN_Y_MIN]} />
        <meshStandardMaterial color={sideWallColor} roughness={0.95} />
      </mesh>

      {/* ---- Window frame — thin dark rectangles outlining the opening ---- */}
      {(() => {
        const x = 1.745
        const frame: { pos: [number, number, number]; size: [number, number] }[] = [
          // top (horizontal along Z)
          { pos: [x, WIN_Y_MAX, -1.0], size: [2.05, 0.05] },
          // bottom (sill)
          { pos: [x, WIN_Y_MIN, -1.0], size: [2.05, 0.05] },
          // near vertical
          { pos: [x, 1.5, WIN_Z_MAX], size: [0.05, 1.65] },
          // far vertical
          { pos: [x, 1.5, WIN_Z_MIN], size: [0.05, 1.65] },
          // horizontal mullion
          { pos: [x, 1.5, -1.0], size: [2.0, 0.03] },
          // vertical mullion
          { pos: [x, 1.5, -1.0], size: [0.03, 1.6] },
        ]
        return frame.map((f, i) => (
          <mesh key={`wf-${i}`} position={f.pos} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={f.size} />
            <meshStandardMaterial color="#2a1a10" roughness={0.7} />
          </mesh>
        ))
      })()}

      {/* Window sill (a thicker ledge inside the room, serves as the Future anchor surface) */}
      <mesh castShadow position={[1.65, WIN_Y_MIN, -1.0]}>
        <boxGeometry args={[0.2, 0.05, 2.05]} />
        <meshStandardMaterial color="#d8c49a" roughness={0.85} />
      </mesh>

      {/* ---- Ceiling ---- */}
      <mesh position={[0, 3, -1.0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 5.0]} />
        <meshStandardMaterial color="#e8d4a8" roughness={1} />
      </mesh>

      {/* ---- Baseboards ---- */}
      {/* Back */}
      <mesh position={[0, 0.05, -3.49]}>
        <boxGeometry args={[3.5, 0.1, 0.02]} />
        <meshStandardMaterial color="#4a3220" roughness={0.8} />
      </mesh>
      {/* Left */}
      <mesh position={[-1.74, 0.05, -1.0]}>
        <boxGeometry args={[0.02, 0.1, 5.0]} />
        <meshStandardMaterial color="#4a3220" roughness={0.8} />
      </mesh>
      {/* Right, below window only */}
      <mesh position={[1.74, 0.05, -1.0]}>
        <boxGeometry args={[0.02, 0.1, 5.0]} />
        <meshStandardMaterial color="#4a3220" roughness={0.8} />
      </mesh>
    </group>
  )
}
