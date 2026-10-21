# Contract verification

- Contract: `WordGardenRegistry`, `0x53E378b8783dAe7c1A2E67bFd36E1c66bd79665b`
- Network: StudioNet, chain 61999
- Deployment: `0xc48aad31aead223c14dc3b9be367d27e5ff376419b4380a112ec59630e9cf4f1`
- Finalized accepted assessment: `0xa9da5abcabfd673ca761ad9ce8c4dc5bbcabf44a41c4ded25332e0f6ebaaf1a1`
- Receipt: `FINALIZED`, `MAJORITY_AGREE`, two rounds; validator votes `AGREE, DISAGREE, AGREE, AGREE, DISAGREE`.
- Direct read: `list_entries(0,25,false)` returned `ubuntu`, `ACCEPTED`, documentation `SUPPORTED`.
- Inconclusive proof: `0xb551fbef4ecf52a7105e4923a764e7cda16165451ee72460037db124334c9011` persisted `nàlú` as `INCONCLUSIVE`/`LIMITED` when evidence was unavailable.

The contract bounds text, evidence, state and pagination; evaluates meaning, usage, attribution and sources; permits limited-evidence oral-language documentation without inventing verification; detects duplicates; and reruns assessment independently in validators. Earlier over-strict equivalence transactions produced genuine majority disagreement without state writes, proving disagreement does not silently finalize data.

AST lint passes. Semantic validation currently fails at SDK artifact retrieval (`E101 HTTP 404`); direct tests, deployed GenVM execution, finalized independent votes and persisted reads are the documented compensating evidence.
