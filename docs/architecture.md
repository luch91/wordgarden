# Architecture

WordGarden is a static React/Vite application intended for Cloudflare Pages. The browser reads canonical records directly from GenLayer with an account-free `genlayer-js` client. A compatible injected EIP-1193 wallet signs `submit_entry` writes; no private key enters application state.

The GenLayer registry owns submissions, evaluation results, contributor history and accepted-record indexes. The frontend renders only final records returned by the contract. Form previews and local pending transaction identifiers are explicitly non-authoritative. There is no database, Pages Function, standalone Worker or paid external model.

Routes are `/`, `/plant`, `/plant/:id`, `/collections`, and `/mine`. Cloudflare Pages uses `public/_redirects` for SPA deep links.
