# Bradbury Phase 2 migration gate

Production remains on the proven StudioNet contract and Cloudflare Pages configuration. Asimov and pre-reset Bradbury endpoints must not be used in active environment variables. Bradbury is unavailable during Epoch Zero; no deployment is authorised until GenLayer explicitly opens builder access.

Bradbury migration is a fresh deployment: no address, state or balance is assumed to survive the reset. Before changing production, verify all of the following in a separate environment:

1. The official GenLayer Chain RPC returns chain ID `4221` **and** the announced Phase 2 genesis block hash. The expected genesis hash must come from the official launch record; it is deliberately not guessed here.
2. The separately documented Intelligent Contract node endpoint answers the required `gen_*` methods. An `eth_*`-only chain endpoint is not an IC endpoint.
3. Upgrade from pinned `genlayer-js` `1.1.8` to the explicit current v2 release candidate only on a migration branch. Re-run typecheck, contract reads, write simulation, fee quoting, wallet signing, finalisation and authoritative reads before merge.
4. Generate a measured `fee-profile.json` from finalised representative contract tests. Do not invent allocations. Quote live prices, show the maximum deposit, verify the wallet GEN balance and preserve fee rejection/refund outcomes.
5. Fresh-deploy the contract, finalise accepted and inconclusive assessments, compare direct reads with the frontend, and test an unrelated read-only wallet.

Run `node scripts/verify-bradbury.mjs` with `BRADBURY_CHAIN_RPC_URL`, `BRADBURY_IC_RPC_URL` and `BRADBURY_EXPECTED_GENESIS_HASH` only after official access opens. It refuses a chain-ID mismatch, a genesis mismatch, or an IC endpoint that reports `gen_*` as method-not-found.

The frontend now has a guarded fee-preparation path: StudioNet remains gasless; a fee-charging chain requires the v2 fee estimator, compares the quoted deposit with `eth_getBalance`, and maps insufficient-balance, stale-price and wallet-rejection errors. This code is dormant in production until the full gate above passes.
