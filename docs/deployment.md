# Cloudflare Pages deployment

- Framework preset: React / Vite
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Node: `22.12.0`
- Git-connected Pages only; do not use Direct Upload or a standalone Worker.

Set `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, and `VITE_GENLAYER_CONTRACT_ADDRESS` to public values. Configure an explorer URL only if an official explorer supports the selected network. `public/_redirects` provides SPA fallback.
