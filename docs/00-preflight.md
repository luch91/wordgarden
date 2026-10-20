# Checkpoint A — Preflight

Date: 2026-10-20 (Africa/Lagos)

This repository uses the same verified compatibility and architecture decisions as Vanishing Atlas, while remaining a separate codebase, contract and deployment.

## Selected configuration

- Exact frontend SDK target: `genlayer-js@1.1.8`.
- GenVM runner: `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
- Minimal proof target: Studionet (`61999`, `https://studio.genlayer.com/api`).
- Durable target: Bradbury Phase 2 only after a current official IC RPC and programme eligibility are confirmed.
- Consensus v0.6 / Studio-dev / `genlayer-js@2.0.0-rc.1` is not selected for the stable MVP.

## Live proof

- The production `WordGardenRegistry` passes AST and semantic validation. Root cause of the earlier stall: `genvm-lint` attempted a latest-release network lookup before using the valid cached artifact. Explicitly selecting cached artifact `v0.2.16` allowed the full semantic validator to complete (5 methods: 4 view, 1 write).
- Studionet contract: `0x9dC00297585A855107B0A9B43ba344a3DC0081EA`.
- Deployment transaction: `0x7026591c23dabc03bfd3f836091c5ab12c9981b7c37321ed9f921c837771c19b`.
- Deployment result: `FINALIZED`, `MAJORITY_AGREE`, execution `SUCCESS`, all five validators agreed.
- Write transaction: `0xa303da2462cb9ac7fffeba32190e24bcd0ed4e85a3285be2e04d088111b4610d`.
- Write result: `FINALIZED`, `MAJORITY_AGREE`, execution `SUCCESS`, all five validators agreed.
- Final read: `{ value: "garden-live-2026-10-20", writes: 1 }`.

This is a connectivity proof, not the production registry or final nondeterministic language-assessment workflow. It satisfies the handoff's live deployment/write/read/finality gate, so contract and UI implementation may proceed.

## Verified platform decisions

- Python contract state uses typed class fields, `DynArray`/`TreeMap`, sized integers and `@allow_storage` dataclasses where needed.
- Browser reads use an account-free GenLayerJS client and final-state snapshots; writes use an EIP-1193 wallet provider.
- Transaction submission, consensus decision, protocol finality and application assessment will be represented separately.
- Subjective language-documentation assessment requires independent validator evaluation of the same evidence and comparison of stable decision fields; a format-only validator is unacceptable.
- Web calls must occur inside nondeterministic execution. The contract will impose explicit URL/count/text/page bounds because public docs do not publish portable numeric runtime limits.
- Cloudflare Pages Git integration is compatible with GitHub, automatic production deployments and same-repository PR previews. Do not create a Direct Upload project.
- No database, Pages Functions, paid LLM API, standalone Worker, private key input or authoritative local storage.

## Access and eligibility blockers

- Active GitHub identity is `luch91`; `luch91/wordgarden` did not exist at preflight time.
- Cloudflare account access and GitHub App authorization could not be verified from CLI or browser.
- Public GenLayer programme pages confirm steward review and GitHub OAuth verification, but do not publish the weekly cap, cap reset, exact fields, contract evidence, required network or existing-deployment policy.
- Sunday 23:59 UTC is a points-conversion time, not verified as a submission reset.

## Official sources

- [GenLayerJS](https://docs.genlayer.com/api-references/genlayer-js)
- [Networks](https://docs.genlayer.com/developers/networks)
- [Storage](https://docs.genlayer.com/developers/intelligent-contracts/storage)
- [Equivalence Principle](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle)
- [Reading data](https://docs.genlayer.com/developers/decentralized-applications/reading-data)
- [Writing data](https://docs.genlayer.com/developers/decentralized-applications/writing-data)
- [Transactions](https://docs.genlayer.com/understand-genlayer-protocol/core-concepts/transactions)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [GenLayer Portal: how it works](https://portal.genlayer.foundation/how-it-works/)

## Architecture boundary

- Frontend: UI, wallet orchestration, deterministic botanical rendering, final-state reads and non-authoritative caching.
- GenLayer: canonical word records, evidence inputs, nondeterministic assessment, equivalence validation, accepted/rejected/inconclusive result and append-only history.
- External sources: untrusted evidence that validators independently retrieve; source content never becomes instructions.

## Gate decision

Checkpoint A is **complete for technical implementation / conditional GO**. Both projects have live GenLayer proofs. Cloudflare account/Git authorization and authenticated programme eligibility details remain external blockers for production deployment and submission readiness.
