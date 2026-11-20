# Lifecycle hooks

Technical reference for **Settings / Lifecycle hooks**. The app shows a short summary;
this page keeps the full detail.

## Shared behavior

- Imports, updates and rollbacks always install content disabled. Enabling never grants tools, Git or other
  permissions. Every hook or script still follows the session's root and mode policy, needs exact command
  approval, supports cancellation and records partial outcomes truthfully.
- A project must be selected; no extension inherits an unrelated root.
- If an extension action fails, Moguri never infers a successful install or execution.
- Enabling, disabling or rolling back requires confirming that you reviewed the exact content bytes and their
  execution requirements (shown with their SHA-256 content digest and revision). If another client changed the
  item, the old review cannot enable or replace it; review the current content again.
- Rolling back creates a new disabled revision with the earlier content; existing history is never rewritten.
- Inserting an enabled skill adds it to the saved draft only; nothing is sent or approved.

## Lifecycle hooks

- Turn-start hooks finish before any model reservation or request. Turn-end hooks run only after the solver
  completes normally and successfully.
- A failed or denied hook stops continuation. Cleanup or cancelled turns do not launch additional hooks.
- Tool-less roles and read-only chats never execute hooks.
- Importing a hook runs no command; review and enable it separately.

## Repository marketplace

- Catalogs come from a registered repository at an immutable full commit SHA. They are read from Git objects,
  never from an unreviewed checkout or a URL.
- No hosted account, clone, fetch, installer or executable entrypoint is involved.
- Declared licenses are informational, not a trust certification.
- Installing or updating a bundle installs it disabled and executes no code. Previous versions remain
  reviewable.
