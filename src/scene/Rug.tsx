/**
 * Warm rug under and in front of the desk.
 * Room depth is now 5, so the rug sits toward the back half.
 */
export function Rug() {
  return (
    <mesh
      receiveShadow
      position={[0, 0.005, -2.3]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[2.6, 2.2]} />
      <meshStandardMaterial color="#a85a3c" roughness={1} />
    </mesh>
  )
}
