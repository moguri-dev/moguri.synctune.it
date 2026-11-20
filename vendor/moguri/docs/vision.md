# Product vision

## Feature inventory

The feature inventory below captures the broader Moguri vision, not the list of
implemented features. The implementation specification distinguishes first-release
requirements from deferred work.

- Always choose either a fixed model or **kupo**, Moguri's HydraFusion-inspired synthetic/auto model. kupo routes across a configured mix of local and hosted models and selects single-model, cascade, or draft/critique/revision workflows.
- Optional System One decision providers, including [TypeSafe AI's Jev](https://docs.typesafe.ai/introduction), work with kupo and fixed models for delegated decisions, tool approvals, and steering. [Laya is an evaluated, not yet implemented, alternative](architecture/decisions.md#laya-optional-provider-evaluation) that users would install separately on their laptop or expose through an approved endpoint; it would not replace Jev automatically.
- The chat composer, TUI, and CLI expose **Env**, **Model**, **Autonomy level**, and **Budget**. Starting defaults are Local, no model until provider login or local-model configuration, Manual, and Unlimited. Global, profile, and repo/project settings can supply different defaults.
- Desktop has an Attach button and image paste; attachment triggers are `^` for a local file or folder, `:` for an active session, `#` for a GitHub issue or PR, and `@` for a named Local project file/folder or GitHub file. A message starting with `!` (for example `!gh auth login --web`) runs that line in the chat's terminal at the project folder, or Home in a project-free chat, without any model call. TUI/CLI expose the same typed snapshots and review boundaries.
- **Env** offers **Local**, **Sandbox** via SendBox, and **Remote** via SSH. Remote runs the agent and model calls on the configured machine. Global policy may allow only Sandbox or Remote; it blocks new Local turns while existing Local turns may finish. Neither SSH nor a label implies SendBox containment.
- **Autonomy level** is independent of model choice and env: **Manual** (default), **Guided** (model recommends; user confirms), **Autopilot** (automatic tool/command approvals), and **Autopilot Max** (the same approvals plus qualified decision-model choices and steering). Hard denials, read-only mode, budgets and allowed-env policy remain final. See [session and GitHub workflows](setup.md#session-approvals-and-github-workflows) for remembered grants, repository/PR/issue pickers and updater-token setup.
- **Budget** defaults to unlimited. Users can cap cumulative session tokens, USD, or both when telemetry supports it. The UI warns that caps may interrupt work; kupo tries to checkpoint and commit accepted changes before exhaustion when Git policy and approvals permit it.
- Dashboard (7,30,60,90,365 days, entire selectable year, custom period, all time)
  - Sessions cost
  - Token usage per session, divided by tool calls, MCP calls, system prompts, messages etc.
  - Compaction history
  - Velocity
  - Session metainfo (archived included) and easy delete for them
  - See pricing per session (depends on provider API)
  - Global aggregate dashboard with filters per: time (day, week, month, all time, custom), repo, github org, open source vs private, etc.
- Integration with local AI models ready to install from huggingface - previous system status check
- New productivity shortcuts
  - option/ctrl space for voice dictation with NVidia nemtron new model
- Profiles with (possibly) different API keys and projects binded to them, and different accents + policies
  - Work
  - Open Source
- When models ask question save user answers as artifacts tied to the session but not deleted when session is. The artifacts are tied to the project and when deleting a project with at least one artifact the agent asks if the user wants to commit the artifacts in an artifacts/ folder in the project itself. Examples of artifacts
  - Decisions (why did I use Golang instead of Rust?)
  - Plans
  - Answers to questions on the project
- Projects with worktrees
  - Work-tree aware sessions or from issue, or from PR (requires GitHub MCP, or Linear or Jira installed)
- Folders containing multiple repos/projects
  - Can work on multiple project as part of a stream, with coordinated PR merge capabilities - optionally integrated with Stacked PRs from GitHub
- Group sessions within the same projects with or without an orchestrator session
  - Allow to attach an orchestrator session later
- Command palette
- Split panel
- Desktop-only, main-session-aware [sidebar](specs/desktop-sidebar.md) for Code change (PR or workspace changes), Terminal, Files, Stainless Browser, Side chat, Insights, and Extensions; project-free chats show only Terminal, Browser, Insights, Plan and Side chat
- Save draft prompts so if app closes nothing happens to that prompt, in the same way save queued ones for when a session resumes
- Session archive must be visible and explorable
- Delete session policy, default off, configurable in amount of days or max GB occupied
- Agent skills/hooks
  - Self evolving (optional) powered by actual memory with 3 tiers: glacier, terra, sky
  - Defined gallery/marketplace
- Metachat
  - Chat with moguri for changing its own settings and for trouble shooting
- Scheduled actions
  - Watch CI
  - Dependencies roundup see dependabot, renovate and other bot PRs
  - "My work", check open PRs
  - Run prompt
  - Run agentic workflow (prompt + specific scripts with nice syntax) - optional delegated to server
- Granularity of views compact vs detailed for agent tools, steers, etc.
  - Expose ALL thinking (collapsible)
  - Share time elapsed since script started
  - Share total time elapsed since sub-session/sub-agent started (and token count if possible)
  - Share total time elapsed since whole session started
  - Make sure commands run by the agent and subagents are stoppable at all times manually from GUI 
- Structured and exposed harness plugins/instructions/skills (with slash commands / when feasible - skills always)
  - github plugin for correctly opening/closing/editing PRs, issues - querying CI checks, checking Actions logs, dependabot PRs, code review comment read + write + resolve convo
  - vulnerability resolution methods
  - conflict resolution with rebase vs merge on main/master or other target PRs
  - logging / observability
  - commit message style, rules (linted) and frequency
  - commit message signing with secure SSH key and strip co-authored with to avoid doing free marketing for agents
  - token savings `--silent` & co. + caveman
  - documentation guidelines (in docs/ not in random markdown files)
  - tech stack preferences
  - general coding guidelines
  - etc., following the maintainer's agent instruction set
- Self evolving tools
  - Python tools for diffing, parsing, splitting, finding are built in so the models do not generate those runtime wasting tokens
- Better messaging
  - Automatically detects prompts that are repeated e.g. "Fix all review comments and rebase on main" will get a proposed slash command `/fix-rebase`
  - Allow ordering/shuffling, deleting or editing messages previously queued (if not picked up already)
  - Allow sending a message in different modes:
    - Stop current turn and send immediately
    - Queue waiting for current turn to finish
    - Steer the current turn
- Better chat/sessions
  - Unarchive sessions (not the deleted ones, of course)
- New continous modes (with taggable @ agents)
  - Continous Product manager - implements PostHog in product -> gain insights on usage -> find metrics to improve and lack of features -> market research -> create issues -> create assumptions -> after implementation measures improvements and reports back to user
  - Continous Maintenance (toggle per repo) - keeps all dependabot update/security PRs merged taking care of breaking changes + other custom actions
  - Continous Docs (toggle per repo)
- New agent modes
  - Deep search - give a goal, run research, use sources and get to the bottom of a question (scientific oriented)
  - SRE - give an error, access to read-only infra MCPs, architecture diagrams and code -> get a resolution
  - Autopilot - give a clear task, agent works until the very end
  - Long running Autopilot - like the previous but for giant greenfield projects (e.g. a browser), complete rewrite of codebases (e.g. from C to Rust)
  - Stabilize - takes a repo, checks out the current status, tries to merge all the current pending PRs, fixes security issues, installs dependabot, enhances and hardens Actions, installs agentic workflows to triage issues
  - Swarm - Solves all open issues by creating a roadmap and rationalizing the end to end state of the repo, after planning carefully and reporting back to the user before implementation
  - Team (like [squad](https://github.com/bradygaster/squad)) + [paperclip](https://github.com/paperclipai/paperclip) style, council and other projects that use different personas + agents for better results
- Integration with:
  - [mbianchidev/sendbox](https://github.com/mbianchidev/sendbox) - native, first-release Sandbox env with scoped local VM execution; missing sandbox support never silently falls back to Local.
  - mbianchidev/porto - for handling local dev servers and docker stacks (via CLI pre-installed)
  - mbianchidev/sql not-so-lite - for local database management (via CLI pre-installed)
  - mbianchidev/stainless - agentic privacy driven browser, optional and off by default: Open in Stainless for Local previews and owned headless Playwright batches ([contract](architecture/stainless.md)); MCP integration waits on Stainless (#80)

## To evaluate

- Virtualised Work Trees: Utilizing B-trees and hash array map trees, Delta DB makes spinning up new "agent branches" nearly instantaneous and computationally "free" through copy-on-write persistent data structures.
- Conflict-Free Replicated Work Trees (CRDTs): Enables multiple humans and agents to manipulate the same codebase concurrently without traditional merge conflicts.
- Model Blame: Users can identify exactly which AI model or agent wrote a specific line of code, providing a historical record of the "agentic" logic.
