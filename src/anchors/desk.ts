import type { Anchor } from './types'

/**
 * Desk anchor — the Blog feature.
 *
 * Upper-loft layout (long narrow room, window on right wall):
 *   Room: x ∈ [-1.75, 1.75], z ∈ [-3.5, 1.5]
 *   Desk center at (0, 0, -3.15) — flush against back wall (z=-3.5)
 *   Desk top at y = 0.725, faces +Z (toward camera)
 */
export const deskAnchor: Anchor = {
  id: 'desk',
  label: 'JOURNAL',
  position: [0, 0.725, -3.15],
  cameraFocus: {
    // Seated-reader pose: camera drops a bit, frames the notebook + corkboard behind.
    position: [0, 1.35, -1.6],
    lookAt: [0, 0.78, -3.1],
  },
  overlay: 'blog',
}

/*
 * Future anchors (v1+) — positions reserved for consistency:
 *
 *   Wall (Timeline)     → corkboard on back wall above desk, z=-3.49, y≈1.9
 *   Sill (Future)       → right-wall window sill, x=+1.65, y=0.77, z≈-0.4 (near end of sill)
 *   Shelf (Favorites)   → lower-level lounge, deferred
 *   SideTable (MovedMe) → lower-level lounge, deferred
 */
