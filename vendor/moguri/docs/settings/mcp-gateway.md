# MCP gateway

Technical reference for **Settings / Integrations / MCP gateway**. The app shows a short summary;
this page keeps the full detail.

## Remote MCP access (Remote sessions only)

- Remote MCP execution happens on the pinned SSH host, not inside SendBox (Sandbox) isolation.
- A saved Local MCP account or credential is not permission to send that credential to the SSH host. Forwarding
  needs the separate "Allow Remote MCP access forwarding" choice in the review.
- The forwarded access credential may be a long-lived bearer key, and the host can retain it. Refresh
  credentials always stay local.
- Granting access is scoped to the exact profile, SSH peer (host, user, port and pinned host key), remote root and
  MCP resource shown in the review, bound by a review digest. It grants no tool approval or broader policy; each
  tool call still needs its own exact approval.
- Probe the configured SSH target before a new review. Revocation and inspection of retained results do not need
  a ready host. Discovery and execution are separate actions; saving a grant starts no tool call. After saving,
  probe SSH again and discover tools under the new scope.
- If settings, policy, project configuration or session controls change during a review, the review becomes
  stale and must be redone; no permission is inferred from a stale review.
- Revoking a grant cannot roll back access the host already received or external effects that already happened.
  Retained results remain readable.
- Recorded calls: a grant or tool catalog is not a tool effect; only admitted calls are listed. Each row shows the
  actor (model or external SDK), phase, and whether access was forwarded. The desktop shows the latest 10 calls;
  use `/mcp-remote calls` for the full session list. Result previews are limited to 12,000 characters; use
  `mcp.readResult` with the recorded job ID for exact result pages.
- Reconciling reads existing SSH receipts only. No tool or credential is replayed, and an original partial turn
  stays partial.
- If a Remote MCP action fails, there is no Local or credential fallback.

## OAuth connection

- Uses the OAuth authorization-code flow with PKCE and issuer/resource binding. Credentials are stored only in the
  keychain. The login page opens only when you explicitly choose the authorization link.
- Pre-registered client: if the server does not support dynamic client registration, store a client ID, issuer
  URL and (only if required) client secret.
- Redirect URI: register the exact loopback redirect with the issuer. Without one, Moguri uses an ephemeral
  loopback port, which the issuer must support. If a fixed port is already in use, the login fails explicitly.
- If OAuth fails, Moguri never falls back to anonymous access.

## Tools and MCP (page help)

Rank equivalent available integration methods for this profile. The agent receives this preference, not
new permissions, credentials or a different execution boundary. Discover exact MCP schemas before calls;
models cannot authenticate, approve themselves or install a server.

## Tool preference order

Drag a handle, or use Alt+Up/Down, to choose which available method the agent should try first. Changes
save for all of this profile's clients.

## Server

Save configuration first. Supported transports: stdio or Streamable HTTP. OAuth uses an explicit
authorization link with PKCE and resource-bound keychain credentials. Raw bearer credentials stay in the
keychain, never settings.

## Selected tool

For a Remote-scoped tool, this catalog cannot authorize a Local or different-resource call. The
arguments field label was "Exact JSON arguments" (accessible name unchanged: "Exact MCP JSON
arguments"). Return to the main session to approve the requested call. It must be idle; no second agent
is allowed to seize an active turn.
