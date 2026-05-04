import { useGLTF } from '@react-three/drei'

export const DREAMCATCHER_POS: [number, number, number] = [1.684, 1.697, -1.478]
export const DREAMCATCHER_ROT: [number, number, number] = [0, 1.571, 0]
export const DREAMCATCHER_SCALE: [number, number, number] = [1.423, 1.423, 1.423]

export function Dreamcatcher() {
  const { scene } = useGLTF('/models/dreamcatcher.glb')
  return <primitive object={scene} />
}

useGLTF.preload('/models/dreamcatcher.glb')
