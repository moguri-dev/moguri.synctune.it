# Settings reference

The desktop Settings pages keep their on-screen text short. These pages hold the full
behavior, limits and safeguards behind each setting. The [design rules](../design.md) describe how
Settings presents them; the linked architecture contracts remain authoritative for implementation.

The rail has 7 groups and 28 entries. Integrations and Interface are single rail
entries whose pages are tabs; see [Settings rail structure](../design.md#settings-rail-structure).

## General

- [General](general.md)
- [Repositories](repositories.md)
- [Project](project.md)

## Models

- [Providers](providers.md)
- [Local models](local-models.md)
- [Kupo routing](kupo-routing.md)
- [Decision providers](decision-providers.md)

## Integrations

One rail entry with a tab per integration. Each tab shows its status.

- [GitHub](github-workflows.md) (previously "GitHub workflows")
- [Linear](linear-workflows.md) (previously "Linear workflows")
- [MCP gateway](mcp-gateway.md)
- [sql-not-so-lite](sql-not-so-lite.md)
- [Stainless](stainless.md)
- [Plugins](plugins.md)
- Marketplace: no additional detail beyond the on-screen text.

## Execution and permissions

- [Guardrails](guardrails.md)
- [Sandbox](sandbox.md)
- [Remote SSH](remote-ssh.md)
- [Subagents](subagents.md)
- [Scripts](scripts.md)
- [Lifecycle hooks](lifecycle-hooks.md)
- [Dependency cache](dependency-cache.md)

## Sessions

- [Startup defaults](startup-defaults.md)
- [Confirmations](confirmations.md)
- [Retention](retention.md)
- [Context compaction](context-compaction.md)
- [Budgets](budgets.md)
- [Artifacts](artifacts.md)
- [Candidates](candidates.md)

## Instructions

- [User guidance](user-guidance.md)
- [System prompt](system-prompt.md)
- [Skills](skills.md)
- [Knowledge tiers](knowledge-tiers.md)
- [Repository memory](repository-memory.md)

## Interface

One rail entry with a tab per page. Previously four groups (Appearance, Voice,
Accessibility, Notifications).

- [Appearance](appearance.md)
- [Keyboard shortcuts](keyboard-shortcuts.md)
- [Voice dictation](voice-dictation.md)
- [Notifications](notifications.md)
