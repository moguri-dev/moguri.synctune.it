# Artifacts

Technical reference for **Settings / Artifacts**. The app shows a short summary;
this page keeps the full detail.

## Artifacts tab (protocol 114)

The **Artifacts** tab next to Automations browses **All projects** (every project plus the chats without a project, the
default when no chat or project is open), one project, or only the chats without a project: build outputs
from dist/out/build/release-style folders in the checkout and session worktrees, files agents wrote, chat images, links
and these saved documents. Under All projects each item also names its project, and search matches project names. Each
item links to its chat when known. **Show in Finder** only reveals a file the service
currently lists; nothing is opened or run. Saved documents are still edited here.

Select saved notes and files with their checkboxes (or use an item's **Delete** / **Move to Trash**), then confirm.
Files go to the system Trash and can be restored from there; saved notes and their revisions can't. Chat images and
links are part of the conversation and aren't deletable. Files in a workspace folder project's own checkout are
read-only and never moved. Contract:
`docs/architecture/skills-tools-artifacts.md`.

## Documents

Previously titled "Retained documents". Ordinary artifacts are independent of session retention (see
`docs/architecture/domain-model.md` and the repository instructions on artifacts).

- Retained text is independent of sessions. It never becomes automatic instructions or model context, and
  media is not copied.
- Source labels (old wording): Remote snapshots were "User-requested Remote file snapshot, not a chat
  answer or permission"; checkpoints were "Deterministic budget checkpoint. No model answer or successful
  Git commit is implied"; question answers were "Actual user answer; the model question is context, not
  permission" or "Automated answer, not a human instruction"; manual text was "User-entered text, not
  verified authorship"; model messages were "Model output, not a human answer"; user messages were
  "Canonical user message"; otherwise "Source authorship unknown".
- Saving changes no conversation, source file or policy.
- Role sequences: recorded data only, not a code approval or permission. The role contract view shows only
  the original declared output and context checks; "valid" is not code quality, independent lineage or
  acceptance. Contract: `docs/architecture/owned-role-contracts.md`.
- Immutable records (old wording):
  - Sandbox runs and publications: "Immutable native input/result, original owner and actual
    source-publication acceptance. Use Sandbox to inspect exact outputs; metadata edits cannot rewrite
    provenance or authorize source copying."
  - Role sequences: "Immutable role input and actual model observations. Protocol completion is not a user
    answer, code-quality proof or approval."
  - Generations: "Immutable generation input/result. Actual model provenance is retained; staging and
    application require separate reviews."
  - Generated candidates: "Derived from a canonical model proposal. Immutable bytes, model provenance and
    actual user acceptance stay separate."
  - Imported candidates: "Imported proposal with unverified authorship. Its immutable bytes and actual
    acceptance are separate; use Candidates to review/apply."
  - Edited metadata was marked "explicitly edited".
- Edit conflicts preserve the local edit; reload committed values before another save.
- The "Source provenance" details (now "Source details") show origin, origin session, workspace, path and
  sources as JSON.
- Export leaves stored copies unchanged.
- Delete removes this artifact and its revisions (its retention grants), not source files, conversations
  or other retained copies. The confirmation previously read "Delete this artifact's grants."
- Promoting a message: model output keeps its model actor; retaining it does not label it as a human
  answer. The message must come from the current source session.

## Copy project documents into the repository

Also used in the project removal dialog. Contract: `docs/architecture/managed-workspaces.md` (artifact
repository copy) and `docs/architecture/domain-model.md` (artifact repository job).

- Copies all retained project revisions, including archived documents, into a new private JSON file
  under `artifacts/` in the attached base folder or a ready managed worktree. Review sensitive content
  before an optional local Git commit. No overwrite, checkout, push or automatic instruction loading.
- The optional commit goes to a new local branch from the shown parent; the current checkout and index
  remain unchanged.
- Failure paths: if the artifact set changed, reload the removal preview before writing; if the job does
  not complete, inspect its destination (no source documents are deleted); a completed copy without a
  verified receipt preserves stored documents; if the source set or destination changes during
  publication, inspect the completed job and review again.
- After a verified copy, stored Moguri documents remain until a separate explicit deletion.

## Decision-provider history

Previously titled "Decision-provider observations". Contracts: `docs/architecture/owned-decisions.md`,
`docs/architecture/decision-primitives.md`.

- The actual model actor is `decision-provider`, never the user. Advice cannot grant permission, infer
  user-only facts, accept source code or approve Git. Reports remain independent of the original source
  session.
- Field labels (old): "Actual role / model", "Original parent execution / worker", "Provider / requested
  API model", "Source session / turn", "Original request / model step" ("Not admitted"), "Owned role /
  cancellation / cleanup" (v2) or "Worker / cancellation / cleanup" (v1) with "Not acknowledged",
  "Reported tokens" ("Unknown; original hold remains" / "No model call admitted"), "Held tokens"
  ("Unknown / blocks finite admission"), "Provider / billed USD" ("Not reported; never inferred as
  zero"), "Applied actor / choice" ("No automatic effect").
- When the original source session is deleted, no other session, root or owner is adopted.
- The raw result is raw provider data, not a human instruction or calibrated reliability. The resolved
  provider version is not inferred from a configured API model ID.
- A failed stop leaves the original held charge and worker to inspect; nothing is retried.
- Readiness errors: when readiness is unavailable, Autopilot cannot assume a provider or policy.
