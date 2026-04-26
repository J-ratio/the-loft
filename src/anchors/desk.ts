import type { Anchor } from './types'

export const deskAnchor: Anchor = {
  id: 'desk',
  label: 'JOURNAL',
  // Desk sits at the center-back of the room (upper level in future).
  // For v0 (single level), this is where the notebook prop lives.
  position: [0, 0.75, -1.2],
  cameraFocus: {
    position: [0, 1.4, 0.6],
    lookAt: [0, 0.8, -1.2],
  },
  overlay: 'blog',
}
