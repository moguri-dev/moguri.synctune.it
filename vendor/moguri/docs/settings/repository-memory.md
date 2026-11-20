# Repository memory

Technical reference for **Settings / Repository memory**. The app shows a short summary;
this page keeps the full detail.

## Repository memory (page help)

A persistent lexical-vector index and import/symbol graph, isolated by profile and actual repository
identity. No hosted embedding provider or extra model key. Changed or ignored sources are marked stale,
never silently treated as current.

## Switches

Previously labeled "Enable explicit repository indexing and retrieval", "Allow bounded retrieved source
snippets to enter model context" and "Allow reviewed Sky/Terra/Glacier knowledge in model context".
Retrieved snippets are bounded in size.

## Index scope

Source capture and freshness checks follow the selected session's Env root (Local, Sandbox or Remote).
Without a session, project actions are explicitly Local. The derived text/vector cache stays on the
control plane; selected snippets may enter the chosen model's context. Protected and ignored paths are
excluded. Save before indexing; opening this page never scans or probes a host.

## Remote warning

Pinned SSH repository memory, not a Local index or SendBox isolation. Inspect the bound index for its
actual peer, root and build. Missing or changed hosts fail without fallback.

## Index job status

A completed job means the complete captured index was published; inspect its binding and source digest.
A stopped or failed job has settled; inspect its outcome and the last complete bound cache.

## Coding-style knowledge

Save only non-sensitive project conventions. Knowledge outlives a session. Model observations require a
proposal and your approval; they are never labeled user-authored facts.
