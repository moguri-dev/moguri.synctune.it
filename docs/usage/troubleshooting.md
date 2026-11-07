# Troubleshooting

Start with the actual error, selected profile, Env, root, and operation ID. A launch acknowledgement, first output, or checked-off plan is not proof of a successful operation.

Do not delete state, clear held accounting, kill guessed processes, or switch to another account or checkout to hide a failure.

## Startup and version mismatches

Use a matching app, SDK, service, worker, and runtime. Rebuild a source checkout before launching it.

```sh
node --version
npm run build
node bin/moguri.mjs --help
```

Those npm commands belong to the Moguri source checkout, not a website checkout.

Cold startup can wait up to 60 seconds for the authenticated service and retained-history recovery. An exited launch reports its exit code/signal and private diagnostic path. A timeout does not authorize deleting a writer lock or starting a second owner.

If the installed app moved, inspect and reinstall its managed command through **Settings / General / Command line**. Do not repair a missing bundled service by copying files from another checkout or symlinking a guessed entrypoint.

An event-protocol negotiation error is different from finding the service. Install the corrected matching client rather than increasing a timeout or truncating history.

## Inspect state safely

On macOS, the default state directory is `~/Library/Application Support/Moguri`. `MOGURI_STATE_DIR` selects an explicit private directory, which must be user-owned, non-symlink, and mode 0700.

Connection metadata, SQLite, and lock files belong to the service. Do not commit them, edit the live database, or include connection tokens in diagnostic reports.

`service.log` is append-only. A nearby ready line does not prove that the failing attempt succeeded.

`moguri service info` can start a service; it is not a read-only file-inspection command. Restart is explicit:

```sh
moguri service restart
```

Restart interrupts active model and tool work while preserving saved drafts, unclaimed queues, receipts, artifacts, and unknown charges. Authenticated user terminals can reattach without input replay.

An unconfirmed writer, recovery claim, or failed private cleanup requires inspection. Do not manually recreate connection metadata or remove files to force a new owner.

## Command not found or wrong app

Check your terminal, not Electron's inherited PATH:

```sh
command -v moguri
moguri --help
```

Use the installed app's managed command action and your shell's actual PATH configuration. Existing aliases or other commands can take precedence.

If the app moved, remove only the unchanged managed launcher through the actual app and install again. Do not overwrite an unknown file at `~/.local/bin/moguri`.

A development or mounted/translocated app cannot perform managed installation as if it were the installed bundle.

## Copilot and keychain errors

Confirm that the selected profile is signed in, the account is entitled, and its policy permits the model. Sign in explicitly again when refresh or authorization fails.

Moguri does not scrape credentials from editors or substitute `gh` or updater access for Copilot login. A missing keychain must be repaired rather than replaced with plaintext secrets.

After login, select a model. Opening the app or authorizing the provider alone does not choose one.

For an authentication report, include the error code and non-secret status. Never include the one-time code, refresh token, endpoint key, or local SDK connection token.

## Model missing or endpoint unavailable

Use the actual catalogue:

```sh
moguri models catalogue
moguri models refresh
```

Check disabled providers/models, the exact selected source, endpoint URL, authentication, and advertised model ID. Start your own model server when needed; saving a declaration does not start it.

For Remote, loopback refers to the SSH host. Local endpoint keys do not automatically work there.

An unavailable source remains an error. Do not interpret a cached name as readiness or expect silent provider fallback.

## Context, images, and documents

An unsupported context window stays visible and blocks inference. Choose a current allowed value or reset the setting; do not manually truncate saved history.

Images require a capable model. Switching to a text-only model can make retained image context incompatible. The draft is preserved rather than silently dropping the image.

For a document failure, check size, encryption, malformed archives, active content, and supported page/sheet/cell bounds. Scanned PDF pages have no built-in OCR. Word extraction is not a visual-layout conversion.

Text pastes over 50 lines become retained files. If their save fails, keep the unsent text and resolve the reported conflict instead of assuming it was attached.

See [context limits](sessions.md#attach-context) and [document reads](sessions.md#read-pdf-word-and-excel-files).

## Budget exhausted or usage unknown

Check session, profile, and global hard policy. An Unlimited preference can still be restricted by hard policy.

```sh
moguri budget status SESSION_ID
moguri dashboard usage
moguri dashboard cost
```

Unreported or interrupted calls keep reservations held. Changing profiles, deleting sessions, resetting preferences, or switching models does not refund usage.

USD caps need accepted, current model-specific estimates. Unknown pricing is not zero or a subscription bill. Resolve the explicit pricing/hold diagnostic rather than guessing a cheaper model.

## Draft conflicts and stuck queues

A saved acknowledgement means the service accepted the revision. Unacknowledged text remains local.

Use Reload saved draft or Keep my draft after inspecting both versions. TUI Ctrl+R and Ctrl+S expose those actions. Do not close with unsaved text unless you intentionally discard it.

Held queues require Run or Resume queued work. Restart does not drain them. A steer that missed its turn is unapplied; explicitly convert it to a new queued turn if that is what you want.

Retry last model request acts on the retained eligible failure, not a new draft. Automatic recovery has bounded profile-wide rounds at 30, 90, 120, and 180 seconds. It does not replay earlier tools, hooks, installs, or publications.

Stop cancels recovery. Native work that rolled back its private stage needs inspection/preparation, not automatic restaging on your behalf.

## Partial work and locked roots

Only one active agent writer leases a filesystem root. A failed or unconfirmed operation can quarantine that root across related sessions or profiles.

Inspect the exact files, process owner, receipts, and retained result before Resume. A cancellation can leave written bytes or external effects. A stopped process group is not proof that every detached descendant ended.

Do not retry a side effect under a new ID just because the original response was lost. A pending or unknown receipt needs inspection.

Independent worktrees can have separate writers. Renaming a navigation folder or switching profiles does not escape the original root's quarantine.

## SSH failures

Check the pinned host key, identity-file ownership/mode, worker version, runtime, and canonical project mapping.

```sh
moguri remote status
moguri remote probe
moguri remote reconcile RUN_ID
```

A changed key needs independent verification and a fresh review. A changed root or symlink alias is not the same workspace.

Reconcile reads original receipts and late usage. It does not replay commands. If cleanup is unconfirmed, inspect the actual remote processes before acknowledgement.

Remote failure never justifies a Local checkout, account, or model fallback. SSH browser localhost ports are not implicitly tunneled to your machine.

## Sandbox not ready

Current managed setup can still fail before guest readiness. Use its actual operation diagnostic, bundled worker/runtime identity, and qualified prerequisites.

```sh
moguri sandbox status
moguri sandbox runs
```

An enabled setting, old image, or historical successful launch is not current qualification. Do not paste unrelated hashes, remove guards, or switch to Local when hard policy requires containment.

Cancelled setup preserves the draft and original Env. Failed native private work can require inspection or explicit preparation before Retry.

## MCP and OAuth errors

Check the exact server definition, issuer/resource, registered redirect, and current tool schema. A fixed occupied callback port is an error, not permission to substitute another redirect.

Cancel an unfinished authorization, then explicitly reconnect. Credentials stay in the keychain. A missing grant does not trigger an anonymous request or automatic tool retry.

Remote access forwarding, resource grants, and each actual call approval are separate. Revoke when needed, but inspect effects already received by the host.

## Dictation and device errors

Confirm explicit model/runtime setup and OS microphone permission. Wait for Recording before speaking.

The microphone button is click-to-start/click-to-finish. The default Ctrl+Space shortcut is held push-to-talk. Releasing the mouse is not the same as ending click-owned recording.

Ownership loss, sleep, blur, or profile changes interrupt capture. Recognized text already inserted remains in the draft. Empty recognition is an explicit failure, not invented text or cloud fallback.

Select the intended native backend and device explicitly. A failed backend or device does not silently switch to another.

## Cache and storage errors

An interrupted cache install preserves its old tree or private recovery data. Check the exact manifest/lock/plan and original filesystem before retrying. Script-free installation is not proof that a native package is operational.

Do not delete `.moguri-dependencies-*` recovery paths blindly or force a cross-filesystem rename by moving private authority.

Storage relocation keeps original resource roots and a retired database backup. An explicit `MOGURI_STATE_DIR` is not cleared automatically. Missing/corrupt locator metadata requires restoring the exact reviewed files, not recreating a stale writer.

## Report a problem

Include the installed build and platform, client type, profile scope, Env, error code, operation ID, and the steps that led to it. State whether the outcome is failed, partial, pending, or unknown.

Use bounded redacted log excerpts and synthetic examples. Do not share credentials, connection metadata, private prompts, customer files, or personal data.

For exact syntax, return to [CLI and shortcuts](cli.md). For the boundary behind a refusal, use [permissions and execution](execution.md).
