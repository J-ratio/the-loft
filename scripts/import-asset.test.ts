/**
 * Smoke test for scripts/import-asset.ts.
 *
 * Generates a 2.5m-tall cube GLB, normalizes it via the CLI to 1.0m,
 * verifies the output exists and loads cleanly, then cleans up.
 */

import { Accessor, Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rawPath = resolve('assets/raw/__test_cube__.glb');
const outPath = resolve('public/models/test.glb');

async function buildCubeGLB(path: string, heightMeters: number): Promise<void> {
  const io = new NodeIO();
  const d = new Document();

  const h = heightMeters / 2; // cube spans [-h, h] on each axis -> height = 2h
  // 8 cube verts.
  const positions = new Float32Array([
    -h, -h, -h,  h, -h, -h,  h,  h, -h, -h,  h, -h,
    -h, -h,  h,  h, -h,  h,  h,  h,  h, -h,  h,  h,
  ]);
  // 12 triangles (two per face).
  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // -z
    4, 6, 5, 4, 7, 6, // +z
    0, 3, 7, 0, 7, 4, // -x
    1, 5, 6, 1, 6, 2, // +x
    3, 2, 6, 3, 6, 7, // +y
    0, 4, 5, 0, 5, 1, // -y
  ]);

  const buffer = d.createBuffer();
  const position = d
    .createAccessor()
    .setType(Accessor.Type.VEC3)
    .setArray(positions)
    .setBuffer(buffer);
  const index = d.createAccessor().setType(Accessor.Type.SCALAR).setArray(indices).setBuffer(buffer);
  const prim = d.createPrimitive().setAttribute('POSITION', position).setIndices(index);
  const mesh = d.createMesh().addPrimitive(prim);
  const node = d.createNode().setMesh(mesh);
  d.createScene().addChild(node);

  mkdirSync(dirname(path), { recursive: true });
  await io.write(path, d);
}

async function main(): Promise<void> {
  await buildCubeGLB(rawPath, 2.5);

  try {
    const out = execFileSync(
      'npx',
      ['tsx', 'scripts/import-asset.ts', rawPath, '--target', 'test', '--height', '1.0'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
    );
    console.log(out.trimEnd());

    if (!existsSync(outPath)) {
      throw new Error(`expected output GLB at ${outPath}`);
    }

    // Verify it loads cleanly and has the expected normalized height.
    const io = new NodeIO()
      .registerExtensions([KHRDracoMeshCompression])
      .registerDependencies({
        'draco3d.decoder': await draco3d.createDecoderModule(),
      });
    const doc = await io.read(outPath);
    const scene = doc.getRoot().getDefaultScene() ?? doc.getRoot().listScenes()[0];
    if (!scene) throw new Error('no scene in output');

    const bounds = getBounds(scene);
    const h = bounds.max[1] - bounds.min[1];
    if (Math.abs(h - 1.0) > 1e-3) {
      throw new Error(`expected height 1.0, got ${h.toFixed(4)}`);
    }
    // Base at y=0, centered on x/z.
    const cx = (bounds.min[0] + bounds.max[0]) / 2;
    const cz = (bounds.min[2] + bounds.max[2]) / 2;
    if (Math.abs(bounds.min[1]) > 1e-3 || Math.abs(cx) > 1e-3 || Math.abs(cz) > 1e-3) {
      throw new Error(
        `expected base at y=0 and x/z centered, got minY=${bounds.min[1]}, cx=${cx}, cz=${cz}`,
      );
    }

    console.log(`PASS: test.glb loads, height=${h.toFixed(4)}m, base at y=${bounds.min[1].toFixed(4)}`);
  } finally {
    // Always clean up both the raw test input and the normalized output.
    if (existsSync(rawPath)) rmSync(rawPath);
    if (existsSync(outPath)) rmSync(outPath);
  }
}

await main();
