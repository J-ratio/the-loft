import { deskAnchor } from '../anchors'

/**
 * Wall-mounted wooden desk — a board suspended from the ceiling/wall by
 * two chains. Much simpler than a legged desk: it's all primitives, so
 * prop placement on its surface has zero pivot ambiguity.
 *
 * The board sits flush against the back wall. Top surface at y=DESK_TOP_Y.
 * Chains run from the front corners of the board up to mount points on
 * the ceiling (or upper wall).
 */

// Exported so DeskTopProps + Notebook can place items on the board surface.
export const DESK_TOP_Y = 0.85
export const DESK_BOARD_WIDTH = 1.3
export const DESK_BOARD_DEPTH = 0.55
export const DESK_BOARD_THICKNESS = 0.04

export function Desk() {
  const [x] = deskAnchor.position
  // Board sits flush to back wall (z=-3.5). Its z-center is z=-3.5 + depth/2.
  const boardZ = -3.5 + DESK_BOARD_DEPTH / 2
  const boardY = DESK_TOP_Y - DESK_BOARD_THICKNESS / 2

  // Chain anchor points: front corners of board, going up to ceiling
  const frontZ = boardZ + DESK_BOARD_DEPTH / 2
  const leftChainX = x - DESK_BOARD_WIDTH / 2 + 0.05
  const rightChainX = x + DESK_BOARD_WIDTH / 2 - 0.05
  const ceilingMountY = 2.95
  const chainLength = ceilingMountY - boardY

  const chainColor = '#2a2a2a'
  const boardColor = '#7a5334'

  return (
    <group>
      {/* Board */}
      <mesh castShadow receiveShadow position={[x, boardY, boardZ]}>
        <boxGeometry args={[DESK_BOARD_WIDTH, DESK_BOARD_THICKNESS, DESK_BOARD_DEPTH]} />
        <meshStandardMaterial color={boardColor} roughness={0.85} />
      </mesh>

      {/* Subtle darker edge (front lip) */}
      <mesh position={[x, boardY - 0.002, frontZ - 0.001]}>
        <boxGeometry args={[DESK_BOARD_WIDTH - 0.02, DESK_BOARD_THICKNESS + 0.005, 0.01]} />
        <meshStandardMaterial color="#5a3e24" roughness={0.9} />
      </mesh>

      {/* Two chains, each as a vertical cylinder from the front corner up. */}
      {[leftChainX, rightChainX].map((cx, i) => (
        <mesh
          key={`chain-${i}`}
          castShadow
          position={[cx, boardY + chainLength / 2, frontZ - 0.02]}
        >
          <cylinderGeometry args={[0.008, 0.008, chainLength, 6]} />
          <meshStandardMaterial color={chainColor} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Small bracket/mount points where the chains meet the ceiling */}
      {[leftChainX, rightChainX].map((cx, i) => (
        <mesh key={`mount-${i}`} position={[cx, ceilingMountY - 0.01, frontZ - 0.02]}>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial color={chainColor} metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Wall mount strip at back of the board — visual anchor to wall */}
      <mesh position={[x, boardY, -3.495]}>
        <boxGeometry args={[DESK_BOARD_WIDTH + 0.02, DESK_BOARD_THICKNESS + 0.01, 0.01]} />
        <meshStandardMaterial color="#3a2618" roughness={0.9} />
      </mesh>
    </group>
  )
}
