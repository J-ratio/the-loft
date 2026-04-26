/**
 * Framed pictures on the back wall (above desk area, left of window) and
 * on the side wall. Rectangles of varied sizes with dark frames and warm-toned
 * fill colors — reads as "posters/photos" without needing textures.
 */

type FrameSpec = {
  pos: [number, number, number]
  size: [number, number]
  fill: string
  rotY?: number
}

// Left of window on back wall — cluster of 4 frames
const BACK_WALL: FrameSpec[] = [
  { pos: [-1.8, 2.0, -2.48], size: [0.48, 0.36], fill: '#d68a5a' },
  { pos: [-1.15, 1.85, -2.48], size: [0.35, 0.48], fill: '#6b8aa8' },
  { pos: [-0.5, 2.0, -2.48], size: [0.28, 0.28], fill: '#d4a94b' },
  { pos: [-1.45, 1.25, -2.48], size: [0.38, 0.26], fill: '#c44a5e' },
]

// On the side wall (left wall, facing camera) — smaller cluster
// Side wall is at x=-2.5, rotated 90° so we orient frames accordingly
const SIDE_WALL: FrameSpec[] = [
  { pos: [-2.48, 2.2, 0.4], size: [0.3, 0.22], fill: '#8a5a3a', rotY: Math.PI / 2 },
  { pos: [-2.48, 2.1, 0.9], size: [0.24, 0.32], fill: '#4a6b3a', rotY: Math.PI / 2 },
]

function Frame({ pos, size, fill, rotY = 0 }: FrameSpec) {
  const [w, h] = size
  const borderWidth = 0.02
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* Dark frame backing */}
      <mesh>
        <planeGeometry args={[w + borderWidth * 2, h + borderWidth * 2]} />
        <meshStandardMaterial color="#2a1a12" roughness={0.6} />
      </mesh>
      {/* Picture fill — slightly in front */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={fill} roughness={0.85} />
      </mesh>
    </group>
  )
}

export function WallArt() {
  return (
    <group>
      {[...BACK_WALL, ...SIDE_WALL].map((f, i) => (
        <Frame key={i} {...f} />
      ))}
    </group>
  )
}
