import { OrbitControls, TransformControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useEditorStore } from './Editable'

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

  // Refs so the once-mounted listeners can read current values without re-binding.
  const selectedRef = useRef(selected)
  const selectRef = useRef(select)
  selectedRef.current = selected
  selectRef.current = select

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      keys.add(k)
      if (k === 'escape') selectRef.current(null)
      if (!selectedRef.current) return
      if (k === '1') setMode('translate')
      if (k === '2') setMode('rotate')
      if (k === '3') setMode('scale')
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
    // Clear keys when window loses focus — otherwise holding W then
    // alt-tabbing leaves it stuck.
    const onBlur = () => keys.clear()

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      keys.clear()
    }
  }, [])

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
        enableDamping={false}
        rotateSpeed={0.5}
        panSpeed={0.8}
        zoomSpeed={0.8}
        enablePan
      />
      {selectedObj && (
        <TransformControls
          object={selectedObj}
          mode={mode}
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
