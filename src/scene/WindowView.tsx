/**
 * Cityscape backdrop seen through the right-wall window.
 * Window opening: x = +1.75, z ∈ [-2.0, 0.0], y ∈ [0.7, 2.3].
 * Backdrop sits at x = +2.15, facing -X (toward the room interior).
 */
export function WindowView() {
  const x = 2.15
  const length = 2.2 // along Z (slightly wider than window to avoid edge leaks)
  const height = 1.8
  const zCenter = -1.0
  const yCenter = 1.5

  return (
    <group position={[x, yCenter, zCenter]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Sky */}
      <mesh>
        <planeGeometry args={[length, height]} />
        <meshBasicMaterial color="#fbc988" toneMapped={false} />
      </mesh>

      {/* Horizon band */}
      <mesh position={[0, -0.42, 0.01]}>
        <planeGeometry args={[length, 0.55]} />
        <meshBasicMaterial color="#f3a77a" toneMapped={false} />
      </mesh>

      {/* Rooftops silhouettes */}
      {[
        { off: -0.95, w: 0.3, h: 0.22 },
        { off: -0.65, w: 0.28, h: 0.3 },
        { off: -0.35, w: 0.35, h: 0.22 },
        { off: -0.05, w: 0.45, h: 0.32 },
        { off: 0.32, w: 0.35, h: 0.24 },
        { off: 0.65, w: 0.3, h: 0.28 },
        { off: 0.92, w: 0.28, h: 0.2 },
      ].map((b, i) => (
        <mesh key={i} position={[b.off, -0.68 + b.h / 2, 0.02]}>
          <planeGeometry args={[b.w, b.h]} />
          <meshBasicMaterial color="#6b3a2a" toneMapped={false} />
        </mesh>
      ))}

      {/* Lit rooftop windows */}
      {[
        { off: -0.6, y: -0.58 },
        { off: -0.1, y: -0.55 },
        { off: 0.15, y: -0.6 },
        { off: 0.55, y: -0.55 },
        { off: 0.85, y: -0.58 },
      ].map((w, i) => (
        <mesh key={`lw-${i}`} position={[w.off, w.y, 0.03]}>
          <planeGeometry args={[0.025, 0.035]} />
          <meshBasicMaterial color="#ffdc8a" toneMapped={false} />
        </mesh>
      ))}

      {/* Sun disc removed — the real SunMesh in Scene.tsx renders here now
          and drives the GodRays post effect. */}
    </group>
  )
}
