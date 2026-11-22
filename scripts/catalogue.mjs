// The single list of published pages, synced Moguri documents and screenshots.
// Builds, tests, the sitemap and the sync script all read this file.

export const origin = "https://moguri.synctune.it";

// HTML page templates with {{MARKERS}}. Everything else under docs/ and developers/ is Markdown.
export const templatePages = ["index.html", "download/index.html", "docs/index.html", "developers/index.html", "404.html"];

export const moguri = {
  repository: "mbianchidev/moguri",
  // Repositories that return 404 to the public. Links into them render as plain text.
  privateRepositories: ["mbianchidev/moguri", "mbianchidev/sql", "mbianchidev/flAI-on-the-wall", "mbianchidev/vslocal"],
};

// GitHub owner and repository names are case-insensitive.
export const isPrivateRepository = (name) => moguri.privateRepositories.some((entry) => entry.toLowerCase() === name.toLowerCase());

// Site-written task guides in docs/usage/. They link to the synced reference for full detail.
export const guidePages = [
  { slug: "getting-started", section: "user", group: "Start", title: "Getting started", description: "Connect a model, start a first project session and understand the first tool request." },
  { slug: "sessions", section: "user", group: "Guides", title: "Projects and sessions", description: "Manage repositories, worktrees, profiles, prompts, attachments and saved work." },
  { slug: "models", section: "user", group: "Guides", title: "Models and budgets", description: "Configure providers, local models, context windows, Kupo and usage limits." },
  { slug: "execution", section: "user", group: "Guides", title: "Permissions and execution", description: "Review tool access and configure Local, Remote SSH and Sandbox execution." },
  { slug: "tools", section: "user", group: "Guides", title: "Tools and integrations", description: "Use GitHub, Linear, MCP, memory, skills, dictation and dependency caching." },
  { slug: "cli", section: "user", group: "Guides", title: "CLI and shortcuts", description: "Look up command syntax, global options, slash commands and keyboard controls." },
  { slug: "troubleshooting", section: "user", group: "Guides", title: "Troubleshooting", description: "Diagnose startup, authentication, model, workspace and interrupted-work errors." },
  { slug: "sdk", section: "developers", group: "Architecture and API", title: "SDK quickstart", description: "Build the SDK, connect a client, select a profile and handle jobs and errors." },
].map((page) => ({
  ...page,
  source: `docs/usage/${page.slug}.md`,
  route: page.section === "user" ? `docs/${page.slug}.html` : `developers/${page.slug}.html`,
}));

const settingsGroups = [
  ["General", ["general", "repositories", "project"]],
  ["Models", ["providers", "local-models", "kupo-routing", "decision-providers"]],
  ["Integrations", ["github-workflows", "linear-workflows", "mcp-gateway", "sql-not-so-lite", "stainless", "plugins"]],
  ["Execution and permissions", ["guardrails", "sandbox", "remote-ssh", "subagents", "scripts", "lifecycle-hooks", "dependency-cache"]],
  ["Sessions", ["startup-defaults", "confirmations", "retention", "context-compaction", "budgets", "artifacts", "candidates"]],
  ["Instructions", ["user-guidance", "system-prompt", "skills", "knowledge-tiers", "repository-memory"]],
  ["Interface", ["appearance", "keyboard-shortcuts", "voice-dictation", "notifications"]],
];

const vision = "This is the product vision, not a list of what works today. Check implemented capabilities before relying on any item here.";
const specification = "This is the target specification. It includes requirements that are not implemented yet; implemented capabilities lists what the current alpha does.";

// Moguri's canonical documents, synced unchanged into vendor/moguri/ by scripts/sync-moguri.mjs.
export const canonicalPages = [
  { upstream: "docs/installation.md", route: "docs/installation.html", section: "user", group: "Start", title: "Installation", description: "Install, verify, first launch, upgrade, data location and removal for the macOS alpha." },
  { upstream: "docs/settings/README.md", route: "docs/settings/index.html", section: "user", group: "Reference", title: "Settings reference", description: "What each desktop Settings page does, its defaults and its safeguards." },
  { upstream: "docs/features.md", route: "docs/features.html", section: "user", group: "Reference", title: "Implemented capabilities", description: "What the current Moguri alpha implements, by protocol checkpoint." },
  { upstream: "docs/remaining-milestone-gaps.md", route: "docs/roadmap.html", section: "user", group: "Reference", title: "Roadmap and acceptance", description: "First-milestone acceptance, what is not available yet and the ordered roadmap." },
  { upstream: "docs/vision.md", route: "docs/vision.html", section: "user", group: "Reference", title: "Product vision", description: "The broader feature inventory. Most of it is not implemented.", notice: vision },
  ...settingsGroups.flatMap(([group, slugs]) => slugs.map((slug) => ({
    upstream: `docs/settings/${slug}.md`,
    route: `docs/settings/${slug}.html`,
    section: "user",
    group: "Settings",
    settingsGroup: group,
    description: "Settings reference: behavior, defaults and safeguards for this page of desktop Settings.",
  }))),
  { upstream: "docs/development.md", route: "developers/development.html", section: "developers", group: "Start", title: "Development setup", description: "Toolchain, setup, code layout, checks, CI and packaging for Moguri contributors." },
  { upstream: "CONTRIBUTING.md", route: "developers/contributing.html", section: "developers", group: "Start", title: "Contributing", description: "How to report issues, propose changes and get a pull request merged." },
  { upstream: "docs/architecture/overview.md", route: "developers/architecture.html", section: "developers", group: "Architecture and API", title: "Architecture overview", description: "How the local service, workers, SDK and clients fit together." },
  { upstream: "docs/sdk.md", route: "developers/sdk-reference.html", section: "developers", group: "Architecture and API", title: "SDK and CLI reference", description: "The importable SDK, its entrypoints and the moguri CLI." },
  { upstream: "docs/implementation.md", route: "developers/specification.html", section: "developers", group: "Architecture and API", title: "Implementation specification", description: "The canonical product and delivery specification.", notice: specification },
  { upstream: "docs/design.md", route: "developers/design.html", section: "developers", group: "Architecture and API", title: "Client design", description: "Client design rules, Settings structure and the visual system." },
  { upstream: "docs/releasing.md", route: "developers/releasing.html", section: "developers", group: "Project", title: "Releasing", description: "The release script, the tag-triggered workflow, recovery and current blockers." },
  { upstream: "docs/third-party.md", route: "developers/third-party.html", section: "developers", group: "Project", title: "Third-party components", description: "Reused libraries, their licenses and how release artifacts carry notices." },
  { upstream: "SECURITY.md", route: "developers/security.html", section: "developers", group: "Project", title: "Security policy", description: "Supported versions and how to report a vulnerability privately." },
  { upstream: "CODE_OF_CONDUCT.md", route: "developers/code-of-conduct.html", section: "developers", group: "Project", title: "Code of Conduct", description: "The Contributor Covenant 3.0 Code of Conduct for Moguri project spaces." },
  { upstream: "ACCESSIBILITY.md", route: "developers/accessibility.html", section: "developers", group: "Project", title: "Accessibility", description: "Accessibility standards, checks and known limitations for Moguri's clients." },
  { upstream: "LICENSE.md", route: "developers/license.html", section: "developers", group: "Project", title: "MIT License", description: "Moguri is licensed under the MIT License." },
].map((page) => ({ ...page, source: `vendor/moguri/${page.upstream}` }));

export const settingsMenu = settingsGroups;

// Real desktop captures from Moguri's tests/e2e/design-captures.spec.ts (generated fixtures only).
export const screenshots = [
  {
    name: "conversation",
    capture: "after-conversation-1280.png",
    narrow: "after-conversation-760.png",
    title: "Conversation and Insights",
    alt: "Moguri desktop in dark mode. The session list is on the left, a completed generated conversation with a formatted reply and code block is in the center, and the Insights panel on the right shows Env Local, host execution not isolated, a generated model, Manual autonomy, an Unlimited budget and the call's token usage.",
  },
  {
    name: "approval",
    capture: "after-approval-1280.png",
    narrow: "after-approval-760.png",
    title: "Tool approval",
    alt: "A pending tool approval card in Moguri. It shows the exact command printf GENERATED_DESIGN_AUDIT, warns that it runs on your Mac without sandbox isolation, and offers an approval scope menu, Deny and Approve this action.",
  },
  {
    name: "autonomy",
    capture: "after-composer-popover-1280.png",
    title: "Autonomy levels",
    alt: "The composer's Autonomy menu in Moguri with Manual selected, plus Guided, Autonomous and a disabled Autopilot option. A note says Autonomous and Autopilot are unattended, and hard deny rules, read-only mode, environment policy and budgets still apply.",
  },
  {
    name: "code-change",
    capture: "after-code-change-diff-1280.png",
    title: "Code change panel",
    alt: "Moguri's Code change panel showing a generated fixture repository's workspace diff: one modified file with a removed line and two added lines, and an option to link or open a pull request.",
  },
  {
    name: "settings",
    capture: "after-settings-1280.png",
    title: "Settings",
    alt: "Moguri Settings with a search box and the General, Models, Integrations, Boundaries, Sessions, Instructions and Interface groups on the left, and the Interface page open with Appearance, Keyboard shortcuts, Voice dictation and Notifications sections.",
  },
  {
    name: "analytics",
    capture: "after-analytics-1280.png",
    title: "Dashboard analytics",
    alt: "The Moguri Dashboard's Analytics tab with live counters, a generated session and a zoomable timeline of prompts and answers, kept in memory for one hour.",
  },
  {
    name: "automations",
    capture: "after-automations-1280.png",
    title: "Automations",
    alt: "Moguri's Automations page with a New automation button and recurring automations, the optional repeated-task tool check with its schedule, and one-time scheduled prompts. Each run starts a new chat with the captured model, Env, autonomy and budget.",
  },
  {
    name: "palette",
    capture: "after-palette-1280.png",
    title: "Command palette",
    alt: "Moguri's command palette listing commands such as Start a chat or project, Connect GitHub Copilot, Settings and editable system prompt, and Shared dependency cache.",
  },
  {
    name: "start",
    capture: "after-start-1280.png",
    narrow: "after-start-760.png",
    title: "New session",
    alt: "A new, empty Moguri session asking What are we working on?, with Local execution, Manual approvals and durable history noted under the prompt box.",
  },
];

export const releaseAssets = (version) => [
  { file: `Moguri-${version}-macos-arm64.dmg`, label: "Disk image (DMG)", purpose: "Install Moguri by dragging it to Applications." },
  { file: "SHA256SUMS", label: "SHA256SUMS", purpose: "Checksums for every asset. Verify the DMG before opening it." },
  { file: `Moguri-${version}-macos-arm64.zip`, label: "Updater ZIP", purpose: "The archive the in-app updater downloads and verifies." },
  { file: `Moguri-${version}-macos-arm64.manifest.json`, label: "Update manifest", purpose: "The updater's integrity manifest for the ZIP." },
  { file: `Moguri-${version}-provenance.json`, label: "Provenance", purpose: "The exact source commit and each asset's SHA-256." },
];
