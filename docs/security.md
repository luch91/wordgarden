# Security notes

- Public configuration is limited to RPC, chain ID, explorer and contract address.
- The browser never requests or stores a private key.
- User text renders through React; no untrusted HTML is injected.
- External evidence links open with `rel="noreferrer"`.
- The form repeats the warning that submissions are public and irreversible.
- The contract enforces size, URL, evidence-count, capacity and pagination bounds.
- Retrieved pages are explicitly described to validators as evidence, not instructions.
- A pending transaction ID may be cached for refresh recovery; it is not authoritative application state.
