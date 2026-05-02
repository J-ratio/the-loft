import { useEffect, useState } from 'react'
import type { Object3D } from 'three'
import { useEditorStore } from './Editable'

/**
 * Floating HUD shown when in edit mode. Displays the registry list (click to
 * select) and — when something is selected — its live transform as a
 * copy-pasteable JSX snippet.
 *
 * Updates every animation frame so the snippet stays in sync while dragging.
 */

function fmt(n: number): string {
  return Math.abs(n) < 1e-4 ? '0' : n.toFixed(3)
}

function snippetFor(obj: Object3D): string {
  const p = obj.position
  const r = obj.rotation
  const s = obj.scale
  const pos = `position={[${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)}]}`
  const rot = `rotation={[${fmt(r.x)}, ${fmt(r.y)}, ${fmt(r.z)}]}`
  const scl =
    Math.abs(s.x - 1) < 1e-4 && Math.abs(s.y - 1) < 1e-4 && Math.abs(s.z - 1) < 1e-4
      ? ''
      : `scale={[${fmt(s.x)}, ${fmt(s.y)}, ${fmt(s.z)}]}`
  return [pos, rot, scl].filter(Boolean).join(' ')
}

export function EditorHud() {
  const registry = useEditorStore((s) => s.registry)
  const selected = useEditorStore((s) => s.selected)
  const select = useEditorStore((s) => s.select)
  const [snippet, setSnippet] = useState('')

  useEffect(() => {
    if (!selected) {
      setSnippet('')
      return
    }
    const obj = registry.get(selected)
    if (!obj) return
    let id = 0
    const tick = () => {
      setSnippet(snippetFor(obj))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [selected, registry])

  const copy = () => {
    if (snippet) navigator.clipboard?.writeText(snippet)
  }

  return (
    <div className="fixed top-4 right-4 z-30 w-[320px] font-mono text-xs text-amber-100 bg-neutral-900/90 border border-amber-500/40 rounded p-3 backdrop-blur pointer-events-auto space-y-2">
      <div className="font-bold tracking-widest text-amber-400">EDIT MODE</div>

      {/* Registry list */}
      <div className="space-y-1">
        <div className="text-amber-400/70 text-[10px] uppercase tracking-widest">
          props ({registry.size})
        </div>
        <div className="max-h-40 overflow-y-auto space-y-0.5">
          {[...registry.keys()].sort().map((name) => (
            <button
              key={name}
              onClick={() => select(name)}
              className={`block w-full text-left px-2 py-0.5 rounded ${
                name === selected
                  ? 'bg-amber-500/30 text-amber-100'
                  : 'hover:bg-white/5 text-neutral-300'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <div className="pt-1 border-t border-amber-500/20 space-y-1">
            <div className="text-amber-400/70 text-[10px] uppercase tracking-widest flex items-center justify-between">
              <span>{selected}</span>
              <button
                onClick={copy}
                className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-100 normal-case tracking-normal"
              >
                copy
              </button>
            </div>
            <pre className="text-[10px] leading-snug whitespace-pre-wrap break-words text-neutral-100">
              {snippet}
            </pre>
          </div>
          <div className="text-[10px] text-neutral-400 space-y-0.5">
            <div>1: translate · 2: rotate · 3: scale</div>
            <div>wasd+mouse: nav · esc: deselect</div>
          </div>
        </>
      )}

      {!selected && (
        <div className="text-[10px] text-neutral-400">
          click any prop in the scene or the list above to edit
        </div>
      )}
    </div>
  )
}
