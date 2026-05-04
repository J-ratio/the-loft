/**
 * Half-finished sketchpad on the desk — a few sheets of paper
 * with a pencil resting on top. Built from primitives.
 */
export const SKETCHPAD_POS: [number, number, number] = [0.417, 0.855, -3.050]

export function Sketchpad() {
  return (
    <group>
      {/* Stack of paper sheets — slightly offset for thickness feel */}
      {[0, 0.002, 0.004].map((yOff, i) => (
        <mesh key={i} position={[0, yOff, i * 0.001]} rotation={[-Math.PI / 2, 0, 0.03 * (i - 1)]}>
          <planeGeometry args={[0.18, 0.24]} />
          <meshStandardMaterial
            color={i === 2 ? '#faf8f2' : '#f0ece4'}
            roughness={0.9}
          />
        </mesh>
      ))}
      {/* Pencil resting diagonally on top */}
      <mesh position={[0.04, 0.007, 0.02]} rotation={[0, 0.4, Math.PI / 2]}>
        <cylinderGeometry args={[0.003, 0.003, 0.16, 8]} />
        <meshStandardMaterial color="#e8c44a" roughness={0.6} />
      </mesh>
      {/* Pencil tip */}
      <mesh position={[0.04 + 0.07 * Math.cos(0.4), 0.007, 0.02 - 0.07 * Math.sin(0.4)]} rotation={[0, 0.4, Math.PI / 2]}>
        <coneGeometry args={[0.003, 0.012, 8]} />
        <meshStandardMaterial color="#3a3020" roughness={0.7} />
      </mesh>
    </group>
  )
}
