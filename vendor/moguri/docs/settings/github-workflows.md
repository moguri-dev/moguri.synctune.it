# GitHub workflows

Technical reference for **Settings / Integrations / GitHub**. The app shows a short summary;
this page keeps the full detail.

## GitHub integration

- Moguri uses one existing GitHub CLI (`gh`) account on this Mac for repository discovery, issues and pull
  requests. There is no client ID, copied token or account name to configure.
- The Copilot model login and the optional updater token stay separate from this account. Remote operations keep
  their separately captured SSH account.
- Where to start work: use New to import a repository, Code change for pull requests and Work item for GitHub
  issues. Project menus start sessions from either source.
- Verifying the account (status "Verified gh account: LOGIN / ID") does not grant repository access or approve
  any operation. If the account is unavailable or cannot be verified, no other credential is used.
- Sign in: in a Local session terminal or your own terminal on this Mac, run
  `gh auth login --hostname github.com --web --git-protocol ssh`, then return and verify the account. You
  complete authorization yourself. Private repositories need access through this account; organizations may
  also require SSO authorization.
- For background linked-PR observations, choose your signed-in GitHub CLI account under Project settings.
  Remote metadata keeps its separately selected SSH account. Moguri never switches accounts or authenticates
  automatically.
- Open terminal needs a selected Local session; Moguri does not create a global console or a hidden chat for
  it.

## After each request

- **Wrap up when a request finishes** (default on). When the last queued request of a round completes in a
  Moguri-managed worktree that the round edited, Moguri queues one wrap-up turn in the same chat: resolve
  conflicts with the base, commit what's left, push, open or update the draft PR (or commit only when the
  project opted out of PRs), check CI and reviews, and report to a parent session if this chat was delegated.
  It also runs when skills were used and **Suggest skill improvements** is on. The turn shows as a
  "Wrap-up" notice, not as your message.
- **Follow up on new reviews and failed CI** (default on). For a day after a wrap-up, Moguri checks the
  session's PR every two minutes while the chat is idle. A review by someone other than the PR author queues
  a review follow-up (up to three per round). A finished, failing check run on the PR head queues one fix
  (at most two per round, once per head); if the same checks fail again after a fix, the next turn asks you
  instead of retrying. The PR must track the worktree's current branch.
- **Suggest skill improvements** is the same switch as Skills / Optional evolution (default off). Proposals
  appear in Suggestions with a notification; approving installs a disabled copy.
- These turns use the chat's model, Env, autonomy, approvals and budget. They never merge, force-push,
  rebase shared history or delete branches. See [session lifecycle](../architecture/session-lifecycle.md).

## Pull request automation

- **Fix broken CI** and **Automatic conflict resolution** are independent global defaults, both off. They save
  immediately. Each repository can override either one in **Settings / Project**.
- **Fix broken CI** reruns a failed GitHub Actions job of the session's own PR, at most twice per check and head
  (one minute, then five minutes after the failure), only when GitHub Status shows Actions, API Requests and Git
  Operations healthy with no related incident and the job's log shows a transient cause such as an external HTTP
  5xx or a network error. Test, build, type and lint failures, unclear logs and non-Actions checks are never rerun.
  An outage or unknown status pauses retries and shows the incident; the failure isn't blamed on the change. It needs
  a Local session and the signed-in GitHub CLI account, and respects tool and command deny rules. The Code change view
  shows each retry's reason, reruns used and actual result, with **Cancel automatic retry**.
- **Automatic conflict resolution** queues one turn per PR head (two per round) when GitHub reports a conflict with
  the base. The turn merges the base, keeps both sides' features, validates with tests, and otherwise aborts the merge
  and asks you. Moguri then checks the worktree and reports merged, left for review or needs review. The wrap-up's own
  conflict step is unchanged; with the flag on it uses the same stricter protocol.
- **Repository exceptions** lists each repository that overrides a default, with its effective value and **Open
  settings**.
- Neither flag grants merge, force-push, rebase or sign-in. See [pull request automation](../architecture/pr-automation.md).

## Branch names

- **Branch name prefix** (optional, profile-wide) is added in front of every branch name Moguri generates:
  default task worktrees, Kanban "Continue work" branches, the suggested branch for a new managed worktree
  and the repository-defaults branch. With `yourname/`, a task branch becomes `yourname/moguri/fix-login-1a2b3c4d`.
- The project's **Branch name pattern** (Project settings) still shapes the rest of the name. A pattern that
  already starts with the prefix isn't prefixed twice. Existing branches keep their names.
- Allowed: letters, digits, `.`, `_` and `-`, with `/` between parts, optionally ending with `/` or `-`.
  No leading `/`, `-` or `.`, no `..`, and no part ending in `.lock`. Saving uses the explicit Save button.

## Advanced Git and GitHub operations

- These are explicit operations on a Local project or managed workspace. Before each write you review the exact
  HEAD, index digest, remote or resource revision and any protected actions (for example pushing to the main
  branch), and you confirm each protected action separately.
- Git hooks and Git configuration are honored as usual; they are not sandboxed.
- GitHub calls use only the named controller `gh` account (the "gh account login" field), never SSH
  credentials.
- New work needs an explicitly allowed Local project. There is no Remote or Sandbox fallback and no inherited
  root. Retained operation history stays inspectable without a source project.
- If repository defaults (repository, account, default branch, current branch) cannot be read, check the
  upstream remote and the `gh` account; Git-only inputs stay available.
- Operation labels were shortened; the underlying operations are unchanged:
  - "Create local branch": creates the exact branch name from the given start branch or commit; optionally
    switches to it (requires a clean checkout).
  - "Stage files" / "Unstage files" / "Commit staged files": act on the exact listed paths only; the commit
    includes only the selected staged paths.
  - "Revert current commit": rolls back the current commit by creating a new revert commit whose tree equals the
    previous tree. History is preserved and dirty work is never reset.
  - "Push branch (optional force-with-lease)": force-with-lease uses the exact remote SHA captured in the
    review; Moguri never performs a raw force push.
  - "Push tag", "Delete tag": act on the exact named tag, locally or on an explicit remote.
  - "Edit / Delete issue, PR or review comment": target an existing comment by ID in either the issue/PR
    conversation or an inline PR review.
  - "Submit PR review" and "Merge pull request": bound to the exact PR head reviewed.
  - "Publish draft release": publishes a reviewed draft release.
  - "Watch CI for a commit": watches CI at the exact head SHA, with a bounded deadline of at most 1800 seconds.
- Rebase: start on a clean current branch, continue after explicitly resolving and staging conflicts, or
  explicitly abort the rebase.
- Draft PRs and draft releases: publishing requires a separate explicit confirmation.
- Review panel fields: Local root, HEAD, index digest, remote name/URL, destination ref and SHA, the controller
  GitHub identity, and the review digest. Remote resource content shown in the review is the exact revision
  reviewed and is untrusted data.
- Read GitHub data: read-only, bounded pages (20 items per page) using the repository and account entered above.
  There is no endpoint editor, no account substitution and no implicit refresh.
- Operation history includes this profile's independently retained operations from all projects, including
  deleted sources. Selecting a history entry never grants access to that source root. Deleting the source session
  does not erase the operation.
- Interrupted or ambiguous writes are recorded as partial. They are never automatically replayed, rolled back
  or reported as successful. Conflict resolution, rebase continue/abort and every new write need their own fresh
  review.
- Starting an operation never retries or cleans up branches automatically; inspect its retained result.
- CI results: if the bounded deadline is reached, pending or no-checks is not success. A completed watch is an
  observed result for that exact head, not branch-protection clearance.
- Partial Git operations: acknowledging an inspection records only that you inspected the retained partial
  operation, its original input and possible effects. It is not cleanup proof or success. It does not stop,
  signal, replay, undo or resume work, infer process (PID) ownership, or clear other uncertainty about the
  root. The operation stays partial, and the acknowledgement is not permission to replay.

## Advanced Git and GitHub operations

The disclosure was previously labeled "Advanced reviewed Git and GitHub operations". Every operation in
it is reviewed before it runs.
