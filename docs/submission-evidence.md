# Submission evidence

Status: **technically ready for owner review; official submission not authorised**.

- Project: WordGarden
- Use case: a botanical public registry for culturally significant words whose documentation is assessed through GenLayer consensus.
- Repository: https://github.com/luch91/wordgarden
- Cloudflare Pages URL: https://wordgarden-7fl.pages.dev
- Functional contract: `0x53E378b8783dAe7c1A2E67bFd36E1c66bd79665b`
- Network: StudioNet, chain ID 61999
- Deployment transaction: `0xc48aad31aead223c14dc3b9be367d27e5ff376419b4380a112ec59630e9cf4f1`
- Finalised accepted assessment: `0xa9da5abcabfd673ca761ad9ce8c4dc5bbcabf44a41c4ded25332e0f6ebaaf1a1`
- Successful read: `list_entries(0, 25, false)` returned the persisted `ubuntu` record with `SUPPORTED` documentation.
- Independent validation: the final receipt contains three `AGREE` and two `DISAGREE` validator votes. Earlier over-strict versions produced two `MAJORITY_DISAGREE` outcomes and no state write.
- Production deployment: `29d5b5cb-e48a-4c7f-8255-9064ee64782b`, commit `f2a3026daca30d9bd96bdfdf6f05d36853fc4a48` (a dependency/security QA deployment will supersede this after its passing PR merges).
- Production browser evidence: Chrome at 1440, 768, 375 and 320 widths; canonical/detail/collections routes, keyboard navigation, direct refresh and responsive overflow checks.

Eligibility: the official configuration permits StudioNet for new projects and the Projects category allows two submissions per Monday–Sunday UTC week. Account-specific remaining capacity requires an authenticated portal session. No official submission is authorised.
