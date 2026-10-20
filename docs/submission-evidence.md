# Submission evidence

Status: **incomplete — not submission ready**.

- Project: WordGarden
- Use case: a botanical public registry for culturally significant words whose documentation is assessed through GenLayer consensus.
- Repository: https://github.com/luch91/wordgarden
- Cloudflare Pages URL: not assigned
- Functional contract: `0x53E378b8783dAe7c1A2E67bFd36E1c66bd79665b`
- Network: StudioNet, chain ID 61999
- Deployment transaction: `0xc48aad31aead223c14dc3b9be367d27e5ff376419b4380a112ec59630e9cf4f1`
- Finalised accepted assessment: `0xa9da5abcabfd673ca761ad9ce8c4dc5bbcabf44a41c4ded25332e0f6ebaaf1a1`
- Successful read: `list_entries(0, 25, false)` returned the persisted `ubuntu` record with `SUPPORTED` documentation.
- Independent validation: the final receipt contains three `AGREE` and two `DISAGREE` validator votes. Earlier over-strict versions produced two `MAJORITY_DISAGREE` outcomes and no state write.
- Live production/browser/mobile evidence: pending Cloudflare authentication and a healthy dependency install.

Known limitations: StudioNet eligibility has not been verified in the authenticated programme portal; no Pages hostname has been assigned; browser E2E remains unexecuted. No official submission is authorised.
