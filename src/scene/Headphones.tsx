import { useGLTF } from '@react-three/drei'

export const HEADPHONES_POS: [number, number, number] = [-0.523, 0.924, -3.343]
export const HEADPHONES_ROT: [number, number, number] = [2.777, 0.001, -3.098]
export const HEADPHONES_SCALE: [number, number, number] = [0.509, 0.509, 0.509]

export function Headphones() {
  const { scene } = useGLTF('/models/headphones.glb')
  return <primitive object={scene} />
}

useGLTF.preload('/models/headphones.glb')
