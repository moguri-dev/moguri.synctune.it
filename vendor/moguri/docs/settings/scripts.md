# Scripts

Technical reference for **Settings / Scripts**. The app shows a short summary;
this page keeps the full detail.

## Repository script reviews

- Agent assessments are advice, not a safety guarantee or permission.
- Unsafe advice never opens an execution-approval prompt by itself; the user must force the exact unsafe source first.
- Approving a safe assessment clears only that notification. It does not run the script or grant execution permission.
- Forcing overrides only the unsafe advice. Hard policy, the exact source and root, and normal execution approval still apply.
- In Sandbox, a forced script runs in a new model-free guest that uses the same verified private stage and reviewed native network boundary, never the Local source. Isolation does not make the code safe.
- Locally, code may change your files or contact external services without OS isolation.
- One original attempt is retained per review. Inspect its actual tool or job outcome; it cannot be replayed.
- Moguri lists indicator findings (pattern matches such as downloading and running code, installing packages at
  run time or decoding hidden content) under the full source. They are not a malware or safety verdict.
- Contract: `docs/architecture/content-review.md`.

## Script reviews switch

**Let the agent approve scripts with download or decode findings** is off by default. Off: when a script has
download-and-execute, run-time install or decode-and-execute findings, the agent can't mark it safe; it must
report it as unsafe and only you can force it. On: you accept the risk that the agent's own "safe" verdict
runs such scripts; normal approvals and hard policy still apply. Changing it counts as a permission change, so
open script reviews must be inspected again.

## Scripts (previously "Foundational and approved scripts")

Built-in `grep_logs`, `fetch_page`, `search_memory` and `memory_graph` are exposed through the single
internal MCP, without generated one-off scripts.

## Customize / Tools tab (protocol 114, project-less from 116)

- Lists the agent's built-in toolsets, the foundational scripts and your scripts with On/Off switches. Listing grants
  nothing; each chat still gets only what its environment, mode and policy allow.
- The tab isn't tied to a project. **Write a script** submits your source for every chat, with the same review as a
  model proposal. **Ask the agent to write a script** opens a project-free chat with an editable request; the agent
  submits it with `propose_script`, which needs the optional evolution switch.
- Every chat sees its project's scripts plus every-chat scripts; a project script with the same name replaces the
  every-chat one in that project.
- Scripts are Node.js ES modules run in the chat's working folder (project root, or Home for a project-free chat) that
  read `{"arguments": {...}, "projectRoot": "..."}` from stdin and write at most 128 KiB to stdout. A leading
  `// description: ...` comment becomes the description agents see once approved.
- **Suggested tools** lists repeated requests (for example `markdown_into_pdf`) found by a local phrase match. The
  optional repeated-task check in Automations runs it on an interval and adds new suggestions to Inbox.
- Contract: `docs/architecture/skills-tools-artifacts.md`.

## Warning

Approved custom scripts execute as Local host code, not in a fictional sandbox. Review the full source,
enable it explicitly, and approve each call. Use only scripts you trust.

## Optional evolution

The switch was previously labeled "Allow model-proposed skills, scripts and style knowledge for human
review". Off by default. Nothing applies itself; approval installs disabled content and enabling and
execution remain separate actions.

## Proposal review

The heading was "Review exact proposed content". The consent checkbox was "I reviewed this exact source.
Approval does not grant execution permissions." The SHA-256 digest shown binds the approval to the exact
content reviewed.
