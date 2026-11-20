# Sandbox

Technical reference for **Settings / Sandbox**. The app shows a short summary;
this page keeps the full detail.

## Ready-to-use Sandbox (managed SendBox setup)

Also shown in the Sandbox setup dialog opened from the composer Env picker (compact mode).
Contract: `docs/architecture/managed-sandbox.md`, network scope in `docs/architecture/native-network-policy.md`.

- Moguri supplies its pinned worker image, Linux Node runtime and native dependencies. The user reviews
  once; private workspaces and the selected provider's DNS aliases are then managed automatically.
- The panel shows the configured SendBox version and the version bundled with this runtime ("not included
  in this runtime" when the app has no bundled distribution). New versions install side by side, never
  over the existing SendBox.
- The provider network switch allows the selected model provider's actual HTTPS endpoint and its public
  DNS aliases.
- GitHub website/API access is always included. The user reviews the selected release's network
  delegation in the setup review: SendBox expands `github.com` through GitHub Meta, including
  shared-cloud IP ranges. No host credentials, private or cloud metadata addresses, or Local fallback are
  granted.
- The setup review heading previously also showed the Moguri worker protocol number
  ("SendBox X / Moguri protocol N"); the protocol now appears inside the checksum details.
- The bundled review includes Linux Node 26.12.0, Moguri's agent worker and native PTY dependencies. No
  build, container command or manual SHA entry is required.
- The review exposes the image reference, worker SHA-256, bridge SHA-256, installer SHA-512 and image
  archive SHA-512 (summary previously "Exact runtime and image identities").
- The consent checkbox previously read: "I reviewed this runtime, pinned worker, private-workspace mode and
  provider/network policy." When an install is needed, installation requests administrator approval;
  otherwise existing verified release files are reused.
- Error fallbacks previously said that the original configuration and work remain retained when managed
  setup is not confirmed, and referred to the "original" setup operation for status and cancellation.

## Sandbox workspace

Also shown in a chat's right pane when the chat uses the Sandbox Env. Contracts:
`docs/architecture/managed-sandbox.md`, `docs/architecture/native-network-policy.md`,
`docs/architecture/native-retry-checkpoints.md`.

Automatic preparation status:

- With managed Sandbox enabled, private workspaces are prepared automatically when the user sends.
- For a captured repository group, every one of the captured repositories is copied into its own private
  directory under its actual folder/ignore policy. Tools explicitly select a member by ID or name; no
  default root or live checkout is mounted.
- For a bound project, the project is copied under its folder/ignore policy; the source checkout is never
  mounted.
- A project-free chat keeps an empty, root-less private workspace.
- Retained work is preserved across turns.
- Without managed Sandbox, the exact-file preparation (now "Advanced: prepare from chosen files") is an
  advanced option, not the managed workflow.

Exact-file preparation (summary previously "Advanced exact-file workspace preparation"):

- Captured repository groups require managed automatic preparation of their complete original member set.
  A single-project text review cannot replace that group scope.
- Only selected text snapshots enter the VM. The model root is `/workspace` for a project chat, null in a
  project-free chat, and for a captured group one explicitly selected captured repository, never a
  default. The Local source is never mounted or written by native tools.
- The prepared workspace record's actual root ownership is rechecked before every turn admission.
- A project-free chat's path field reads "Empty private workspace. No host root is inherited."
- Each previewed file shows its SHA-256. The source preview line shows the Local source root, total bytes
  and Git HEAD ("not a Git root" outside Git).
- After preparation the source is unchanged and no model turn is started.

Retained native runs:

- Each run shows native outcome, worker outcome ("not acknowledged" when the worker never replied),
  cleanup, cancellation, the original VM id ("unbound"), CLI exit code, model root ("null") and original
  source root.
- For captured groups there is no default model root. Each tool selects an original ID/name; publication
  separately chooses one captured source repository.
- The network line lists the configured tool/provider domain rules for the pinned SendBox release. A
  `github.com` grant also delegates GitHub Meta domains and IPv4/IPv6 ranges, including shared-cloud
  addresses, so the configured list is not the complete effective destination scope. Explicit
  `*.domain.com` rules exclude their apex. Provider endpoints and aliases remain exact; tool permission
  stays separate. See `docs/architecture/native-network-policy.md`.
- Stop is requested only for the original native owner; the user then inspects its actual outcome and
  cleanup.
- A run with no retained after-state cannot be inspected; reconcile its original owner. No new VM or
  fallback is started.
- Reconcile confirmation previously read: "Inspect/stop only this original signed guest; never launch or
  replay work." After reconciliation, partial turns are not upgraded to success and no model or VM is
  dispatched.
- The retained result line shows the signed runtime exit code, rollback status, after-state association
  and journal status. Provenance is not code quality or acceptance.
- Deleted native paths are never published automatically.
- Excluded outputs: only a bounded number of exclusion descriptions are shown; omitted files are not
  retained or publishable text outputs.

Source publication (copying Sandbox output into the Local source):

- The review is a separate actual-user publication. It shows the Local destination root and Git HEAD,
  and the limits: maximum files, patch bytes and complete review-document bytes.
- Consent previously read: "I reviewed these exact source bases and output bytes. This authorizes only
  this copy, not code quality, execution or a Git commit."
- After admission, the user inspects the original job's actual files and outcome; no commit or rollback is
  assumed.
- Publications are retained independently of the source session and execution. Partial work is never
  silently retried; the source index/HEAD and unrelated edits are not reset.
- The outcome shows the actual acceptance actor, attempted paths and verified copied paths.

## Sandbox (page help)

Sandbox is a real execution boundary, not a badge. Missing or unqualified prerequisites block protected
turns, without Local fallback.

## Advanced manual configuration

Manual configurations keep their exact artifact and host scope. Managed setup supplies compatible pins
and separately enables selected-provider aliases. Custom worker builds must match this app's protocol;
changing JSON cannot upgrade old bytes.

The review checkbox was previously "I reviewed these committed native artifacts, image and network
hosts. Verification may start one model-free VM."

## Policy hint

When global execution policy excludes Sandbox, qualification does not override that policy, and opening
its setting starts no VM.
