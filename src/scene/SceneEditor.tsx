import { OrbitControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useEditorStore } from './Editable'

/**
 * Scene editor mounted when ?edit=1.
 *
 * - Click any <Editable> prop to select it — gizmo attaches.
 * - W/E/R toggles translate/rotate/scale modes.
 * - ESC deselects.
 * - WASD/QE + mouse orbit still work for navigation (like debug mode).
 * - Final transform values are shown in the HUD overlay (see EditorHud).
 *
 * Positions/rotations aren't written back to source automatically — copy
 * the HUD snippet into the relevant component file.
 */

const MOVE_SPEED = 3.0
const keys = new Set<string>()

export function SceneEditor() {
  const { camera } = useThree()
  const orbit = useRef<OrbitControlsImpl>(null!)
  const forward = useRef(new Vector3())
  const right = useRef(new Vector3())
  const up = useRef(new Vector3(0, 1, 0))
  const delta = useRef(new Vector3())
  const selected = useEditorStore((s) => s.selected)
  const select = useEditorStore((s) => s.select)
  const registry = useEditorStore((s) => s.registry)
  const [mode, setMode] = useState<'translate' | 'rotate' | 'scale'>('translate')

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      keys.add(k)
      if (k === 'escape') select(null)
      if (!selected) return
      // Gizmo mode switches use 1/2/3 so they don't collide with WASD nav.
      if (k === '1') setMode('translate')
      if (k === '2') setMode('rotate')
      if (k === '3') setMode('scale')
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      keys.clear()
    }
  }, [selected, select])

  useFrame((_, dt) => {
    const controls = orbit.current
    if (!controls) return

    const speed = MOVE_SPEED * dt * (keys.has('shift') ? 2 : 1)
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
      controls.target.add(delta.current)
      controls.update()
    }
  })

  const selectedObj = selected ? registry.get(selected) : null

  return (
    <>
      <OrbitControls
        ref={orbit}
        makeDefault
        minDistance={0.3}
        maxDistance={30}
        enableDamping
        dampingFactor={0.08}
        enablePan
      />
      {selectedObj && (
        <TransformControls
          object={selectedObj}
          mode={mode}
          // Pause orbit while dragging the gizmo.
          onMouseDown={() => {
            if (orbit.current) orbit.current.enabled = false
          }}
          onMouseUp={() => {
            if (orbit.current) orbit.current.enabled = true
          }}
        />
      )}
    </>
  )
}
