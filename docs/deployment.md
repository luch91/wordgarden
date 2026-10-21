# Cloudflare Pages deployment

- Framework preset: React / Vite
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Node: `22.12.0`
- Git-connected Pages only; do not use Direct Upload or a standalone Worker.

Set `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, and `VITE_GENLAYER_CONTRACT_ADDRESS` to public values. Configure an explorer URL only if an official explorer supports the selected network. `public/_redirects` provides SPA fallback.

The independent Git-connected Pages project is `wordgarden`, project ID `99a52fd5-6ff0-4470-b9ab-2a4b093eb3e0`, at `https://wordgarden-7fl.pages.dev`. The authenticated Cloudflare record on 21 October 2026 showed production deployment `baa15d2a-5f54-495d-9218-d6275478fa11` serving merge commit `8ed53d8dc100536d59f3ac6574722a9772cbba77`. Its public variables select StudioNet chain 61999 and contract `0x53E378b8783dAe7c1A2E67bFd36E1c66bd79665b`.

This is an immutable QA snapshot. A later documentation-only merge can create a newer Git-connected deployment; the final delivery report records that resulting deployment ID and commit.
