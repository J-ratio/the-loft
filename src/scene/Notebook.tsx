import { useState } from 'react'
import { useLoftStore } from '../state/store'

export const NOTEBOOK_POS: [number, number, number] = [0, 0.852, -3.15]

/**
 * Vintage leather journal on the desk — the Blog anchor.
 * Dark brown leather with strap and brass clasp.
 */
export function Notebook() {
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const setNotebookOpen = useLoftStore((s) => s.setNotebookOpen)
  const [hovered, setHovered] = useState(false)

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (activeAnchor !== 'desk') {
      setActiveAnchor('desk')
    } else {
      setNotebookOpen(true)
    }
  }

  return (
    <group rotation={[0, 0.1, 0]}>
      {/* Click target */}
      <mesh
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
        onClick={handleClick}
      >
        <planeGeometry args={[0.3, 0.35]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>

      {/* Main leather body — the whole journal as a box */}
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[0.18, 0.016, 0.25]} />
        <meshStandardMaterial
          color={hovered ? '#6b4226' : '#4a2a16'}
          roughness={0.7}
          metalness={0.02}
        />
      </mesh>

      {/* Page edges — thin cream line visible from the side */}
      <mesh position={[0.005, 0.008, 0]}>
        <boxGeometry args={[0.155, 0.010, 0.23]} />
        <meshStandardMaterial color="#f0e8d4" roughness={0.95} />
      </mesh>

      {/* Top cover (slightly raised, darker leather) */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 0.25]} />
        <meshStandardMaterial
          color={hovered ? '#5a3520' : '#3d2010'}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* Emboss border on cover */}
      <mesh position={[0, 0.0155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 0.21]} />
        <meshStandardMaterial color="#4a2818" roughness={0.7} />
      </mesh>

      {/* Strap across */}
      <mesh position={[0.05, 0.017, 0]}>
        <boxGeometry args={[0.012, 0.003, 0.25]} />
        <meshStandardMaterial color="#2a1408" roughness={0.6} />
      </mesh>

      {/* Brass clasp */}
      <mesh position={[0.05, 0.018, -0.09]}>
        <boxGeometry args={[0.018, 0.004, 0.014]} />
        <meshStandardMaterial color="#c4964a" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Spine (darker strip on left edge) */}
      <mesh position={[-0.088, 0.008, 0]}>
        <boxGeometry args={[0.012, 0.018, 0.25]} />
        <meshStandardMaterial color="#2a1408" roughness={0.7} />
      </mesh>
    </group>
  )
}
