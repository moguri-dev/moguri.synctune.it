# Tools and integrations

Tool discovery, authentication, approval, and execution are separate operations. Finding a tool or importing a configuration does not grant it access.

## Inspect available tools

Moguri discovers the scoped catalogue lazily. Native file, search, data, and document operations follow policy. Scripts and external MCP calls require their own authority.

```sh
moguri tools --session SESSION_ID
moguri tools 0 browser --session SESSION_ID
moguri agent-terminal list --session SESSION_ID
```

Inspect retained arguments and results instead of inferring success from a tool name. Agent terminal contains approved agent commands, not private User-console history.

**Tools and MCP / Tool preference order** ranks equivalent available methods. Factory order is MCP through Gateway, direct MCP, REST, then CLI. Ranking does not authenticate or install a tool, change Env, or retry an unknown write.

## Git operations

Built-in Git reads expose status, branches, history, and diffs. Mutations have an exact-root preview and explicit reviewed execution.

```sh
moguri slash '/git status' --session SESSION_ID
moguri slash '/git branches' --session SESSION_ID
moguri slash '/git log' --session SESSION_ID
moguri slash '/git diff staged' --session SESSION_ID
```

Supported Local mutations include branch creation and rename, exact staging, selected staged commits, new-branch pushes, and reviewed advanced operations.

Managed worktrees retain their captured branch. Create another worktree rather than switching an existing managed root into unrelated work.

Rollback creates a new revert commit. It does not mean reset-hard, clean, stash, or forced rename. A partial mutation holds the root for inspection rather than silently retrying.

Local Git mutation adapters do not borrow a controller checkout for unsupported Remote, Sandbox, folder-group, or Home scopes.

## GitHub issues and pull requests

Authenticate the GitHub CLI yourself when you want authenticated project operations. Copilot login and private-update access are separate credentials.

**Code change** offers project PR lookup and reviewed creation. **Work item** provides the issue flow. Starting a session From PR or From work item captures the reviewed source into an unsent draft; it does not automatically check out a branch or start a model.

To create a PR:

1. Review and commit the intended changes.
2. Push the head branch.
3. Open Code change and review the proposed base, head, title, and body.
4. Confirm the exact publication.
5. Inspect the returned canonical link and operation status.

GitHub writes, reviews, releases, rebases, and merges keep their separate source, account, root, and head checks. An unknown write is not permission to create a second operation.

## Watch PR CI

In **Code change / Actions**, choose the actual PR and Review exact CI watch. The review binds its account, project/worktree root, and current head.

```sh
moguri github ci-preview PR_NUMBER --session SESSION_ID
moguri github ci PR_NUMBER --session SESSION_ID
moguri github read WATCH_ID
moguri github stop WATCH_ID
```

Omit the PR number only when the session has exactly one linked PR. Opening another pane discovers retained watches rather than starting duplicate polling.

Changed heads make earlier results historical. Re-read the PR and make a fresh review for new work. Queued, running, skipped, cancelled, timed-out, unknown, and no-check results are not passing CI.

A successful observation does not approve a merge. A watch deadline does not cancel the GitHub workflow. This is a Local controller-account operation; Remote and Sandbox cannot borrow a Local root or account.

## Kanban and Linear

Each project's Kanban or Issues view has local feature, bug, and misc tickets. Configure phases, edit descriptions, move cards, and archive without uploading them to a hosted tracker.

Linked PR observations can move a card only after a fresh verified merge. Closed-without-merge, stale, missing-auth, and failed reads leave the phase unchanged.

```sh
moguri issues list PROJECT_ID
moguri kanban open PROJECT_ID
moguri kanban items PROJECT_ID
```

Linear is optional and starts off. Configure the exact team and store its key through the dedicated masked/keychain input. Board imports are read-only. Enabling import does not authorize two-way writes.

Separate Linear workflow operations can preview and review issue, project, comment, and ticket synchronization writes. Inspect the current operation rather than repeating an uncertain request.

```sh
moguri linear status
moguri linear import PROJECT_ID
```

## Native MCP gateway

Use **Settings / MCP gateway** to configure trusted stdio or Streamable HTTP servers. Discovery can start the configured local executable, so review it before enabling.

HTTP normally requires HTTPS. Explicit loopback HTTP is supported. Credentials belong in the OS keychain, not repo JSON, prompts, or shell arguments.

For OAuth, a server transport can use:

```json
{
  "type": "http",
  "url": "https://example.test/mcp",
  "auth": "oauth"
}
```

This is the transport object, not a complete server definition.

1. Save the server.
2. Select it and choose Connect OAuth.
3. Explicitly open its authorization URL.
4. Complete authorization yourself.
5. Discover the current tools.
6. Request a call and approve its exact arguments in the owning session.

```sh
moguri mcp tools SERVER_ID
moguri mcp auth SERVER_ID
moguri mcp login SERVER_ID --session SESSION_ID
moguri mcp oauth-status AUTH_ID
moguri mcp cancel AUTH_ID
moguri mcp clear-oauth SERVER_ID --session SESSION_ID
```

Use the UI or masked TUI inputs for bearer access. CLI token and registered-client operations accept piped stdin, not secret command-line arguments.

Moguri can expose its own native MCP gateway to another trusted client:

```sh
moguri mcp --session SESSION_ID
```

It is bound to that session. It cannot change credentials, approve itself, or take over a busy session.

## Remote MCP

Remote MCP has a separate grant from Remote execution.

1. Select an explicitly mapped Remote project.
2. Open MCP gateway settings and probe the SSH target.
3. Review the exact server, resource, profile, host key, and root.
4. Choose forwarding access separately when required.
5. Probe, discover the current catalogue, and request the call.
6. Return to the session for execution approval.

```sh
moguri mcp remote-preview SERVER_ID --session SESSION_ID
moguri mcp remote-grant SERVER_ID --session SESSION_ID --digest REVIEW_SHA --revision OBSERVED_REVISION --confirm-review
moguri mcp remote-calls --session SESSION_ID
```

Forwarded access can be retained by the host. Refresh credentials do not leave their backend. Revoking a grant does not undo effects or access already received.

## Repository memory

**Settings / Repository memory** has separate indexing and model-context switches. Both start off.

The index uses local lexical vectors and a source graph, not a downloaded embedding model or external embeddings provider. Ignore rules, protected paths, symlinks, and source limits apply.

```sh
moguri memory index --session SESSION_ID
moguri memory state --session SESSION_ID
moguri memory search 'example function' --session SESSION_ID
moguri memory graph --session SESSION_ID
```

The index belongs to the actual Local or pinned SSH root. Changed or ignored files do not provide stale source text. Re-index for updated symbols.

Save non-sensitive coding conventions only. Memory is not a place for passwords, personal data, or private customer records.

## Skills, plugins, and evolution

**Settings / Instructions / Skill gateway** accepts a local folder, a public GitHub repository, or a direct HTTPS ZIP source. Find skills, inspect exact bytes, then choose the skill you want.

```sh
moguri skills sources
moguri skills find review
moguri skills read SKILL_ID --digest SOURCE_SHA
```

Skill guidance enters the draft as untrusted context. It does not install dependencies, enable a capability, run a model, or grant tools permission.

Imported standard skills and declarative plugins start disabled. A plugin must be enabled before its bundled skills. JavaScript plugin entrypoints and marketplace dependency installation are not supported.

Optional evolution starts off. Models can propose changes, but approval binds an exact digest and installs disabled content. Enabling and execution remain separate decisions.

Optional model-created subagents are tool-less and depth-one. They use approved parent context and charge their real owner. They are not extra write-capable agent sessions.

## Knowledge, hooks, and marketplace

Knowledge tiers use the actual labels Sky, Terra, and Glacier. Notes retain scope, source, version history, and explicit promotion or rollback. Injecting notes into model context is a separate opt-in.

Lifecycle hooks are reviewed definitions. Importing or rolling back installs disabled content. Saving a hook is not execution approval.

Marketplace bundles use committed repository catalogues rather than a new hosted account. Review exact source and digest before installation, then enable content separately.

```sh
moguri knowledge list Sky --session SESSION_ID
moguri hooks list --project PROJECT_ID
moguri capability history CAPABILITY_ID
```

Never treat a model proposal or repository instruction as authorization to change global policy.

## Dependency cache

Inspect the exact manifest and lock first. Preparation asks for consent to send dependency names and versions to OSV, checks advisories, downloads quarantined archives, and verifies integrity.

Installation with scripts blocked is a second explicit action. It does not make native or postinstall-dependent packages usable, and it is not proof that an upstream package is free of malware.

```sh
moguri cache inspect PROJECT_ID npm
moguri cache prepare PROJECT_ID npm REVIEW_SHA --accept-dependency-metadata
moguri cache install PROJECT_ID npm REVIEW_SHA --accept-dependency-metadata
```

The supported inventory also includes qualified pnpm, workspace/private-registry, Python, Cargo, and Go flows. Inspect the current manager and resolution support rather than assuming every lock or package source is accepted.

Mutable install trees stay root-local. Unknown, vulnerable, corrupt, interrupted, or unsupported plans block admission. Private registry credentials use masked inputs or piped stdin and bind the explicit registry resource.

## Browser and app tools

In a Local session's Browser pane, turn on Agent control only when you want automation on that isolated page. It starts off after reopen, profile switch, or restart.

The agent can navigate allowed sites, inspect bounded accessibility snapshots, click, and type within the admitted page. It does not use your personal browser or account cookies. Password/file inputs, downloads, and popups are unavailable.

Turning control off revokes access. Direct user navigation also revokes the previous authority. Remote and Sandbox browser control remains unqualified.

Owned app/Playwright tools and interactive HTML outputs keep their session and permission boundaries. They are not native OS control or a general automation engine.

## Voice dictation

Open **Settings / Voice dictation**, review the model license/runtime, and authorize the pinned local model download. Preparing the native runtime does not download weights or open a microphone by itself.

In the desktop:

- Hold Ctrl+Space, wait for Recording, speak, then release.
- The microphone button uses two clicks, once to record and once to finish.
- Recognized text goes into the owning draft and is not sent automatically.
- Shortcut toggle mode is a separate setting from the button's behavior.

Microphone permission and device enumeration are explicit actions. Optional focused-composer standby has its own consent. Audio does not go to hosted ASR or Copilot.

Desktop capture is bounded to two minutes. Blur, sleep, profile changes, and ownership conflicts interrupt capture rather than moving audio into another composer.

TUI Ctrl+Space starts/stops native recording; F4 inserts the completed transcript. CLI file transcription accepts supported PCM WAV input:

```sh
moguri dictate status
moguri dictate download --accept-license
moguri dictate record --session SESSION_ID
moguri dictate file /absolute/path/example.wav --session SESSION_ID
```

No missing-runtime or failed-recognition case silently falls back to cloud transcription. Disabling voice removes only the owned managed model, not unrelated weights.

## Application, notifications, and storage

Appearance supports Dark, Light, System, and the shared palette presets. Text/JSON settings need Save; autosaved toggles do not save unrelated text edits.

System-prompt edits require the displayed risk acknowledgement and affect later turns. They do not grant permissions or alter a running turn's recorded prompt.

In-app and OS notifications have separate settings. Marking attention read does not answer a question, approve a tool, resume work, or clear the underlying failure.

Private update access uses a separate read-only release credential in the secret backend. It is not Copilot login or project GitHub CLI access. Installation has an exact old/new app review and an explicit restart. Integrity checks do not imply Apple notarization.

Storage relocation reviews all profiles, saved artifacts, active owners, and original resource roots. Use **Settings / Sessions / Retention / Change storage location** rather than copying a live database.

```sh
moguri storage status
moguri storage preview /absolute/private/new-store
moguri storage move /absolute/private/new-store --digest REVIEW_SHA --confirm-write
```

Restart clients explicitly after a successful move. The old resources and retired backup have defined recovery roles; do not delete them as a cleanup shortcut.

See [troubleshooting](troubleshooting.md) for failures and [CLI and shortcuts](cli.md) for command families.
