# Skills

Technical reference for **Settings / Skills**. The app shows a short summary;
this page keeps the full detail.

The **Skills** tab next to Automations shows the same installed skills with
On/Off switches, a **Marketplace** that installs a skill from these sources
into one project or every project, and the agent's toolsets. Contract:
[skills, tools and artifacts](../architecture/skills-tools-artifacts.md).

## Skill gateway

- Sources can be a local skill folder, a public GitHub repository or a direct HTTPS ZIP archive.
- Each search and each read refreshes and validates the source; a lookup error returns no stale result.
- No scripts run, no skills are silently installed, and skill text cannot grant permissions.
- Sources belong only to the current profile and are read on the Local control plane, also for Remote sessions.
- Remote (SSH) sessions load skills with the same approval rules. The first use copies the skill's files to a Moguri folder on the SSH host (`<state>/skills/<SHA-256>/`); its scripts run there only after normal command approval. Sandbox sessions can't load skills yet.
- Contract: `docs/architecture/skills-and-rewind.md`.

## Global skill folders

- `~/.agents/skills` and `~/.moguri/skills` can be used separately or together.
- Confirming a folder creates it if it is missing and saves it to the profile's sources.
- A missing folder offers no skills and never blocks the others.
- Confirming does not scan the folder at that moment; adding it does not install skills, run instructions or grant model or tool permissions.
- If loading the presets fails, no directory is scanned.

## Install from a source (protocol 114)

- **Install** in Customize / Marketplace re-reads the source and installs those exact bytes as a disabled skill in the chosen
  project or, with **All projects**, for every project. A changed source needs a fresh search.
- Installing grants no tools. Reinstalling changed bytes under the same name updates that skill to a new disabled
  revision; identical bytes and plugin-owned names are refused.
- TUI: `/skills install ID SHA [global]`. CLI: `moguri skills install ID --digest SHA [--project ID]`.

## Find skills

- Only saved, enabled sources are read.
- All downloads are checked again when a selected skill is opened; a changed body needs a fresh search (the results line used to say "This search used fresh source bytes").
- Previewing a skill is not permission to run its instructions or to access a different execution host.

## Skill approvals for this session (was "Skill source reviews")

- Discovery and source reads are not admission (approval).
- A hash or repository label is not publisher identity; neither is a name, description or scanner result.
- Approved (admitted) skill context is limited to reviewed native file tools: never commands, network, credentials or automatic permission.
- The source and admission transport is Local-only; there is no controller fallback for non-Local sessions.
- Excluded protected paths cannot be dependencies of the skill.
- External references in the skill are not fetched, inspected or authorized.
- Allowed paths are literal paths. Write access ("Read and write files") is offered only when the skill declares native-file access, and stays under current hard policy.
- Signed publishers: verify against the documented `moguri-skill-artifact-v1` signature payload with a separately user-pinned Ed25519 key. Pinning proves control of this reviewed key, not an independently verified real-world organization. HTTPS archives require a pinned signature.
- Unverified publishers record an actual-user Local review acknowledgement.
- Saved publisher keys: when the profile has saved keys, **Publisher key** offers them instead of pasting a key.
- Indicator findings: the review lists pattern matches (hidden characters, download-and-run, credential paths,
  instructions to override rules and so on). They are advice, not a safety verdict. A skill from a trusted folder
  that contains invisible or bidirectional control characters isn't loaded automatically; approve it here.
- Approvals expire (the UI requests 24 hours; the service allows at most 168).
- Revocation blocks future consumption and effects. It cannot retract instructions already delivered to a model or undo work already running. A rewind never restores an old source grant.
- Contract: `docs/architecture/skills-and-rewind.md`, `docs/setup.md` (skill admission section).

## Source chat

The chat picker was previously labeled "Source chat for skill admission". With no chat selected: choose a
source chat to review exact skill admission; no session or workspace is inferred. Save or cancel skill
source folder changes before reviewing session admission.

## Imported skills

Import standard SKILL.md front matter and instructions. A skill grants no tool permissions.

Built-in slash commands always take precedence. A skill named like one (for example `review`, or a
TUI command such as `trace`) shows "Rename the skill (the name in its SKILL.md) to use it with /." on
its row, after import, in Find skills and in the slash menu. It still works when attached by its
exact entry.

## Skill changes status

Toggling skills reports "N of M skill changes acknowledged"; existing source reviews and permissions are
unchanged. Deleting a skill: sessions that admitted it lose access; no other capability or permission
changes.

## Delete confirmation

Chats that admitted the skill lose access. Its version history stays in this profile's encrypted event
history.

## Publisher keys

- **Save publisher key** stores an Ed25519 public key (PEM) and a name for this profile. Saving needs the
  confirmation that you got the key through a channel you trust. A key verifies signatures; it doesn't prove who
  the publisher is.
- **Block key** permanently blocks a key fingerprint, whether saved or pasted. **Block this version** permanently
  blocks one exact skill version by its artifact SHA-256 (shown in each review and approval).
- A block stops new approvals and every later load or effect of anything it covers, in every chat of the
  profile. It can't recall instructions a model already read. Blocks can't be undone.
- CLI: `moguri skills publishers`, `moguri skills publisher-save NAME KEY.pem --confirm-review`,
  `moguri skills block key|artifact SHA REASON --confirm-review`. TUI: `/skills publishers`,
  `/skills publisher-save confirm-trusted JSON`, `/skills block key|artifact SHA confirm-block REASON`.
- Contract: `docs/architecture/skills-and-rewind.md#source-indicators-and-publisher-trust-protocol-112`.
