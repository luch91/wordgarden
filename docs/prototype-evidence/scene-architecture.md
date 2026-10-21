# Layered scene architecture

## Independently rendered objects

- Six botanical specimens are individual focusable objects with transparent sprite artwork, independent hover/focus/selection lift, glow and depth shadows.
- Finalised GenLayer words are separate documented specimens; decorative collection plants are explicitly labelled.
- Field journal preview, controls and minimap remain screen-space UI.

## Animated depth layers

- Conservatory plate: 0.12 camera factor.
- Path/light plane: 0.35 camera factor.
- Botanical object plane: 1.0 camera factor.
- Foreground foliage veil: 1.12 camera factor.

## Baked artwork

The distant conservatory, paths and small environmental planting in `garden-world.jpg` remain non-interactive atmosphere. They are softened so separately rendered specimens form the interaction layer.

## Camera

The 1800×1050 world uses viewport-derived pan limits, pointer-centred wheel zoom, midpoint-anchored two-pointer pinch, deterministic focus transforms and a world-coordinate minimap with a live viewport rectangle.

