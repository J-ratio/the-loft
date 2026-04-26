import type { Vector3Tuple } from 'three'

export type AnchorId = 'desk' | 'wall' | 'shelf' | 'sideTable' | 'sill'

export type CameraPose = {
  position: Vector3Tuple
  lookAt: Vector3Tuple
}

export type Anchor = {
  id: AnchorId
  /** Short uppercase label for the HUD / overlay header (e.g. "TERMINAL") */
  label: string
  /** World position for the anchor "zone" — where its prop lives */
  position: Vector3Tuple
  /** Camera pose when this anchor is focused */
  cameraFocus: CameraPose
  /** Which overlay to render when activated */
  overlay: 'blog' | 'timeline' | 'favorites' | 'movedMe' | 'future'
}
