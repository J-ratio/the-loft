/**
 * A painted backdrop seen through the window. Sits just behind the window
 * plane — the warm emissive window acts as the "glass + light bloom."
 *
 * Composition: warm sky gradient top → distant city silhouette at horizon →
 * a foreground roof / hill tint at bottom. All primitives, no textures.
 */
export function WindowView() {
  return (
    <group position={[1.3, 1.65, -2.8]}>
      {/* Sky — warm amber gradient fake via one emissive plane */}
      <mesh>
        <planeGeometry args={[3.2, 2.4]} />
        <meshBasicMaterial color="#fbc988" toneMapped={false} />
      </mesh>

      {/* Horizon band — softer/pinker */}
      <mesh position={[0, -0.35, 0.01]}>
        <planeGeometry args={[3.2, 0.7]} />
        <meshBasicMaterial color="#f3a77a" toneMapped={false} />
      </mesh>

      {/* Distant rooftops — dark silhouettes at the horizon.
          Varied heights create a city skyline read. */}
      {[
        { x: -1.2, w: 0.35, h: 0.18 },
        { x: -0.85, w: 0.3, h: 0.28 },
        { x: -0.5, w: 0.45, h: 0.22 },
        { x: 0, w: 0.5, h: 0.32 },
        { x: 0.45, w: 0.35, h: 0.2 },
        { x: 0.78, w: 0.4, h: 0.25 },
        { x: 1.15, w: 0.3, h: 0.18 },
      ].map((b, i) => (
        <mesh key={i} position={[b.x, -0.55 + b.h / 2, 0.02]}>
          <planeGeometry args={[b.w, b.h]} />
          <meshBasicMaterial color="#6b3a2a" toneMapped={false} />
        </mesh>
      ))}

      {/* A couple of tiny warm lit windows on the rooftops */}
      {[
        { x: -0.78, y: -0.48 },
        { x: 0.05, y: -0.42 },
        { x: 0.5, y: -0.5 },
        { x: 0.92, y: -0.46 },
      ].map((w, i) => (
        <mesh key={`w-${i}`} position={[w.x, w.y, 0.03]}>
          <planeGeometry args={[0.03, 0.04]} />
          <meshBasicMaterial color="#ffdc8a" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
