import { useEffect, useRef, type ReactNode } from 'react'
import type { Group, Object3D, Vector3Tuple } from 'three'
import { create } from 'zustand'

/**
 * Editable wraps a prop group and registers it with the editor store so
 * <SceneEditor /> can click-to-select and attach a TransformControls gizmo.
 * Initial position/rotation are set here; the gizmo mutates them in-place
 * so the HUD can show live values.
 *
 * Outside of edit mode this is just a transparent positioned group.
 */

type EditorStore = {
  registry: Map<string, Object3D>
  selected: string | null
  select: (name: string | null) => void
  register: (name: string, obj: Object3D) => void
  unregister: (name: string) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  registry: new Map(),
  selected: null,
  select: (name) => set({ selected: name }),
  register: (name, obj) =>
    set((s) => {
      const next = new Map(s.registry)
      next.set(name, obj)
      return { registry: next }
    }),
  unregister: (name) =>
    set((s) => {
      const next = new Map(s.registry)
      next.delete(name)
      return { registry: next }
    }),
}))

export function Editable({
  name,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale,
  children,
}: {
  name: string
  position?: Vector3Tuple
  rotation?: Vector3Tuple
  scale?: Vector3Tuple
  children: ReactNode
}) {
  const ref = useRef<Group>(null!)
  const register = useEditorStore((s) => s.register)
  const unregister = useEditorStore((s) => s.unregister)
  const select = useEditorStore((s) => s.select)

  useEffect(() => {
    if (ref.current) register(name, ref.current)
    return () => unregister(name)
  }, [name, register, unregister])

  return (
    <group
      ref={ref}
      name={name}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        select(name)
      }}
    >
      {children}
    </group>
  )
}
