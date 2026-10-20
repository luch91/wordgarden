# Checkpoint A — Preflight

Date: 2026-10-20 (Africa/Lagos)

This repository uses the same verified compatibility and architecture decisions as Vanishing Atlas, while remaining a separate codebase, contract and deployment.

## Selected configuration

- Exact frontend SDK target: `genlayer-js@1.1.8`.
- GenVM runner: `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
- Minimal proof target: Studionet (`61999`, `https://studio.genlayer.com/api`).
- Durable target: Bradbury Phase 2 only after a current official IC RPC and programme eligibility are confirmed.
- Consensus v0.6 / Studio-dev / `genlayer-js@2.0.0-rc.1` is not selected for the stable MVP.

## Current live-proof status

- `WordGardenRegistry` Checkpoint-A proof source exists and passes the linter's AST safety checks.
- Semantic validation stalled in the local linter process and must be rerun successfully.
- No WordGarden contract has been deployed and no write/read/finality evidence exists yet.
- Therefore the project is **blocked / NO-GO for full UI implementation** under the handoff gate.

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
