import { useGLTF } from '@react-three/drei'

/**
 * Dream catcher hanging on the left wall.
 * Left wall at x=-1.75, slightly in front of wall. Hangs from ceiling-ish.
 */
export function DreamCatcher() {
  const { scene } = useGLTF('/models/dreamcatcher.glb')
  return (
    <primitive
      object={scene}
      position={[-1.65, 2.3, -1.0]}
      rotation={[0, Math.PI / 2, 0]}
    />
  )
}

useGLTF.preload('/models/dreamcatcher.glb')
