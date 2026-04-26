/**
 * Warm rug under the desk — breaks up the large floor area and
 * anchors the desk. Slightly above the floor to avoid z-fighting.
 */
export function Rug() {
  return (
    <mesh
      receiveShadow
      position={[0, 0.005, -0.8]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[2.8, 2.2]} />
      <meshStandardMaterial color="#a85a3c" roughness={1} />
    </mesh>
  )
}
