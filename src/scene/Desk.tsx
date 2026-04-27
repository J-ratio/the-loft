import { useGLTF } from '@react-three/drei'
import { deskAnchor } from '../anchors'

/**
 * Desk against the back wall. Uses Sketchfab desk_set (wooden writing desk
 * with baked-in props — height normalized to 0.78m).
 *
 * The clickable Blog anchor is the Notebook component, not the desk itself.
 */
export function Desk() {
  const { scene } = useGLTF('/models/desk_set.glb')
  const [x, , z] = deskAnchor.position
  return (
    <group position={[x, 0, z]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/desk_set.glb')
