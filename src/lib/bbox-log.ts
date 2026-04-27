import { Box3, Vector3 } from 'three'
import type { Object3D } from 'three'

/**
 * Dev helper: log an object's world bounding box on mount. Only runs in dev.
 */
export function logBbox(label: string, obj: Object3D | null | undefined) {
  if (!obj) return
  if (!import.meta.env.DEV) return
  // Force matrix update so bbox reflects current transforms
  obj.updateMatrixWorld(true)
  const box = new Box3().setFromObject(obj)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  const f = (v: Vector3) => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`
  console.log(
    `[bbox] ${label}: size=${f(size)} min=${f(box.min)} max=${f(box.max)} center=${f(center)}`,
  )
}
