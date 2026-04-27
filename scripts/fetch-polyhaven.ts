/**
 * Download a Poly Haven model + all its referenced buffers/textures into
 * `assets/raw/<slug>/`. Structure matches what the GLTF references so the
 * import pipeline can read it as-is.
 *
 * Usage:
 *   npx tsx scripts/fetch-polyhaven.ts <slug> [--res 1k]
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

type FilesResponse = Record<string, unknown>

function parseArgs(argv: string[]): { slug: string; res: string } {
  const pos: string[] = []
  let res = '1k'
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--res') res = argv[++i]
    else pos.push(a)
  }
  const slug = pos[0]
  if (!slug) {
    console.error('Usage: npx tsx scripts/fetch-polyhaven.ts <slug> [--res 1k]')
    process.exit(1)
  }
  return { slug, res }
}

function findGltfUrl(files: FilesResponse, res: string): string {
  const gltf = (files as { gltf?: Record<string, Record<string, { url?: string }>> }).gltf
  const url = gltf?.[res]?.gltf?.url
  if (!url) throw new Error(`No GLTF URL at resolution ${res}`)
  return url
}

async function download(url: string, outPath: string): Promise<number> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buf)
  return buf.length
}

async function main() {
  const { slug, res } = parseArgs(process.argv.slice(2))

  // 1. Get the manifest
  const filesRes = await fetch(`https://api.polyhaven.com/files/${slug}`)
  if (!filesRes.ok) throw new Error(`Manifest fetch failed: ${filesRes.status}`)
  const files = (await filesRes.json()) as FilesResponse

  // 2. Find + download the GLTF
  const gltfUrl = findGltfUrl(files, res)
  const outDir = resolve('assets/raw', slug)
  const gltfPath = resolve(outDir, 'model.gltf')
  await download(gltfUrl, gltfPath)

  // 3. Parse GLTF, resolve all referenced URIs against Poly Haven's CDN
  const gltfJson = JSON.parse(
    Buffer.from(await (await fetch(gltfUrl)).arrayBuffer()).toString('utf-8'),
  ) as {
    buffers?: { uri?: string }[]
    images?: { uri?: string }[]
  }

  // Poly Haven places textures at:
  //   https://dl.polyhaven.org/file/ph-assets/Models/jpg/<res>/<slug>/<filename>.jpg
  // and the bin next to the gltf:
  //   https://dl.polyhaven.org/file/ph-assets/Models/gltf/<res>/<slug>/<filename>.bin
  // The GLTF itself references textures as `textures/<filename>.jpg` and the bin as `<filename>.bin`.
  const gltfBase = gltfUrl.slice(0, gltfUrl.lastIndexOf('/') + 1)
  const jpgBase = gltfBase.replace('/gltf/', '/jpg/')

  // Download buffers (bin files sit alongside the gltf)
  for (const b of gltfJson.buffers ?? []) {
    if (!b.uri) continue
    const url = gltfBase + b.uri
    const out = resolve(outDir, b.uri)
    const bytes = await download(url, out)
    console.log(`  buffer ${b.uri} (${(bytes / 1024).toFixed(1)}KB)`)
  }

  // Download images. GLTF references them as `textures/<file>`, CDN has them at jpg/<res>/<slug>/<file>
  for (const img of gltfJson.images ?? []) {
    if (!img.uri) continue
    const filename = img.uri.split('/').pop() ?? img.uri
    const url = jpgBase + filename
    const out = resolve(outDir, img.uri)
    const bytes = await download(url, out)
    console.log(`  texture ${img.uri} (${(bytes / 1024).toFixed(1)}KB)`)
  }

  console.log(`fetched ${slug} → ${outDir}/model.gltf`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
