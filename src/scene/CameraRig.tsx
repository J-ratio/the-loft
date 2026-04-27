import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useLoftStore } from '../state/store'
import { getAnchor, type CameraPose } from '../anchors'
import { isDebugMode } from '../lib/debug'

// Home: camera on the left wall, looking across/down toward the window.
const HOME_POSE: CameraPose = {
  position: [-1.3, 1.5, 0.2],
  lookAt: [0.8, 1.3, -1.8],
}

// Lerp factor per frame. Higher = snappier, lower = smoother.
const LERP = 0.08

const targetPos = new Vector3()
const targetLook = new Vector3()
const currentLook = new Vector3()

/**
 * Drives the camera toward HOME_POSE or the active anchor's cameraFocus.
 * No OrbitControls — the camera is a dolly, per design law #4.
 */
export function CameraRig() {
  const { camera } = useThree()
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const lookRef = useRef(new Vector3(...HOME_POSE.lookAt))
  const debug = isDebugMode()

  useFrame(() => {
    if (debug) return // DebugRig owns the camera instead.

    const pose = activeAnchor
      ? (getAnchor(activeAnchor)?.cameraFocus ?? HOME_POSE)
      : HOME_POSE

    targetPos.set(...pose.position)
    targetLook.set(...pose.lookAt)

    camera.position.lerp(targetPos, LERP)
    currentLook.copy(lookRef.current).lerp(targetLook, LERP)
    lookRef.current.copy(currentLook)
    camera.lookAt(currentLook)
  })

  return null
}

export { HOME_POSE }
