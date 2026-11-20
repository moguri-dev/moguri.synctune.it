# Linear workflows

Technical reference for **Settings / Integrations / Linear**. The app shows a short summary;
this page keeps the full detail.

## Linear connection

- The Linear personal API key is stored per profile in the secure secret backend (the keychain). No project is
  needed to store or verify it.
- Team access is configured per project (board configuration), and each external write to Linear needs its own
  review.
- Status line: "API key" shows the credential state; "verified NAME / WORKSPACE" appears only after an explicit
  Verify. Storing a key does not verify the account.
- Removing the key invalidates existing requests and open reviews.
- If authentication cannot be confirmed, no other credential is used.

## Linear workflows panel

- Local tickets stay local until you explicitly publish or push them. Pull and push are separate reviewed
  actions.
- Linear is off by default for each project. Enable it by choosing an exact team and storing a personal API key
  in the board configuration.
- The Linear connection runs from the Local control plane on this Mac. If global policy excludes Local, no Linear
  connection or credential fallback is available.
- Remote sessions, side chats and read-only sessions cannot change Linear or local tickets.
- Browsing: reads are explicit and paged. Collections stop after a five-page bound; a list that reached the bound
  is not a complete collection. "Load field choices" reads only the first bounded page of states, projects,
  cycles, labels and team members; browse later pages explicitly. Reading never uploads content.
- Operation labels were shortened: "Update issue fields" updates only the selected fields; "Delete issue (to
  Linear trash)" uses Linear's non-permanent deletion; "Sync a linked local ticket" and "Publish a local ticket
  to Linear" act on exactly one ticket.
- Ticket sync: only the chosen direction runs. Pull copies Linear title, description, state and archive status
  into the local ticket; push sends local title, description and mapped state. A changed local revision or
  remote base invalidates the review. There is no background sync or automatic export.
- Phase mapping: map each board phase to an exact Linear workflow state UUID, or leave a phase unmapped.
- Optional fields: fields you do not select stay unchanged. A blank value explicitly clears an optional field.
  The workflow state cannot be cleared. Replacing labels sets the exact label set; selecting none removes all
  labels. Priority 0 means none.
- Deleting an issue uses Linear's non-permanent issue deletion. Recovery and retention follow Linear's trash
  policy; Moguri does not claim an undo.
- Review shows the exact fields, original local and remote snapshots, account, root and request. Accepting
  retains the operation and its result independently of the session (it survives session deletion).
- After acceptance, the retained operation status is authoritative and the operation is never replayed.
- Cancelling: writes already dispatched to Linear remain partial unless their result is completely
  acknowledged; nothing is replayed.
- Operation history shows the last 20 operations for the project, each accepted by the user; Details shows the
  retained receipt with the operation, its original inputs and result.
- If an operation fails, your fields are preserved; inspect the retained result before starting a new review.

## No project selected

Choose an actual project folder to configure its Linear team and reviewed workflows. No project or
account is inherited.
