import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { useLoftStore } from '../state/store'
import { getAnchor, type CameraPose } from '../anchors'

const HOME_POSE: CameraPose = {
  position: [2.2, 1.8, 2.4],
  lookAt: [0, 0.9, -0.8],
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
  // Track the current lookAt target separately from the camera (Three has no getter).
  const lookRef = useRef(new Vector3(...HOME_POSE.lookAt))

  useFrame(() => {
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
