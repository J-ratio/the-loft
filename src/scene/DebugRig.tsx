import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'

const MOVE_SPEED = 3.0 // units per second
const keys = new Set<string>()

/**
 * Debug free-roam rig. Mounted only when ?debug=1.
 *
 * - OrbitControls: left-drag to orbit, right-drag to pan, wheel to zoom.
 * - WASD: move camera horizontally relative to its facing.
 * - QE: move camera down / up vertically.
 * - Shift: sprint (2x speed).
 *
 * This only exists for builder use. Production users never hit this code
 * because ?debug=1 is not in their URL.
 */
export function DebugRig() {
  const { camera } = useThree()
  const forward = useRef(new Vector3())
  const right = useRef(new Vector3())
  const up = useRef(new Vector3(0, 1, 0))

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase())
    }
    const release = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', release)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', release)
      keys.clear()
    }
  }, [])

  useFrame((_, delta) => {
    const speed = MOVE_SPEED * delta * (keys.has('shift') ? 2 : 1)

    // Forward = camera direction flattened to XZ plane
    camera.getWorldDirection(forward.current)
    forward.current.y = 0
    forward.current.normalize()

    right.current.crossVectors(forward.current, up.current).normalize()

    if (keys.has('w')) camera.position.addScaledVector(forward.current, speed)
    if (keys.has('s')) camera.position.addScaledVector(forward.current, -speed)
    if (keys.has('d')) camera.position.addScaledVector(right.current, speed)
    if (keys.has('a')) camera.position.addScaledVector(right.current, -speed)
    if (keys.has('e')) camera.position.y += speed
    if (keys.has('q')) camera.position.y -= speed
  })

  return (
    <OrbitControls
      makeDefault
      // Free orbit, reasonable limits so the camera can't escape the scene entirely.
      minDistance={0.3}
      maxDistance={20}
      enableDamping
      dampingFactor={0.08}
      // Pan with right-mouse; WASD supplements.
      enablePan
    />
  )
}
