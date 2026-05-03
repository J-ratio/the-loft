import { useEffect, useRef } from 'react'
import type { Group } from 'three'
import { deskAnchor } from '../anchors'
import { logBbox } from '../lib/bbox-log'

/**
 * Wall-mounted wooden board suspended by two short chains that go from
 * the board's front corners BACK + UP to mount points on the wall (not
 * the ceiling). Bigger than before — more desk real estate.
 */

// Shared so other components (DeskTopProps, Notebook) place items on the surface.
export const DESK_TOP_Y = 0.85
export const DESK_BOARD_WIDTH = 1.6
export const DESK_BOARD_DEPTH = 0.7
export const DESK_BOARD_THICKNESS = 0.04

export function Desk() {
  const [x] = deskAnchor.position
  const ref = useRef<Group>(null!)
  useEffect(() => logBbox('desk_board', ref.current), [])

  // Board center Z (board's back flush to back wall at z=-3.5)
  const boardZ = -3.5 + DESK_BOARD_DEPTH / 2
  const boardY = DESK_TOP_Y - DESK_BOARD_THICKNESS / 2

  // Chain anchor points: on the wall, above the board's back edge.
  // Chain goes from board's FRONT corner up-and-back to a wall mount ~0.5m
  // above the board. Short, slanted, not full-height.
  const frontZ = boardZ + DESK_BOARD_DEPTH / 2
  const leftChainX = x - DESK_BOARD_WIDTH / 2 + 0.06
  const rightChainX = x + DESK_BOARD_WIDTH / 2 - 0.06
  const wallMountY = DESK_TOP_Y + 0.55
  const wallMountZ = -3.49 // just in front of wall plane

  // Chain vector from board front-corner UP-AND-BACK to wall mount.
  const dy = wallMountY - DESK_TOP_Y
  const dz = wallMountZ - frontZ
  const chainLen = Math.hypot(dy, dz)
  // Default cylinder aligns along +Y. We want it pointing from board-front
  // (bottom) to wall-mount (top). Direction = (dy, dz). Rotate the local +Y
  // axis to match that direction using rotation about X.
  // With rotation about +X by angle θ: local (0,1,0) → (0, cosθ, sinθ).
  // We want: (0, cosθ, sinθ) parallel to (dy, dz) / |.|.
  //   cosθ = dy / len,  sinθ = dz / len  →  θ = atan2(dz, dy)
  const tiltX = Math.atan2(dz, dy)

  const chainColor = '#2a2a2a'
  const boardColor = '#7a5334'

  return (
    <group ref={ref}>
      {/* Board */}
      <mesh  position={[x, boardY, boardZ]}>
        <boxGeometry args={[DESK_BOARD_WIDTH, DESK_BOARD_THICKNESS, DESK_BOARD_DEPTH]} />
        <meshStandardMaterial color={boardColor} roughness={0.85} />
      </mesh>

      {/* Front lip (darker accent strip) */}
      <mesh position={[x, boardY - 0.002, frontZ - 0.001]}>
        <boxGeometry args={[DESK_BOARD_WIDTH - 0.02, DESK_BOARD_THICKNESS + 0.005, 0.01]} />
        <meshStandardMaterial color="#5a3e24" roughness={0.9} />
      </mesh>

      {/* Two slanted chains: board front-corner → wall mount higher up.
          Chain geometry as a tilted cylinder; endpoints labeled below. */}
      {[leftChainX, rightChainX].map((cx) => {
        const midY = (DESK_TOP_Y + wallMountY) / 2
        const midZ = (frontZ + wallMountZ) / 2
        return (
          <group key={`chainGroup-${cx}`}>
            <mesh
              position={[cx, midY, midZ]}
              rotation={[tiltX, 0, 0]}
            >
              <cylinderGeometry args={[0.008, 0.008, chainLen, 6]} />
              <meshStandardMaterial color={chainColor} metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Wall mount (flush with back wall at z=-3.49) */}
            <mesh position={[cx, wallMountY, wallMountZ + 0.005]}>
              <boxGeometry args={[0.05, 0.05, 0.015]} />
              <meshStandardMaterial color={chainColor} metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Board eyebolt at front corner */}
            <mesh position={[cx, DESK_TOP_Y + 0.008, frontZ]}>
              <cylinderGeometry args={[0.012, 0.012, 0.02, 8]} />
              <meshStandardMaterial color={chainColor} metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        )
      })}

      {/* Wall-mount strip behind the board */}
      <mesh position={[x, boardY, -3.495]}>
        <boxGeometry args={[DESK_BOARD_WIDTH + 0.02, DESK_BOARD_THICKNESS + 0.01, 0.01]} />
        <meshStandardMaterial color="#3a2618" roughness={0.9} />
      </mesh>
    </group>
  )
}
