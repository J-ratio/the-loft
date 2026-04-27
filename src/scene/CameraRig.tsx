import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useLoftStore } from '../state/store'
import { getAnchor, type CameraPose } from '../anchors'
import { isDebugMode } from '../lib/debug'

// Home: camera near left wall / front, diagonal view down the long room.
const HOME_POSE: CameraPose = {
  position: [-1.5, 1.6, 1.5],
  lookAt: [0.5, 0.9, -2.5],
}

const LERP = 0.08

const targetPos = new Vector3()
const targetLook = new Vector3()
const currentLook = new Vector3()

/**
 * Drives the camera toward HOME_POSE or the active anchor's cameraFocus.
 * No OrbitControls — the camera is a dolly, per design law #4.
 *
 * Dev override: if `?pose=<x,y,z|x,y,z>` is present in the URL, use that
 * pose instead. Format: "posX,posY,posZ|lookX,lookY,lookZ". Used by the
 * screenshot-multi-angle workflow.
 */
function readPoseFromUrl(): CameraPose | null {
  if (typeof window === 'undefined') return null
  const p = new URLSearchParams(window.location.search).get('pose')
  if (!p) return null
  const parts = p.split('|').map((s) => s.split(',').map(Number))
  if (parts.length !== 2 || parts.some((t) => t.length !== 3 || t.some(Number.isNaN))) {
    return null
  }
  const [pos, look] = parts
  return {
    position: [pos[0], pos[1], pos[2]],
    lookAt: [look[0], look[1], look[2]],
  }
}

export function CameraRig() {
  const { camera } = useThree()
  const activeAnchor = useLoftStore((s) => s.activeAnchor)
  const lookRef = useRef(new Vector3(...HOME_POSE.lookAt))
  const debug = isDebugMode()
  const urlPoseRef = useRef<CameraPose | null>(null)

  useEffect(() => {
    urlPoseRef.current = readPoseFromUrl()
  }, [])

  useFrame(() => {
    if (debug) return

    const pose =
      urlPoseRef.current ??
      (activeAnchor ? (getAnchor(activeAnchor)?.cameraFocus ?? HOME_POSE) : HOME_POSE)

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
