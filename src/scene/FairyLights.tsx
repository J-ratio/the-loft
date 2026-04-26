/**
 * String of warm fairy lights — draped along the top of the window and the
 * left wall. Emissive beads with one shared point light for ambient glow.
 * The single strongest "lo-fi bedroom" visual signal.
 */
export function FairyLights() {
  // Along the top of the back wall (above the window), sagging slightly.
  const topBeads: [number, number, number][] = []
  const segments = 28
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = -2.8 + t * 5.6
    // Sag: parabolic droop between attachment points
    const sag = Math.sin(t * Math.PI) * 0.12
    const y = 2.85 - sag
    const z = -2.47
    topBeads.push([x, y, z])
  }

  // Down the left wall (vertical string)
  const leftBeads: [number, number, number][] = []
  const vSegments = 16
  for (let i = 0; i <= vSegments; i++) {
    const t = i / vSegments
    const y = 2.8 - t * 1.8
    // Gentle drift
    const z = -1.8 + Math.sin(t * Math.PI * 2) * 0.05
    leftBeads.push([-2.47, y, z])
  }

  return (
    <group>
      {[...topBeads, ...leftBeads].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial
            color="#fff5d0"
            emissive="#ffce6a"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Two ambient point lights from the strings — very low intensity,
          just enough to warm the ceiling/wall near them. */}
      <pointLight
        position={[0, 2.7, -2.3]}
        intensity={0.3}
        distance={4}
        color="#ffb878"
        decay={2}
      />
      <pointLight
        position={[-2.3, 2.0, -1.5]}
        intensity={0.25}
        distance={3.5}
        color="#ffb878"
        decay={2}
      />
    </group>
  )
}
