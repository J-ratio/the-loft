import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

const MOVE_SPEED = 3.0 // units per second
const keys = new Set<string>()

/**
 * Debug free-roam rig. Mounted only when ?debug=1.
 *
 * - OrbitControls: left-drag to orbit, right-drag to pan, wheel to zoom.
 * - WASD: move camera horizontally relative to facing.
 * - QE: move camera down / up vertically.
 * - Shift: sprint (2x speed).
 *
 * The critical bit: OrbitControls keeps the camera aimed at a fixed `target`
 * point. When we move camera.position with WASD, we must move the target by
 * the same delta — otherwise the camera rotates around the old target in an
 * arc instead of moving forward in a straight line.
 */
export function DebugRig() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const forward = useRef(new Vector3())
  const right = useRef(new Vector3())
  const up = useRef(new Vector3(0, 1, 0))
  const delta = useRef(new Vector3())

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      keys.add(e.key.toLowerCase())
    }
    const release = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase())
    }
    const onBlur = () => keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', release)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', release)
      window.removeEventListener('blur', onBlur)
      keys.clear()
    }
  }, [])

  useFrame((_, dt) => {
    const controls = controlsRef.current
    if (!controls) return

    const speed = MOVE_SPEED * dt * (keys.has('shift') ? 2 : 1)

    // Forward = camera direction flattened to XZ plane (no vertical drift from WS)
    camera.getWorldDirection(forward.current)
    forward.current.y = 0
    if (forward.current.lengthSq() < 1e-6) return
    forward.current.normalize()

    right.current.crossVectors(forward.current, up.current).normalize()

    delta.current.set(0, 0, 0)
    if (keys.has('w')) delta.current.addScaledVector(forward.current, speed)
    if (keys.has('s')) delta.current.addScaledVector(forward.current, -speed)
    if (keys.has('d')) delta.current.addScaledVector(right.current, speed)
    if (keys.has('a')) delta.current.addScaledVector(right.current, -speed)
    if (keys.has('e')) delta.current.y += speed
    if (keys.has('q')) delta.current.y -= speed

    if (delta.current.lengthSq() > 0) {
      camera.position.add(delta.current)
      // Also move the orbit target by the same amount so the camera stays
      // pointed the same direction (straight-line translation, not an arc).
      controls.target.add(delta.current)
      controls.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={0.3}
      maxDistance={30}
      enableDamping
      dampingFactor={0.08}
      enablePan
    />
  )
}
