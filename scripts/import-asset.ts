/**
 * Normalize a raw Hunyuan-generated GLB for use in the scene.
 *
 * Usage:
 *   npx tsx scripts/import-asset.ts <input.glb> --target <target-name> --height <meters>
 *
 * - Scales the asset so its bbox height matches <meters>.
 * - Re-centers horizontally (x/z around 0) and sets base at y=0.
 * - Dedups + prunes unused resources.
 * - Applies Draco geometry compression.
 * - Writes to public/models/<target-name>.glb.
 */

import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { dedup, draco, getBounds, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { existsSync, statSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';

interface Args {
  input: string;
  target: string;
  height: number;
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  let target: string | undefined;
  let height: number | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') {
      target = argv[++i];
    } else if (a === '--height') {
      height = Number(argv[++i]);
    } else if (a === '--help' || a === '-h') {
      printUsageAndExit(0);
    } else if (a.startsWith('--')) {
      console.error(`Unknown flag: ${a}`);
      printUsageAndExit(1);
    } else {
      positional.push(a);
    }
  }

  const input = positional[0];
  if (!input || !target || height === undefined || !Number.isFinite(height) || height <= 0) {
    printUsageAndExit(1);
  }

  return { input: input as string, target: target as string, height: height as number };
}

function printUsageAndExit(code: number): never {
  const msg = 'Usage: npx tsx scripts/import-asset.ts <input.glb> --target <target-name> --height <meters>';
  if (code === 0) console.log(msg);
  else console.error(msg);
  process.exit(code);
}

export async function importAsset(args: Args): Promise<void> {
  const inputPath = resolve(args.input);
  if (!existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const beforeKB = statSync(inputPath).size / 1024;

  const io = new NodeIO()
    .registerExtensions([KHRDracoMeshCompression])
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  const doc = await io.read(inputPath);
  const root = doc.getRoot();

  const hasGeometry = root
    .listMeshes()
    .some((mesh) => mesh.listPrimitives().some((p) => p.getAttribute('POSITION')));
  if (!hasGeometry) {
    console.error(`Input has no mesh geometry: ${inputPath}`);
    process.exit(1);
  }

  const scene = root.getDefaultScene() ?? root.listScenes()[0];
  if (!scene) {
    console.error(`Input has no scene: ${inputPath}`);
    process.exit(1);
  }

  // Wrap existing scene roots under a single normalization node so we can
  // apply scale and translation once without touching descendant transforms.
  const wrapper = doc.createNode('__normalize__');
  for (const child of scene.listChildren()) {
    scene.removeChild(child);
    wrapper.addChild(child);
  }
  scene.addChild(wrapper);

  // Measure pre-normalization bounds (in world space).
  const boundsBefore = getBounds(scene);
  const sizeY = boundsBefore.max[1] - boundsBefore.min[1];
  if (!(sizeY > 0)) {
    console.error(`Input bounding box has zero height: ${inputPath}`);
    process.exit(1);
  }

  const scale = args.height / sizeY;
  wrapper.setScale([scale, scale, scale]);

  // After scaling, recompute bounds and offset so x/z are centered at 0 and base is at y=0.
  const boundsScaled = getBounds(scene);
  const cx = (boundsScaled.min[0] + boundsScaled.max[0]) / 2;
  const cz = (boundsScaled.min[2] + boundsScaled.max[2]) / 2;
  const minY = boundsScaled.min[1];
  wrapper.setTranslation([-cx, -minY, -cz]);

  // Register Draco extension on the document so it gets written out.
  doc
    .createExtension(KHRDracoMeshCompression)
    .setRequired(true)
    .setEncoderOptions({
      method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
    });

  await doc.transform(dedup(), prune(), draco());

  const outPath = resolve('public/models', `${args.target}.glb`);
  const outDir = dirname(outPath);
  if (!existsSync(outDir)) {
    console.error(`Output directory does not exist: ${outDir}`);
    process.exit(1);
  }
  await io.write(outPath, doc);

  const afterKB = statSync(outPath).size / 1024;
  const newHeight = getBounds(scene).max[1] - getBounds(scene).min[1];
  console.log(
    `normalized ${basename(outPath)}: ${beforeKB.toFixed(1)}KB → ${afterKB.toFixed(1)}KB, height ${sizeY.toFixed(3)}m → ${newHeight.toFixed(3)}m`,
  );
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);

if (invokedDirectly) {
  const args = parseArgs(process.argv.slice(2));
  await importAsset(args);
}
