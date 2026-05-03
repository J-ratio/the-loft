# Project: The Loft

A personal blog/hobby site rendered as a 3D "Developer's Den" — an eclectic-minimalist split-level loft. The scene is the art layer; markdown content is the substance. Light mode is INFP (energetic, creative, childlike). Dark mode is INTJ (serious, tired, broken-yet-sturdy).

## Current state

Upper loft room. Long and narrow (X=3.5 × Z=5 × Y=3). Window on right wall, back wall has corkboard + wall-mounted desk board, armchair faces the desk.

### What's built and working

- **Room shell**: back wall, left wall (solid), right wall (window opening with mullions), ceiling, floor, baseboards
- **Window**: real opening in right wall (2.0×1.6) with frame + mullions. Cityscape backdrop (painted rooftops + horizon band) visible through it. Emissive sun mesh placed behind window for future god-ray source.
- **Wall-mounted desk**: wooden board (1.6×0.7) suspended by two slanted chains to wall-mount brackets on back wall. No legs.
- **Desk props**: open notebook (Blog anchor — clickable, renders blog content in-scene via drei `<Html transform>`), Rubik's cube (Sketchfab), mug (Sketchfab "Cute Mug"), alarm clock (Sketchfab, glass patched transparent)
- **Armchair**: Poly Haven ArmChair_01, facing desk
- **Monstera**: Sketchfab Monstera B02 on window sill
- **Corkboard**: primitive on back wall above desk — 10 pinned polaroid photos
- **Rug**: flat color plane under desk/chair area
- **Lighting (basic)**: hemisphere (warm/cool), ambient, directional sun from window side, warm bounce point light, cool fill from left wall. PCFSoft shadow map type set via SoftShadows component.
- **Blog dual surface**: `/blog` and `/blog/:slug` render without canvas. Notebook in-scene renders same markdown via `<Html transform>`.
- **Dev tools**: `?debug=1` (orbit + WASD free-roam), `?edit=1` (click-to-select gizmo + copy-pasteable position/rotation snippet), `?pose=x,y,z|x,y,z` (arbitrary camera angle for screenshots), `window.__loft` store for programmatic state driving.
- **Asset pipeline**: `scripts/fetch-polyhaven.ts`, `scripts/fetch-sketchfab.ts`, `scripts/import-asset.ts` (--preserve-scale or --height modes, Draco compression).

### What's broken / disabled

- **Postprocessing (`@react-three/postprocessing`)**: installed but disabled. EffectComposer + Bloom + GodRays was locking up the browser (screenshot timeouts, possible GPU memory issue on headless chrome). Needs investigation — may work fine in your real browser but killed the MCP tab.

### What's remaining from the brief (INFP light mode)

**Lighting / atmosphere** (brief: "golden hour sunlight flooding in, god rays catching dust motes, shadows soft and long"):
- [ ] **God rays**: sun mesh exists at correct position but GodRays pass is disabled. Need to re-enable with lower samples or use a cheaper fake-volumetric approach (e.g., a translucent cone mesh projecting from the window).
- [ ] **Bloom**: re-enable Bloom effect (cheap, was working before the full pass locked up). Should add soft halo around window and sun.
- [ ] **Soft long shadows**: PCFSoft is set but shadow appearance not verified yet. May need shadow-radius tuning + lower sun angle.
- [ ] **Dust motes**: brief calls for floating particles in the light cone. Simple `<Points>` with 200-500 slow-drifting particles. Deferred.

**Props still missing** (brief: "colorful sticky notes, half-finished sketch, dream catcher or wind chime swaying gently"):
- [ ] **Dream catcher / wind chime**: Sketchfab "Forest Loner" download was wrong (contained a sofa). Need a proper dream catcher asset. Hangs on left wall.
- [ ] **Sticky notes**: small colored squares on wall or desk edge. Were primitives before — removed during cleanup. Need to add back.
- [ ] **Half-finished sketch**: a paper plane with drawn marks, or a sheet with doodle texture. Not yet attempted.
- [ ] **Headphones**: brief mentions desk clutter. Were primitives before — removed. Need replacement.

**Architecture**:
- [ ] **Lower lounge level**: the brief's split-level with bookshelf (Favorites), side table (Moved Me), beanbag. Entirely unbuilt — just an empty void below the upper platform.
- [ ] **Spiral staircase**: was a placeholder stub, removed. Needs a real asset when lower level is built.

**Features**:
- [ ] **Mode toggle (INTJ dark mode)**: crossfade lighting + prop swap. Not started.
- [ ] **Scroll-linked camera dolly**: camera moves on a rail between anchors. Not started.
- [ ] **Additional anchors**: Wall (Timeline), Sill (Future), Shelf (Favorites), Side Table (Moved Me). Only Desk (Blog) exists.
- [ ] **Audio**: ambient birds/lo-fi for light mode, rain/synth for dark. Not started.

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
- 3D: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (installed, disabled)
- State: `zustand` (theme, cameraTarget, activeAnchor)
- Routing: `react-router` (for `/blog` surface)
- Content: markdown under `content/blog/`, parsed with `gray-matter` + `react-markdown`
- Styling: Tailwind for HTML overlays and `/blog` routes
- Debug (dev only): `?debug=1` orbit/WASD, `?edit=1` gizmo editor, `?pose=` camera override

## Room coordinates

- X width: [-1.75, +1.75] (3.5m total)
- Z depth: [-3.5, +1.5] (5.0m total, back wall at z=-3.5)
- Y height: [0, 3.0]
- Back wall: z = -3.5 (solid, hosts desk + corkboard)
- Left wall: x = -1.75 (solid)
- Right wall: x = +1.75 (window opening z∈[-2.0, 0.0], y∈[0.7, 2.3])
- Floor: y = 0
- Ceiling: y = 3.0
- Desk board top: y = 0.85

## Asset pipeline

- Raw GLBs from Poly Haven / Sketchfab land in `assets/raw/<slug>/` (gitignored).
- `scripts/fetch-polyhaven.ts <slug>` — downloads gltf + bin + textures.
- `scripts/fetch-sketchfab.ts search "query"` / `download <uid> --slug <name>` — searches/downloads.
- `scripts/import-asset.ts <input> --target <name> --preserve-scale` or `--height <m>` — Draco-compresses, optionally normalizes scale, writes to `public/models/<name>.glb`.
- Scene components use `useGLTF('/models/<name>.glb')` + `useGLTF.preload(...)`.
- Position controlled by `<Editable name="..." position={...}>` in Scene.tsx.

## Working style

- Before adding a feature, check if the anchor config can express it as data. Prefer config edits over new components.
- Don't add error handling for scenarios that can't happen.
- Don't refactor surrounding code while doing a focused change. One PR, one concern.
- If you catch yourself adding a "clean" abstraction because a pattern repeats twice, stop. Three is the threshold.
- Use `?edit=1` to position props via gizmo, copy the snippet from the HUD, paste into the relevant *_POS constant.
