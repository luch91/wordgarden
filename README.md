# WordGarden

A botanical museum of human language, rooted in a real GenLayer Intelligent Contract. Visitors can explore accepted documentation without a wallet; contributors use a compatible EIP-1193 wallet to submit a word, meaning, example, cultural context and bounded evidence for independent assessment.

## Local development

```bash
cp .env.example .env
npm ci
npm run dev
```

Set the deployed production registry address in `VITE_GENLAYER_CONTRACT_ADDRESS`. With no address, the application deliberately renders an honest waiting state rather than sample records.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

See `docs/00-preflight.md`, `docs/architecture.md`, `docs/contract-spec.md`, and `docs/deployment.md` for the network and delivery boundaries.
