# Guardrails

Technical reference for **Settings / Guardrails**. The app shows a short summary;
this page keeps the full detail.

## Local website allowlist

- Entries can be scoped to a session, a project, or globally within this profile. Matching session, project
  and global entries add together.
- A bare hostname allows HTTPS on the default port only. An exact origin (for example
  `https://example.com:8443`) keeps its scheme and port. Wildcards, paths and other patterns are rejected.
- Unlisted sites ask for approval in Manual and Guided. Explicit Autopilot and Autopilot Max approve web
  requests automatically regardless of this list.
- The list filters Moguri's own web and Agent-browser requests. It does not filter approved Local shell
  scripts.
- Remote sessions do not inherit these entries. Sandbox keeps its own enforced firewall.
- Removing an entry also revokes pending website authority that relied on it.
- If the scope an edit targeted was removed meanwhile, choose a remaining scope before saving.

## Guardrails and tool guidance (page help)

Native file reads, searches, data queries and edits run without factory prompts. Scripts, external MCPs
and unlisted websites ask in Manual/Guided unless explicitly delegated. Explicit Autopilot and Max
selections automatically approve qualified tools and commands, including ask rules, without permission
prompts. Hard denies, read-only modes, environment policy, authentication, source qualification and
budgets still win. Questions requiring actual user facts are not tool permissions.

## Default tool permission

The deny option was previously labeled "Deny unless an explicit rule permits review or access".

## Remembered approvals

A tool rule has `id`, `tool`, `decision` (`ask`/`allow`/`deny`), and a project-relative `pathPrefix`.
Remember commands or conservative command families from the approval card. MCP grants bind the actual
server, tool and schema; MCP tool annotations never count as approval.

## Allowed execution environments

Changing the global allowed-env policy is user-only. Excluding Local blocks new work; already-running
Local turns may finish under their recorded revision.

Local and ordinary SSH own known process groups, not arbitrary double-forked/setsid descendants.
Whole-session containment requires the qualified owned VM and verified VM teardown; a CLI exit is not
proof. Missing qualification blocks work instead of switching environments. Resetting ordinary settings
never widens this separate policy.

Option labels were shortened: "Require qualified SendBox for whole-session containment" is now
"Require Sandbox (whole-session containment)", "Require configured Remote SSH" is now "Require Remote
SSH", and the disabled custom entry "Current explicit set: ..." is now "Custom: ...".
