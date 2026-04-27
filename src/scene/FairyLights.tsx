/**
 * Fairy lights draped along the window (right wall, top edge) and along the
 * ceiling / back wall. Warmest "lo-fi bedroom" signal.
 */
export function FairyLights() {
  // String A — along the top of the right-wall window (y ≈ 2.4, x ≈ 1.7),
  // running along Z from -2.2 to +0.2 with slight sag.
  const stringA: [number, number, number][] = []
  {
    const segments = 26
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const z = -2.2 + t * 2.4
      const sag = Math.sin(t * Math.PI) * 0.14
      stringA.push([1.7, 2.4 - sag, z])
    }
  }

  // String B — along the top of the back wall (y ≈ 2.85, z ≈ -3.4),
  // running along X from -1.65 to +1.65 with gentle sag.
  const stringB: [number, number, number][] = []
  {
    const segments = 26
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = -1.65 + t * 3.3
      const sag = Math.sin(t * Math.PI) * 0.12
      stringB.push([x, 2.85 - sag, -3.42])
    }
  }

  return (
    <group>
      {[...stringA, ...stringB].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial
            color="#fff5d0"
            emissive="#ffce6a"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      <pointLight position={[0, 2.7, -3.2]} intensity={0.3} distance={4} color="#ffb878" decay={2} />
      <pointLight position={[1.5, 2.5, -1.0]} intensity={0.25} distance={3.5} color="#ffb878" decay={2} />
    </group>
  )
}
