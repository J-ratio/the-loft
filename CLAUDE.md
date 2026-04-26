# Project: The Loft

A personal blog/hobby site rendered as a 3D "Developer's Den" — an eclectic-minimalist split-level loft. The scene is the art layer; markdown content is the substance. Light mode is INFP (energetic, creative, childlike). Dark mode is INTJ (serious, tired, broken-yet-sturdy).

## Current phase: v0 (shipped)

Scope: **one room, one anchor, one feature.** Desk + notebook → click → overlay reads blog posts from `content/blog/*.md`. Plain `/blog` and `/blog/[slug]` HTML routes exist in parallel.

**Status**: All v0 baseline + Tier 1/2 art pass done.

Locked in (load-bearing for v1+):
- R3F + Vite + TS baseline ✓
- `content/blog/*.md` + frontmatter = single source of truth ✓
- Anchor config pattern (`src/anchors/desk.ts` — only entry for now) ✓
- Camera-focus animation primitive in `src/scene/CameraRig.tsx` ✓
- HTML overlay layered over canvas (`src/overlays/AnchorOverlay.tsx`) ✓
- `/blog` + `/blog/[slug]` plain routes rendering same markdown ✓
- Greybox scene with golden-hour lighting (warm directional + hemisphere + point fill + emissive window) ✓
- Minimum-viable INFP props: Monstera near window, ceramic mug on desk, warm rug under desk ✓

What v0 does NOT build: mode toggle, scroll-linked camera, audio, post-processing, Theatre.js, Hunyuan assets, any anchor beyond the desk.

**Known quirks**:
- MCP synthetic clicks don't reliably hit R3F raycaster — use `window.__loft` store exposure (dev-only) if needed to drive state from devtools.
- Window is an emissive plane, not a real window hole. `toneMapped={true}` and exposure 0.85 keep it from blowing out.

## Design laws (don't violate without asking)

1. **Anchor invariance.** Every feature lives at a fixed world position. Light and dark modes swap the *prop model* and *materials*, never the position or the interaction. Anchors: Wall (Timeline), Shelf (Favorites), Desk (Blog), Side Table (Moved Me), Sill (Future).
2. **Dual surface.** Every piece of content must render both inside the 3D overlay AND as a plain HTML route. Markdown files are the source; scene and `/blog` are two views. Never put content only inside the scene.
3. **Diegetic UI.** The objects *are* the navigation. No floating menus inside the canvas. A minimal HTML HUD (outside canvas) for fast-travel is allowed.
4. **Camera is a dolly on a rail.** Scroll drives it. No free-roam, no WASD, no user-controlled orbit outside a debug flag. Clicking an anchor lerps the camera to a focus pose; clicking away returns home.
5. **Mode shift is a crossfade, not a toggle.** ~1.2s transition. Layers that crossfade: HDRI, ambient audio, exposure/fog, bloom. Layers that hard-swap under cover of the crossfade: prop meshes, clutter groups, materials.
6. **Clutter is a feature, not a bug.** Dream catcher, duct-taped armrest, crumpled paper, sticky notes — these are the soul. Do not "clean up" odd props. Group them into `<CreativeClutter />` (light) and `<IndustrialTools />` (dark).
7. **Vibe references beat "looks nice."** Aim at: lo-fi girl streams, Ghibli interiors, Blade Runner 2049 apartments, Kintsugi repair aesthetic. Not: generic "modern 3D portfolio."

## Tech stack

- Build: Vite + React + TypeScript
- 3D: `@react-three/fiber`, `@react-three/drei`
- State: `zustand` (theme, cameraTarget, activeAnchor)
- Routing: `react-router` (for `/blog` surface)
- Content: markdown under `content/blog/`, parsed with `gray-matter` + `react-markdown`
- Styling: Tailwind for HTML overlays and `/blog` routes
- Debug (dev only): `leva` for tweaking anchor positions, camera waypoints, lighting

## Verification rules

- **Visual changes are not done until screenshotted.** Type-check and build passing prove nothing about whether the scene looks right. Use the chrome-devtools MCP to open the dev server and screenshot. If the MCP is unavailable, say so — don't claim the scene works.
- When a mode toggle exists (v2+), screenshot *both* modes in the same turn and describe the felt difference, not just the color difference.
- When adding an anchor, verify: (a) home-pose screenshot, (b) zoomed-in screenshot, (c) overlay-open screenshot.
- For `/blog` routes: check they render without the canvas mounted (the HTML surface must stand alone).

## Asset pipeline (once Hunyuan generation starts)

- Raw Hunyuan GLBs land in `assets/raw/`.
- Run `scripts/import-asset.ts` to normalize scale (against a 1.8m human reference), Draco-compress, and emit to `public/models/`.
- Every imported asset gets a stub entry in the relevant anchor config.
- Never commit raw assets; `assets/raw/` is gitignored.

## Working style

- Before adding a feature, check if the anchor config can express it as data. Prefer config edits over new components.
- Don't add error handling for scenarios that can't happen (e.g., missing frontmatter on markdown files you control).
- Don't refactor surrounding code while doing a focused change. One PR, one concern.
- If you catch yourself adding a "clean" abstraction because a pattern repeats twice, stop. Three is the threshold.
