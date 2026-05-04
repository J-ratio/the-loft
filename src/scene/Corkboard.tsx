/**
 * Timeline anchor (v1) surface: a single corkboard on the back wall above the desk.
 * v0 purpose: visual density and "you live here" signal. Not yet clickable.
 *
 * Brief: "A Corkboard on the wall with photos connected by red string."
 * We skip yarn in v0 per design; photos-only.
 */

type Photo = {
  /** Position ON the board, relative to board center. x = left-right, y = up-down. */
  x: number
  y: number
  w: number
  h: number
  rotDeg: number
  /** Photo fill color — warm pastels suggestive of "happy moments" */
  fill: string
}

const PHOTOS: Photo[] = [
  { x: -0.55, y: 0.18, w: 0.2, h: 0.24, rotDeg: -8, fill: '#d68a5a' },
  { x: -0.25, y: 0.22, w: 0.18, h: 0.22, rotDeg: 5, fill: '#f0c58a' },
  { x: 0.05, y: 0.18, w: 0.22, h: 0.2, rotDeg: -3, fill: '#c4a978' },
  { x: 0.35, y: 0.23, w: 0.2, h: 0.24, rotDeg: 9, fill: '#e89a7a' },
  { x: 0.63, y: 0.17, w: 0.18, h: 0.22, rotDeg: -6, fill: '#d4a94b' },
  { x: -0.55, y: -0.18, w: 0.18, h: 0.22, rotDeg: 7, fill: '#8aa6c2' },
  { x: -0.22, y: -0.2, w: 0.22, h: 0.2, rotDeg: -4, fill: '#b89a68' },
  { x: 0.12, y: -0.22, w: 0.2, h: 0.24, rotDeg: 6, fill: '#d68a5a' },
  { x: 0.42, y: -0.18, w: 0.18, h: 0.22, rotDeg: -9, fill: '#f0d68a' },
  { x: 0.68, y: -0.2, w: 0.16, h: 0.2, rotDeg: 3, fill: '#c4756a' },
]

export function Corkboard() {
  // Back wall front face at z = -3.45. Board center: (0, 1.95, -3.43), 1.8w × 0.9h.
  const boardW = 1.8
  const boardH = 0.9
  const boardZ = -3.43
  const boardY = 1.95

  return (
    <group position={[0, boardY, boardZ]}>
      {/* Wooden frame */}
      <mesh>
        <planeGeometry args={[boardW + 0.06, boardH + 0.06]} />
        <meshStandardMaterial color="#3a261a" roughness={0.7} />
      </mesh>
      {/* Cork surface */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[boardW, boardH]} />
        <meshStandardMaterial color="#b88a5a" roughness={0.95} />
      </mesh>

      {/* Pinned polaroid photos */}
      {PHOTOS.map((p, i) => (
        <group
          key={`ph-${i}`}
          position={[p.x, p.y, 0.004]}
          rotation={[0, 0, (p.rotDeg * Math.PI) / 180]}
        >
          {/* White polaroid border */}
          <mesh>
            <planeGeometry args={[p.w + 0.02, p.h + 0.04]} />
            <meshStandardMaterial color="#f5ecd8" roughness={0.9} />
          </mesh>
          {/* Photo fill (offset up for the polaroid's lower caption band) */}
          <mesh position={[0, 0.01, 0.001]}>
            <planeGeometry args={[p.w, p.h - 0.02]} />
            <meshStandardMaterial color={p.fill} roughness={0.9} />
          </mesh>
          {/* Pushpin in the top center of each photo */}
          <mesh position={[0, p.h / 2, 0.008]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshStandardMaterial color="#c8342a" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
