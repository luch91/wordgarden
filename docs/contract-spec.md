# Contract interface

Frontend integration targets `WordGardenRegistry`, rubric `wordgarden-rubric-v1`.

- `submit_entry(payload_json) -> entry_id` is the signed write. The canonical client sends a `json:`-prefixed JSON string to avoid CLI object coercion; plain JSON strings remain accepted.
- `get_entry(entry_id) -> JSON string` reads one record.
- `list_entries(cursor, limit, accepted_only) -> JSON string` pages at most 25 records.
- `get_entry_count() -> integer` reads registry size.
- `get_entries_by_submitter(submitter, cursor, limit) -> JSON string` reads a contributor's bounded history.

Application assessment (`ACCEPTED`, `REJECTED`, `INCONCLUSIVE`) is distinct from protocol transaction status. Only accepted records returned by `list_entries(..., true)` bloom in the public garden.
