/* One-shot inspector: show material alpha/transparency info for a GLB. */
import { NodeIO } from '@gltf-transform/core'
import { KHRDracoMeshCompression } from '@gltf-transform/extensions'
import draco3d from 'draco3dgltf'

const [, , path] = process.argv
if (!path) {
  console.error('usage: tsx scripts/inspect-materials.ts <path.glb>')
  process.exit(1)
}

const io = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
  })

const doc = await io.read(path)
for (const m of doc.getRoot().listMaterials()) {
  const base = m.getBaseColorFactor()
  console.log(
    m.getName() || '(unnamed)',
    '\n  alphaMode:', m.getAlphaMode(),
    '\n  alphaCutoff:', m.getAlphaCutoff(),
    '\n  baseColorFactor:', base,
    '\n  doubleSided:', m.getDoubleSided(),
    '\n  hasBaseColorTexture:', !!m.getBaseColorTexture(),
  )
}
