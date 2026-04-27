import { useGLTF } from '@react-three/drei'
import { useState } from 'react'
import { useLoftStore } from '../state/store'
import { deskAnchor } from '../anchors'

/**
 * Desk against the back wall. Uses Poly Haven WoodenTable_01 (0.78m).
 * A separate invisible hitbox over the desk top serves as the clickable
 * anchor — we can't raycast easily against a loaded GLTF mesh tree, and
 * brief says the desk itself is the Blog anchor.
 */
export function Desk() {
  const setActiveAnchor = useLoftStore((s) => s.setActiveAnchor)
  const [hovered, setHovered] = useState(false)
  const { scene } = useGLTF('/models/desk.glb')

  const [x, , z] = deskAnchor.position

  return (
    <group position={[x, 0, z]}>
      <primitive object={scene} />

      {/* Invisible hitbox on the desk surface — the clickable anchor.
          Sits slightly above where the desk top should be so clicks land here. */}
      <mesh
        position={[0, 0.78, 0]}
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
        <boxGeometry args={[1.4, 0.02, 0.7]} />
        <meshStandardMaterial
          transparent
          opacity={hovered ? 0.15 : 0}
          color="#ffd488"
          emissive="#ffd488"
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/desk.glb')
