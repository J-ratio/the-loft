import { useState } from 'react'
import { useLoftStore } from '../state/store'
import { deskAnchor } from '../anchors'

/**
 * Desk against the back wall. The notebook is the clickable anchor surface.
 * Desk faces +Z (toward camera). Chair will sit on +Z side of it.
 */
export function Desk() {
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const [hovered, setHovered] = useState(false)

  const [x, , z] = deskAnchor.position

  return (
    <group position={[x, 0, z]}>
      {/* Desk top */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.7]} />
        <meshStandardMaterial color="#8a6b4a" />
      </mesh>

      {/* Desk legs */}
      {[
        [-0.7, 0.35, -0.3],
        [0.7, 0.35, -0.3],
        [-0.7, 0.35, 0.3],
        [0.7, 0.35, 0.3],
      ].map(([lx, ly, lz], i) => (
        <mesh key={i} castShadow position={[lx, ly, lz]}>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
      ))}

      {/* Notebook — the clickable anchor (on desk, slightly forward toward camera) */}
      <mesh
        castShadow
        position={[0, 0.76, 0.18]}
        rotation={[0, 0.08, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setActiveAnchor('desk')
        }}
      >
        <boxGeometry args={[0.32, 0.025, 0.24]} />
        <meshStandardMaterial
          color={hovered ? '#f5e9c6' : '#e8d9ae'}
          emissive={hovered ? '#d4b870' : '#000000'}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
    </group>
  )
}
