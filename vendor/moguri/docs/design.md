# Initial client design

## Product and operating scene

Moguri is an inspectable local coding workspace for developers moving between
terminal and desktop, often while reviewing a live diff or command. The mode is
Operate: readable task state, stable controls and native interaction take
priority over decorative branding. Product authority remains the implementation
specification, not this presentation record.

## Desktop

The desktop uses a restrained dark workbench by explicit user requirement:
slate conversation surfaces, deeper navigation and a quiet green
action/selection vocabulary. Dark is the factory preference; Light and System
are explicit, restorable shared SDK settings. It does not use marketing cards, synthetic
activity or invented metrics. System sans-serif carries UI; system monospace is
reserved for code, paths, IDs and measurements.

| Role | Value |
| --- | --- |
| Main surface | `#191f29` |
| App background | `#141922` |
| Navigation | `#11161e` |
| Subtle surface | `#1d2530` |
| Text | `#e1e8f0` |
| Secondary text | `#a2afc0` |
| Action | `#a8d7bc` |
| Selection | `#233c30` |
| Border | `#344151` |
| Error | `#ffb5a9` |

An original small face-and-purple-bat-wing mascot with a red pom-pom anchors the titlebar and empty
state. One SVG source generates PNG/ICNS native icons; the SDK exports its ASCII
counterpart for terminal loading. The only third-party artwork is the set of
monochrome provider marks on Settings / Model providers, which identify each
service and inherit the text color ([third-party notice](third-party.md)).

Model providers uses one card per account or agent harness: a neutral logo
tile, name, one-line subtitle, a status badge and trailing actions. The badge
states Connected, Not connected, Checking..., Needs attention or Disabled in
words, with a filled or hollow dot, so state never depends on color alone. API
key forms open as disclosures (`aria-expanded`), focus their field, and return
focus to the trigger on Escape or Cancel. Longer explanations stay in the
information popovers.

Projects/sessions sit left; the conversation remains central; the main-session
sidebar sits beside it with a separate seven-panel rail. Explicit grid placement
keeps the rail outside the conversation when the sidebar collapses. Width,
collapse and active-panel preferences are local presentation only. At supported
desktop widths the sidebar stays beside the main pane, not over it.

The composer keeps prompt/snapshot context above one compact toolbar: plus,
environment icon, model name and autonomy icon; budget/infinity, microphone and
paper-plane Send trail on the right. Cmd/Ctrl switches Send to a queue clock.
When the primary action becomes Resume (play icon) or Retry (refresh icon) after
a failure, it stays an icon button like Send; its accessible name and tooltip
say which action it is. At narrow widths the model name truncates before the
controls wrap.
Native bounded popovers expose the four settings, model context/thinking and
usage without permanent duplicate labels. Setup and unavailable states explain what must happen
next. Approval is an inline, protected-focus action with full arguments and
explicit deny/approve controls. State is labeled in text, not color alone.

Conversation Markdown is rendered without raw HTML, automatic remote images or
implicit external navigation. Long transcripts progressively reveal older
messages. Code stays selectable and horizontally scrollable.
Fenced code uses a quiet language caption with a stable exact-copy action
outside its keyboard-scrollable source. Inline code stays ordinary text.
Activity disclosures retain their chevrons at rest so inspection does not depend
on discovering a hover state.

The transcript and composer/queue/approval surfaces share one measured content
column, excluding the adjacent turn rail; compact expanded turn lists remain
overlays. Navigation starts with Search/Filter/Order icons. Search reveals its
focused field on demand, while active status/order choices expose Reset.
Filters preserve parent context and collapsed-group intent rather than
restructuring the workspace. Location shortcuts live in the sidebar session and
project context menus, not Settings; unavailable roots stay visible but
disabled with their reason. Global skill-folder switches show an exact-path confirmation
before adding a saved discovery source, never an implied execution grant.

Queued prompts look like sent prompts (`.message.user`) with a dashed outline and
explicit held/steer labels. Copy, Send now (arrow up) and Delete icons reveal on
hover or focus; clicking the prompt edits it in place with icon-only Attach,
Cancel and Save. Non-hover devices retain visible 44px targets. The singular/plural counted chevron preserves
inline edits when collapsed. The chat header carries no shortcut buttons; small
accent count badges on the right-rail Terminal, Plan and Code change icons describe
actual scoped observations, not synthetic progress. A Terminal count opens Agent
activity, not the private User console, and shares existing navigation/dirty-state
guards. Composer controls and the Commands palette open as anchored popups or a
modal dialog, never inside the sidebar.

Obvious navigation/copy/edit/delete actions use labeled icons. Contextual primary
labels are New and Save. Long names truncate within bounded rows while retaining
their full accessible names; controls wrap rather than overlap. Cmd/Ctrl+Enter
holds a prompt; sending is a distinct visible action. Mode and held state remain
textual, not color-only. The sidebar uses the maintained Ghostty canvas with an
explicit Local user-console boundary, not a custom terminal emulation surface.
Native browser previews are hidden while dialogs or other task surfaces own
focus. Project settings and destructive dialogs use the same restrained layout
and clear source/retention boundaries.

Settings choices save as soon as they change: switches, checkboxes, selects,
sliders and color pickers commit on change (sliders and colors when released),
on top of the committed values, so other unsaved text is untouched. Explicit
Save is reserved for written values such as text, paths, numbers, shortcuts and
JSON/YAML editors, and for flows gated by a review or consent step. List actions
like adding, enabling or removing a skill source, or confirming a global skill
folder, also save immediately, as do each skill's switch and **Trust** in the
shared skills list (D57), whose groups start collapsed in Settings and expanded
on the Capabilities page. A refused save keeps the attempted value visible
with the error and never overwrites another client's revision.

Every Settings page follows one anatomy so pages read alike:

| Element | Rule |
| --- | --- |
| Page title | Each page opens with its group name as the page title (22px). Every item is a section below it, separated by a divider, with its own 16px title; subsections are `h3`, detail groups `h4`/`h5`. |
| Scope control | A section that acts on a chosen chat (Artifacts, Candidates, Sandbox, Skills) shows its source-chat select on its title row, right-aligned, like the Suggestions scope. It never sits above the title. |
| Column | Fields, editors, cards, tables and warnings share one 850px column; running text keeps a 76ch measure. Single-line inputs and selects stop at 480px; text editors use the full column. |
| Groups | A fieldset with a `legend` is a titled card (subtle surface, 10px radius; nested cards use the main surface). A fieldset without a legend is an invisible wrapper. A titled group that carries its own information button stays unboxed so the title lines up with the button. |
| Disclosures | In Settings, every `details` is a bordered row: its label on the left and a visible Show/Hide pill on the right; the opened content sits inside the same card. Elsewhere disclosures use one rotating chevron, and rows with their own chevron or folder icon opt out. |
| Local paths | Every setting that needs a file or folder on this Mac uses `PathField`: a text field that accepts an absolute path or one starting with `~/`, plus a **Choose…** button for the native picker. Both ways always work; the typed value is kept exactly apart from `~` and surrounding quotes. |
| Field information | A field's information button sits right after the field title on its first line, not at the end of a full-width control. |
| Dropdowns | Every single-choice dropdown with more than 7 selectable options, anywhere in the app, opens a themed list with a search field instead of the native menu (`SelectSearch`). The count decides; there is no per-dropdown opt-in. Each query word must appear in the option text (case- and accent-insensitive). Arrow keys, Page Up/Down, Enter, Escape and type-to-search work from the closed control; the native select keeps its value and change events. |
| Copy | One sentence per page intro and per helper; info popovers at most two short sentences; warnings only for real risk. Internal implementation detail lives in [the Settings reference](settings/README.md), not on screen. |
| Switches | Choices that save immediately are switches with 12px row rhythm; review or consent acknowledgements stay checkboxes. |
| Tables | Left-aligned, muted 11px headers, row dividers, no outer border. |
| Actions in flex panels | Buttons keep their natural width (`align-self: flex-start`) instead of stretching across the column. |
| Empty lists | A section heading is always followed by content or a one-line empty state. |

Settings is a full main-pane task surface, with a page rail, persistent save
state and explicit warning/reset actions. It exposes the shared SDK rather than
owning capability behavior. Dirty settings survive page changes and block
navigation/unmount until saved or explicitly reloaded.

### Settings rail structure

The rail lists only the **7 pages**, one per group, with an icon and the group
name (follow-up to [#84](https://github.com/mbianchidev/moguri/issues/84)). Each
page shows every item of its group as a section, so related options are on one
scrolling page. Under the open page the rail lists that page's sections as small
anchor links that scroll to them and highlight the section in view; there are no
group headings or tabs.

| Page | Sections, in order |
| --- | --- |
| General | General, Repositories, Project |
| Models | Providers, Local models, Kupo routing, Decision providers |
| Integrations | GitHub, Linear, MCP gateway, sql-not-so-lite, Stainless, Plugins, Marketplace |
| Boundaries | Guardrails, Sandbox, Remote SSH, Subagents, Scripts, Lifecycle hooks, Dependency cache |
| Sessions | Startup defaults, Confirmations, Retention, Context compaction, Budgets, Artifacts, Candidates |
| Instructions | User guidance, System prompt, Skills, Knowledge tiers, Repository memory |
| Interface | Appearance, Keyboard shortcuts, Voice dictation, Notifications |

- New integrations add a section to Integrations, never a rail entry.
- The selected page has a neutral fill and an accent bar; the rail never uses
  tinted button blocks.
- Navigation only: pages change no setting's behavior, scope, default or save
  rule. An unsaved nested edit (an integration key, a resource draft and so on)
  blocks changing pages; moving within the page never does.
- Item ids (`github`, `appearance` and so on) are the stable deep-link targets for
  `openSettings`, policy hints and restored layouts: they open the item's page
  scrolled to its section. No persisted navigation state changed. Search matches
  every item and narrows the rail to the pages that hold a match, each with its
  match count; choosing one opens it at the first match.
- Tab strips elsewhere (Capabilities, the PR pane) are text tabs with an accent
  underline on a shared baseline, never boxed buttons. Secondary buttons use a
  hairline border and a subtle fill; the stronger control line appears on hover.

JSON editors expose exact
permissions/MCP configuration during this alpha. Model-weight download requires
its own user acceptance, separate from recording or transcript insertion.

Supporting views show explicit loading, empty and failed states rather than a
blank or success-looking fallback. Workspace-plan reloads retain the original
text and dirty indicator until successful reconciliation, lock conflicting
edits while pending, and recover from failed reads without losing text.

## Visual system

Every desktop surface draws from one token layer at the top of
`apps/desktop/src/styles.css`; components use tokens rather than their own
values. The [design audit](design-audit.md) records why and what remains.
`tests/design-tokens.test.ts` keeps the layer honest: palette fallbacks match
the SDK, every `var()` resolves, raw colors stay inside the token blocks,
component padding, margin, gap, font size and radius use scale tokens (only 1px
hairlines and `clamp()`/`calc()` geometry may stay literal), and the contrast
pairs below hold for every palette in Dark and Light.

### Tokens

| Group | Tokens | Rule |
| --- | --- | --- |
| Palette roles | `--text`, `--muted`, `--canvas`, `--surface`, `--sidebar`, `--subtle`, `--line`, `--control-line`, `--accent` (+ hover/active/on-accent), `--selected`, `--selection-text`, `--danger`, `--warning-*`, `--error-*`, `--code` | Mirrors the SDK Moguri palette; `appearanceColors()` replaces them at runtime for every preset and custom colors. |
| Status | `--status-running`, `-attention`, `-completed`, `-merged`, `-failed`, `-partial`, `-stopped`, `-queued`, `-neutral`, `-unknown` | Derived from palette roles or the runtime session-indicator colors. Never the only signal. |
| Spacing | `--space-0` 2px, `--space-1` 4px, `--space-1-5` 6px, `--space-2` 8px, `--space-2-5` 10px, `--space-3` 12px, `--space-3-5` 14px, `--space-4` 16px, `--space-5` 20px, `--space-6` 24px, `--space-7` 32px, `--space-8` 48px | 4px grid with a hairline step and half steps up to 14px for dense controls. Off-scale values snap to the nearest step, ties to the denser one. |
| Radius | `--radius-xs` 3px (kbd, small tags), `-sm` 5px (inputs), `-md` 6px (buttons, tooltips, warnings), `-lg` 8px (cards, popovers, menus, approval), `-xl` 10px (composer, dialogs, Settings cards), `-pill` | One radius per component class. |
| Type | `--font-sans`, `--font-mono`; `--font-size-2xs` 10px to `--font-size-3xl` 28px; `--line-height-tight/normal/relaxed`; `--font-weight-medium/semibold/bold` | System sans for UI; mono only for code, paths, IDs and measurements. |
| Targets | `--target-size` 32px, `--target-size-coarse` 44px | Coarse pointers get 44px targets. |
| Geometry | `--titlebar-inset` 78px | Clears the macOS window controls. Component sizes (icons, logo tiles, fixed widths) stay literal. |
| Elevation | `--elevation-raised`, `-tooltip`, `-popover`, `-dialog`, `-drawer-start`, `-drawer-end`; `--backdrop`, `--backdrop-soft` | Dark dialogs and drawers use deeper shadows so they separate from slate surfaces. |
| Focus | `--focus-ring` (`--focus-ring-width` 2px, `--focus-ring-color` accent), `--focus-ring-offset` 3px | Applied by the global `:focus-visible` rule. |
| Motion | `--duration-fast` 120ms, `--duration-base` 140ms, `--duration-slow` 200ms, `--ease-standard` | Reduced motion disables transitions and every infinite animation. |
| Fixed identity | `--brand-*` (startup screen), `--terminal-canvas`, `--chart-*` (analytics lanes, Dark and Light), `--swatch-*` | Intentionally palette-independent. |
| GitHub state | `--github-open`, `-closed`, `-merged` | GitHub's own hues for PR/issue state marks (D63): open green, closed red, merged and completed issues purple, drafts muted. At least 3:1 on every background; always paired with a labeled icon. |
| Syntax | `--syntax-keyword`, `-string`, `-comment`, `-number`, `-title`, `-type`, `-tag`, `-addition`, `-deletion` | Files view highlighting (`.hljs-*` classes). At least 4.5:1 on `--code` in Dark and Light. |

Measured minimums across all eleven presets in both modes: body text 11.02:1,
secondary text 5.82:1, failed/attention/partial/unknown status text 5.16:1,
focus ring and status dots 3.07:1 against canvas, surface, navigation and
subtle backgrounds.

### Look and feel (D54)

The base is neutral: near-black (Dark) or near-white (Light) surfaces with no
green tint, separated by hairline `--line` borders rather than shadows or
tinted blocks. The palette accent marks only what matters: the primary action,
the selected item, focus and a short underline under the active tab. Section
labels (Workspace, panel titles, Getting started) are small uppercase text with
wide tracking; sidebar headings add a square accent marker. Tabs are text on a
shared baseline with an accent underline. The composer is a hairline card whose
border strengthens on focus. Layout is unchanged: chats on the left, the
conversation in the middle and the terminal and other panels on the right.

Icons come from `lucide-react` through `Icon.tsx`: 16px, 1.75 stroke, inheriting
`currentColor`, each tagged with `data-icon` for tests. Model brand marks stay
drawn paths. Add an icon by mapping a name in `Icon.tsx`, never by inlining SVG.
Third-party services use their own marks: model providers through
`ProviderLogo.tsx`, integrations (GitHub, Linear, MCP, Stainless) through
`IntegrationLogo.tsx`, each in a small hairline tile before the section title
(D62).

### Model lists

Every list of models (Settings / Providers, Kupo's pool and Cascade classes, the
legacy approved solvers) uses `GroupedModelList`: provider groups, then AI lab
subgroups when a provider spans several labs, all collapsed by default with a
count on each header. A toolbar offers **Order by price** (free, then priced,
then unknown) and Providers / AI labs filter popovers. Rows keep their own
controls; the list adds only the price label on the right.

### Getting started

A first-run thread in the main pane, opened once per profile until finished or
skipped and again from **Settings / General / Restart Getting started**. Moguri
asks one question at a time; each answered step collapses into a row with its
value and a Change button. Choices (accent swatches, theme, behavior switches)
save on change; the optional name saves on Continue and says plainly that it
goes to the model provider. Skip setup and Finish are always available, and
choosing a chat closes the thread. Details: [D54](architecture/decisions.md).

### Pull request view

A linked PR fills Code change: a muted repository line with the Draft / Ready
control on the right, a large title with its `#number` link, a state pill with
head and base branches, then text tabs (Description, Files, Reviews, Checks,
Commits) with small count pills. Reviewers, assignees and labels are rounded
chips that open filterable menus; label swatches use the label's own GitHub
color. Every GitHub write shows an inline review with its confirmations before
anything is sent. Check and commit rows are full-width buttons that open
GitHub, with state icons in `--status-*` and `--github-*` colors next to text.
Session PRs sit above the view as pill tabs with their state icons. The diff
uses a monospace grid (old number, new number, sign, highlighted code) on
`--code`, with `--diff-add-*` and `--diff-remove-*` row and gutter tints. The
hover **+** in `--diff-focus` opens an inline comment card under the line.
Details: [D64 and D65](architecture/decisions.md).

### Components

| Component | Implementation | Rules |
| --- | --- | --- |
| Button | global `button`, `.primary`, `.quiet`, `.danger`, `.composer-stop` | One primary per decision. Destructive actions say what they do. Global hover/active rules have 0,2,1 specificity, so custom-colored buttons need a more specific selector. |
| IconButton | `.icon-button` with `Icon.tsx` and a `Tooltip`; `SettingsAction` in `SettingsFields.tsx` | Always has an accessible name that matches its tooltip. |
| StatusBadge | `StatusBadge.tsx` (`.status-badge[data-tone]`, also Analytics sessions and events), `.provider-status` in `ProviderLogo.tsx`, `SessionIndicators` in `WorkspaceNavigation.tsx` | Dot plus a word from the shared vocabulary; stopped and unknown use a hollow dot. |
| Notice | `.message.notice[data-tone]` in `App.tsx` | Session notices take their outcome's tone: failed uses the error surface, stopped and completed stay neutral, partial, attention and unknown keep the warning surface. A left status rule and the worded badge carry the state. |
| Diff | `UnifiedDiff.tsx` (`.unified-diff`, `.diff-line[data-kind]`) | Code change and PR patches mark added, removed, hunk and header lines, keep the exact `+`/`-` text, scroll horizontally and by keyboard. |
| Card | Settings `fieldset` with `legend`, `.approval`, `.user-question` (`QuestionCard.tsx`), `.my-work-card` | Subtle surface, `--radius-lg` or `--radius-xl`, one title. |
| Popover and menu | `AnchoredMenu.tsx`, `.composer-popover`, `ModelSubmenu.tsx`, `SelectSearch.tsx`, `WorkspaceContextMenu.tsx` | Native `popover`, `--elevation-popover`, Escape returns focus to the trigger. |
| Dialog | native `dialog.workspace-dialog`, `.command-palette` | Modal, `--backdrop`, explicit primary and cancel actions. Header is an `h2` with a labeled close icon; focus starts in the first field. A filtered list says when nothing matches. |
| Field | `.setting-field` via `SettingsFields.tsx`, `PathField.tsx`, `SettingsCommitInput` | Label above; information button after the title. |
| Switch | `input[role="switch"]` inside `.check-setting`, `.setting-toggle`, `.agent-follow` | Saves on change in Settings. |
| Tooltip | `Tooltip` and `InfoTip` in `Tooltip.tsx` (`.compact-tooltip`), `.sidebar-tooltip` | Opens on hover or keyboard focus, closes on Escape. |
| Alert | `Alert.tsx` (`.app-alert[data-alert-tone]`, `.notice`), `.settings-warning`, `.inline-error`, `PanelError` in `PanelFailure.tsx` | Errors use `role="alert"`; warnings only for real risk; dismissal restores focus. |
| Empty, loading, error | `.session-empty`, `.panel-empty`, `.nav-empty`, `.loading-state` with `role="status"`, `PanelError` | A heading is always followed by content or a one-line state. An expected condition is not an error: `PanelError` shows a folder without Git as an empty state, with the exact Git detail in a disclosure. |

### State vocabulary

`packages/protocol/src/status-labels.ts` (exported through the SDK) gives both
clients the same words. Desktop shows them in `StatusBadge`; the TUI uses them
in its session list, state row and message outcomes.

| Raw value | Label | Tone |
| --- | --- | --- |
| `running`, `stopping` | Running, Stopping | running |
| `waiting_input`, pending approval or question | Needs attention | attention |
| `completed` | Completed | completed |
| `failed` | Failed | failed |
| `partial` | Partial result | partial |
| `stopped`, `cancelled`, `denied` | Stopped, Cancelled, Denied | stopped |
| `queued` | Queued | queued |
| `idle`, `archived` | Idle, Archived | neutral |
| missing or unrecognized | Unknown, Unconfirmed, Unknown (value) | unknown |

An unrecognized value is shown as unknown, never as success.

### Layout

The primary path is project/session (left), conversation and composer
(center), supporting panel (right), rail (far right). Down to 761 CSS pixels
all four sit side by side. From 760 to 561 the navigation becomes a drawer and
the open supporting panel keeps its own column. At 560 and below the panel
overlays as a drawer, but pending approvals, questions and the composer stack
above it, so a decision is never hidden. The window minimum is 840px, so the
narrower layouts appear when the page is zoomed.

## Terminal

The TUI inherits terminal-oriented density rather than the desktop sidebar.
Its dark slate surfaces reduce the transition from an existing terminal;
desaturated green, amber and error text convey the same state vocabulary,
and the words themselves come from the shared status labels, so the session
list, state row and message outcomes read Needs attention, Partial result or
Unknown exactly as the desktop does.
Navigation appears beside the conversation when space allows. The four controls
remain visible in a fixed-height footer. Tool rows and pending requests use the
desktop's activity labels (Run command, Read file) with their subject. The
approval box keeps the exact tool name in its title and leads with the label
and subject, such as `Run command: printf ...`, so even a 52x24 terminal shows
what is being approved; full arguments follow, are scrollable and accessible
with Ctrl+V. Notices use the shared tone: failures in the error color, stopped
and completed notices neutral. Model choice, cancellation and draft conflict
resolution have explicit keyboard paths.

## Accessibility and motion

Controls have labels, visible keyboard focus, disabled explanations, status
announcements and non-color state text. Desktop command palette uses a native
dialog. Reduced-motion preference disables transitions and stops every looping
animation; ordinary hover/focus feedback is brief and no page-load choreography
delays work. `tests/e2e/design-system.spec.ts` walks session, compose, approval
and review by keyboard alone, checks the 2px focus ring at each step, and proves
narrow and zoomed layouts neither overflow horizontally nor cover a pending
approval or the composer. This is automated evidence, not a human
screen-reader audit or WCAG certification.

The verification artifacts use generated transcripts and a synthetic Copilot
account catalog. They are demonstrations of the local protocol, not evidence
of personal subscription access or billed cost.
