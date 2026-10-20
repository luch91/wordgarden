# Testing

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e`.

Unit coverage verifies deterministic plant generation and accessible SVG descriptions. Browser smoke coverage verifies core routes, deep links, mobile navigation, reduced-motion rendering and horizontal overflow. Real-network transaction evidence must be recorded separately; generated code and mocked tests never constitute network proof.

## Results on 20 October 2026

- GenVM AST lint: passed all 3 checks.
- GenVM semantic validation: passed (5 methods, 4 views, 1 write) against cached artifact `v0.2.16`. The default latest-release lookup stalled before using the cache; the artifact version was explicitly pinned and the full semantic validator still ran.
- TypeScript passed before the dependency tree was damaged by stalled npm reinstalls. A clean reproducible install/build/Vitest/Playwright run remains required.
- Two pre-remediation assessment transactions, `0x8e13b3b777483e1ebc1a945317d9691cf03b3cfeb77e4c2d8c7ccb4c6f04ff69` and `0x56e8c7fe36fcac823d53cc2edace30f04adcd8d23989f70a2039bb385f2c11cf`, reached `MAJORITY_DISAGREE`. This is real evidence of independent substantive evaluation and exposed an over-strict equivalence signature.
- After limiting equivalence to stable decision fields, `0xa9da5abcabfd673ca761ad9ce8c4dc5bbcabf44a41c4ded25332e0f6ebaaf1a1` finalised with `MAJORITY_AGREE` (three agree, two disagree) and successful executions.
- Direct `list_entries` returned the accepted `ubuntu` record, ID `531a697d2d89ee919efd469c5501d21c0bece09364f84fe2b989c3dc8f1f4b84`, with `SUPPORTED` documentation.
- Limited-evidence case `0xb551fbef4ecf52a7105e4923a764e7cda16165451ee72460037db124334c9011` finalised and persisted as `INCONCLUSIVE` with `LIMITED` documentation.
