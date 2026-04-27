/**
 * Search Sketchfab for downloadable models, or download a specific model by UID.
 *
 * Usage:
 *   npx tsx scripts/fetch-sketchfab.ts search "monstera plant" [--count 8]
 *   npx tsx scripts/fetch-sketchfab.ts download <uid> --slug <slug>
 *
 * Token read from SKETCHFAB_TOKEN env var. Search mode prints candidates
 * with UID, name, license, face count, and thumbnail URL so you can pick.
 * Download mode fetches the GLB archive, extracts it, drops in
 * assets/raw/<slug>/. Then run scripts/import-asset.ts on the result.
 *
 * License check is intentionally skipped — per user, we're not gating on it.
 */

import { createWriteStream, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { execFileSync } from 'node:child_process'

const TOKEN = process.env.SKETCHFAB_TOKEN
if (!TOKEN) {
  console.error('Set SKETCHFAB_TOKEN in the environment.')
  process.exit(1)
}

type SearchResult = {
  uid: string
  name: string
  license: { label?: string } | null
  faceCount?: number
  vertexCount?: number
  isDownloadable: boolean
  thumbnails: { images: { url: string; width: number; height: number }[] }
  viewerUrl: string
  likeCount?: number
}

async function search(query: string, count: number) {
  const url = new URL('https://api.sketchfab.com/v3/search')
  url.searchParams.set('type', 'models')
  url.searchParams.set('q', query)
  url.searchParams.set('downloadable', 'true')
  url.searchParams.set('count', String(count))
  url.searchParams.set('sort_by', '-likeCount')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Token ${TOKEN}` },
  })
  if (!res.ok) {
    console.error(`Search failed: ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  const data = (await res.json()) as { results: SearchResult[] }
  for (const r of data.results) {
    const license = r.license?.label ?? 'unknown'
    const thumb = r.thumbnails.images.reduce((best, t) => (t.width > (best?.width ?? 0) ? t : best))
    const faces = r.faceCount !== undefined ? r.faceCount.toLocaleString() : '?'
    const likes = r.likeCount ?? 0
    console.log(`\n${r.uid}  ${r.name}`)
    console.log(`  license: ${license}  faces: ${faces}  likes: ${likes}`)
    console.log(`  thumb:   ${thumb.url}`)
    console.log(`  view:    ${r.viewerUrl}`)
  }
  console.log(`\n${data.results.length} results. Pick a UID, then: npx tsx scripts/fetch-sketchfab.ts download <uid> --slug <name>`)
}

async function download(uid: string, slug: string) {
  // Step 1: get the signed download URL
  const infoRes = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
    headers: { Authorization: `Token ${TOKEN}` },
  })
  if (!infoRes.ok) {
    console.error(`Download info failed: ${infoRes.status} ${await infoRes.text()}`)
    process.exit(1)
  }
  const info = (await infoRes.json()) as {
    gltf?: { url: string; size: number; expires: number }
  }
  const gltfUrl = info.gltf?.url
  if (!gltfUrl) {
    console.error('Model has no gltf download available:', JSON.stringify(info))
    process.exit(1)
  }

  const outDir = resolve('assets/raw', slug)
  mkdirSync(outDir, { recursive: true })
  const zipPath = resolve(outDir, 'download.zip')

  // Step 2: download the zip
  const dlRes = await fetch(gltfUrl)
  if (!dlRes.ok || !dlRes.body) {
    console.error(`Zip download failed: ${dlRes.status}`)
    process.exit(1)
  }
  await pipeline(
    dlRes.body as unknown as NodeJS.ReadableStream,
    createWriteStream(zipPath),
  )
  const zipSize = statSync(zipPath).size

  // Step 3: unzip in place
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', outDir])
  rmSync(zipPath)

  // Step 4: find the .gltf or .glb inside (Sketchfab zips have nested structure)
  const candidates: string[] = []
  const walk = (d: string) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = resolve(d, entry.name)
      if (entry.isDirectory()) walk(p)
      else if (entry.name.endsWith('.gltf') || entry.name.endsWith('.glb'))
        candidates.push(p)
    }
  }
  walk(outDir)

  if (candidates.length === 0) {
    console.error('No .gltf/.glb found in archive')
    process.exit(1)
  }

  // Prefer root-level gltf
  const picked = candidates.sort((a, b) => a.length - b.length)[0]
  console.log(
    `downloaded ${slug}: zip ${(zipSize / 1024 / 1024).toFixed(1)}MB extracted`,
  )
  console.log(`  model: ${picked}`)
  console.log(`  run:   npx tsx scripts/import-asset.ts ${picked} --target ${slug} --height <m>`)
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (cmd === 'search') {
    const query = rest.filter((a) => !a.startsWith('--')).join(' ')
    const countIdx = rest.indexOf('--count')
    const count = countIdx >= 0 ? Number(rest[countIdx + 1]) : 8
    if (!query) {
      console.error('Usage: search "query" [--count N]')
      process.exit(1)
    }
    await search(query, count)
  } else if (cmd === 'download') {
    const uid = rest[0]
    const slugIdx = rest.indexOf('--slug')
    const slug = slugIdx >= 0 ? rest[slugIdx + 1] : undefined
    if (!uid || !slug) {
      console.error('Usage: download <uid> --slug <slug>')
      process.exit(1)
    }
    await download(uid, slug)
  } else {
    console.error(
      'Usage:\n  fetch-sketchfab.ts search "query" [--count N]\n  fetch-sketchfab.ts download <uid> --slug <slug>',
    )
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})

if (existsSync('/dev/null')) {
  /* silence unused-import warnings */
}
