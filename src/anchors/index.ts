import { deskAnchor } from './desk'
import type { Anchor, AnchorId } from './types'

export const anchors: Anchor[] = [deskAnchor]

export function getAnchor(id: AnchorId): Anchor | undefined {
  return anchors.find((a) => a.id === id)
}

export { deskAnchor }
export type { Anchor, AnchorId, CameraPose } from './types'
