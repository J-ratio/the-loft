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

      {/* Back wall — warm cream */}
      <mesh receiveShadow position={[0, 1.5, -2.5]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#f0e2c4" roughness={0.95} />
      </mesh>

      {/* Left wall — slightly cooler shadow side */}
      <mesh
        receiveShadow
        position={[-2.5, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#d9c9a8" roughness={0.95} />
      </mesh>

      {/* Window on back wall — bright emissive so it reads as the light source. */}
      <mesh position={[1.3, 1.65, -2.49]}>
        <planeGeometry args={[1.8, 1.6]} />
        <meshStandardMaterial
          color="#fff1d4"
          emissive="#ffd88a"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  )
}
