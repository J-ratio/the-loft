import type { Vector3Tuple } from 'three'

type Props = {
  position?: Vector3Tuple
  rotation?: Vector3Tuple
}

// Warm palette for book spines — varied heights/widths create a "row of books" read.
const BOOK_COLORS = [
  '#8b3a2a', '#c97a3e', '#2d4a3a', '#d4a94b', '#6b3e52',
  '#4a3a2e', '#a85e3e', '#3a5566', '#b84a3a', '#d6b47a',
  '#7a4a8b', '#3e5a2a', '#c44a5e', '#d89a5e', '#4a2a3a',
]

function BookRow({ y, count }: { y: number; count: number }) {
  let x = -0.55
  const books: JSX.Element[] = []
  for (let i = 0; i < count; i++) {
    const w = 0.045 + Math.random() * 0.03
    const h = 0.22 + Math.random() * 0.08
    const color = BOOK_COLORS[(i * 3) % BOOK_COLORS.length]
    const tilt = i === count - 1 ? 0.15 : 0 // last book leans
    books.push(
      <mesh
        key={`${y}-${i}`}
        castShadow
        position={[x + w / 2, y + h / 2, 0]}
        rotation={[0, 0, tilt]}
      >
        <boxGeometry args={[w, h, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>,
    )
    x += w + 0.003
  }
  return <>{books}</>
}

/**
 * Tall industrial bookshelf — wooden shelves, black metal frame, populated with
 * stylized book rows. Against the left wall.
 */
export function Bookshelf({
  position = [-2.35, 0, -0.4],
  rotation = [0, Math.PI / 2, 0],
}: Props) {
  const shelfColor = '#6b4e32'
  const frameColor = '#1a1a1a'

  return (
    <group position={position} rotation={rotation}>
      {/* 5 wooden shelves */}
      {[0.2, 0.75, 1.3, 1.85, 2.4].map((y, i) => (
        <mesh key={`shelf-${i}`} receiveShadow castShadow position={[0, y, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.28]} />
          <meshStandardMaterial color={shelfColor} roughness={0.8} />
        </mesh>
      ))}

      {/* Vertical frame posts — 4 corners */}
      {[
        [-0.6, 1.3, -0.13],
        [0.6, 1.3, -0.13],
        [-0.6, 1.3, 0.13],
        [0.6, 1.3, 0.13],
      ].map(([x, y, z], i) => (
        <mesh key={`post-${i}`} castShadow position={[x, y, z]}>
          <boxGeometry args={[0.03, 2.5, 0.03]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.5} />
        </mesh>
      ))}

      {/* Books on 4 of 5 shelves (top shelf left empty for trinkets) */}
      <BookRow y={0.22} count={14} />
      <BookRow y={0.77} count={12} />
      <BookRow y={1.32} count={15} />
      <BookRow y={1.87} count={10} />

      {/* A few trinkets on top shelf: small colored cubes */}
      {[
        { x: -0.3, color: '#d4a94b', h: 0.12 },
        { x: -0.15, color: '#6b3e52', h: 0.08 },
        { x: 0.1, color: '#3e5a2a', h: 0.14 },
        { x: 0.35, color: '#c97a3e', h: 0.1 },
      ].map((t, i) => (
        <mesh key={`trinket-${i}`} castShadow position={[t.x, 2.42 + t.h / 2, 0]}>
          <boxGeometry args={[0.08, t.h, 0.08]} />
          <meshStandardMaterial color={t.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}
