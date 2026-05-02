/**
 * Dev-only debug flag. Enabled with ?debug=1 (or any truthy value) in the URL.
 * When true:
 *   - CameraRig disables itself (no dolly)
 *   - OrbitControls mounts with WASD/mouse roam
 *   - Leva panel shows for live tweaking
 *
 * Production users never see this because they don't set the flag.
 */

function readFlag(name: string): boolean {
  if (typeof window === 'undefined') return false
  const raw = new URLSearchParams(window.location.search).get(name)
  return raw !== null && raw !== '' && raw !== '0' && raw !== 'false'
}

let debugCached: boolean | null = null
let editCached: boolean | null = null

export function isDebugMode(): boolean {
  if (debugCached !== null) return debugCached
  debugCached = readFlag('debug')
  return debugCached
}

export function isEditMode(): boolean {
  if (editCached !== null) return editCached
  editCached = readFlag('edit')
  return editCached
}
