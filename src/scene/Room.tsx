/**
 * Greybox room: floor, two walls, window opening. Primitives only.
 * Real geometry replaces this once assets are generated.
 */
export function Room() {
  return (
    <group>
      {/* Floor — warm oak */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#b08a5c" roughness={0.85} />
      </mesh>

      {/* Back wall built as 4 segments around a window opening.
          Window opening: x ∈ [0.4, 2.2], y ∈ [0.85, 2.45]  (w=1.8, h=1.6) */}
      {/* Above window: full width, top strip */}
      <mesh receiveShadow position={[0, 2.725, -2.5]}>
        <planeGeometry args={[6, 0.55]} />
        <meshStandardMaterial color="#f0e2c4" roughness={0.95} />
      </mesh>
      {/* Below window: full width, bottom strip */}
      <mesh receiveShadow position={[0, 0.425, -2.5]}>
        <planeGeometry args={[6, 0.85]} />
        <meshStandardMaterial color="#f0e2c4" roughness={0.95} />
      </mesh>
      {/* Left of window: spans x=-3 to 0.4, only at window height */}
      <mesh receiveShadow position={[-1.3, 1.65, -2.5]}>
        <planeGeometry args={[3.4, 1.6]} />
        <meshStandardMaterial color="#f0e2c4" roughness={0.95} />
      </mesh>
      {/* Right of window: spans x=2.2 to 3, only at window height */}
      <mesh receiveShadow position={[2.6, 1.65, -2.5]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshStandardMaterial color="#f0e2c4" roughness={0.95} />
      </mesh>

      {/* Window frame — thin dark rectangles outlining the opening at z=-2.495 */}
      {[
        { pos: [1.3, 2.43, -2.495], size: [1.85, 0.04] }, // top
        { pos: [1.3, 0.87, -2.495], size: [1.85, 0.04] }, // bottom
        { pos: [0.395, 1.65, -2.495], size: [0.04, 1.6] }, // left
        { pos: [2.205, 1.65, -2.495], size: [0.04, 1.6] }, // right
        { pos: [1.3, 1.65, -2.495], size: [1.85, 0.025] }, // horizontal mullion
        { pos: [1.3, 1.65, -2.495], size: [0.025, 1.6] }, // vertical mullion
      ].map((f, i) => (
        <mesh
          key={`frame-${i}`}
          position={f.pos as [number, number, number]}
        >
          <planeGeometry args={f.size as [number, number]} />
          <meshStandardMaterial color="#2a1a10" roughness={0.8} />
        </mesh>
      ))}

      {/* Left wall — slightly cooler shadow side */}
      <mesh
        receiveShadow
        position={[-2.5, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#d9c9a8" roughness={0.95} />
      </mesh>

      {/* (Window light comes from the backdrop + directional sunlight;
          the opening in the back wall lets the WindowView plane show through.) */}
    </group>
  )
}
