/**
 * Dev-only debug flag. Enabled with ?debug=1 (or any truthy value) in the URL.
 * When true:
 *   - CameraRig disables itself (no dolly)
 *   - OrbitControls mounts with WASD/mouse roam
 *   - Leva panel shows for live tweaking
 *
 * Production users never see this because they don't set the flag.
 */

let cached: boolean | null = null

export function isDebugMode(): boolean {
  if (cached !== null) return cached
  if (typeof window === 'undefined') {
    cached = false
    return false
  }
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('debug')
  cached = raw !== null && raw !== '' && raw !== '0' && raw !== 'false'
  return cached
}
