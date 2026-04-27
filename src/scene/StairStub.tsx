/**
 * Spiral-stair stub — descends from the near-left of the upper platform.
 * Placeholder until the lower lounge exists.
 */
export function StairStub() {
  const cx = -1.4
  const cz = 1.2
  const topY = 0.0

  const steps: { pos: [number, number, number]; rotY: number }[] = []
  const stepCount = 6
  for (let i = 0; i < stepCount; i++) {
    const t = i / stepCount
    const angle = t * Math.PI * 1.3
    const y = topY - t * 1.3
    const r = 0.35
    const x = cx + Math.cos(angle) * r
    const z = cz + Math.sin(angle) * r
    steps.push({ pos: [x, y, z], rotY: angle + Math.PI / 2 })
  }

  return (
    <group>
      <mesh castShadow position={[cx, -0.8, cz]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {steps.map((s, i) => (
        <mesh key={i} castShadow position={s.pos} rotation={[0, s.rotY, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.22]} />
          <meshStandardMaterial color="#6b4e32" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
