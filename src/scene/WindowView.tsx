import { useTexture } from '@react-three/drei'

/**
 * Sunset hillside backdrop seen through the right-wall window.
 * Cropped from Poly Haven "rolling_hills" HDRI — golden hour,
 * sun setting over hills. Flat plane, no distortion.
 */
export function WindowView() {
  const texture = useTexture('/textures/city-sunset.jpg')

  return (
    <mesh position={[2.5, 1.5, -1.0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[3.5, 2.5]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}
