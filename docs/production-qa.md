# Production QA — 21 October 2026

`https://wordgarden-7fl.pages.dev` was tested in headless Google Chrome at 1440×1000, 768×900, 375×812 and 320×720 with reduced motion. The real `ubuntu` record rendered on desktop/tablet/375; its detail and collections pages rendered at every width, direct refresh worked, and no JavaScript errors or horizontal overflow were observed. One 320px initial collection read timed out during a transient Studio RPC delay, while its direct detail and collections reads succeeded; this is documented as a reliability limitation rather than hidden.

Read-only exploration requires no wallet. Wallet access is requested only on Connect/submit. The submission view distinguishes preview from finalized records, preserves a transaction hash during consensus, waits for `FINALIZED`, and then reads canonical state. Owner-device wallet-extension confirmation remains required because no compatible extension is available in the automation browser.

Cloudflare project `wordgarden` is independent Git-connected Pages, main branch, `npm run build`, `dist`; it is not a Worker and is not shared with vAtlas.

Decision: **GO for owner review; NO-GO for automatic submission pending owner approval and account-specific portal capacity.**
