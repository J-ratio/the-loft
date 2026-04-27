import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import type { Vector3Tuple } from 'three'

/**
 * Framed wall art — decorative pictures hung on the walls. The Corkboard is
 * the Timeline anchor (separate component). These are just "you live here"
 * signals: framed pictures flanking the corkboard + one on the right wall.
 *
 * Uses Poly Haven hanging_picture_frame_01/02 (CC0).
 */

type Spec = {
  asset: 'frame_01' | 'frame_02'
  position: Vector3Tuple
  /** Euler rotation in radians */
  rotation: Vector3Tuple
}

const SPECS: Spec[] = [
  // Back wall, right of corkboard (between corkboard and window-side wall)
  { asset: 'frame_01', position: [1.25, 2.0, -3.49], rotation: [0, 0, 0] },
  // Back wall, left of corkboard
  { asset: 'frame_02', position: [-1.25, 2.0, -3.49], rotation: [0, 0, 0] },
  // Right wall, forward-facing section (-X direction), above sill
  { asset: 'frame_02', position: [1.74, 2.4, -0.3], rotation: [0, -Math.PI / 2, 0] },
]

function FramedPicture({ spec }: { spec: Spec }) {
  const { scene } = useGLTF(`/models/${spec.asset}.glb`)
  // Clone so multiple uses of the same asset don't share the same node tree
  const cloned = useMemo(() => scene.clone(true), [scene])
  return <primitive object={cloned} position={spec.position} rotation={spec.rotation} />
}

export function WallArt() {
  return (
    <group>
      {SPECS.map((s, i) => (
        <FramedPicture key={i} spec={s} />
      ))}
    </group>
  )
}

useGLTF.preload('/models/frame_01.glb')
useGLTF.preload('/models/frame_02.glb')
