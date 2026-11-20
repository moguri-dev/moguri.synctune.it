# Remote SSH

Technical reference for **Settings / Remote SSH**. The app shows a short summary;
this page keeps the full detail.

## Remote SSH (page help)

Run the agent, its file and command tools and inference on an explicitly approved SSH host. The local
service keeps authority and history. SSH is not SendBox isolation.

Set each project's canonical `remotePath` in Project settings. A localhost model endpoint belongs to the
SSH host, not this Mac. Declare remote endpoints in `models` with the same explicit limits as Local
models.

Review Remote MCP resources and separate access-forwarding grants under MCP gateway. Selecting Remote
never grants MCP access. Explicit user consoles use their own captured SSH owner and root, not a Local
shell or SendBox isolation. Repository-memory retrieval and transferred Local scripts remain
unavailable on Remote.

## Warning

Verify the full public host key out of band. The identity file stays on this machine; agent forwarding,
tunnels and ambient SSH configuration are disabled. Install this exact Moguri build on the target.
Setting `allowCopilot` grants short-lived model access to that verified host, never a refresh credential
or your secret store.

## Remote endpoint credentials

Keys bind to the verified SSH identity and exact model URL. A host-local key is never silently reused
on Remote. Stored keys go to the explicit secret backend.

## Remote runs (previously "Owned execution recovery")

An SSH disconnect requests cancellation; it is not proof of cleanup. Reconcile reads existing receipts
without replaying work. A partial turn never becomes successful just because late usage arrives.

Recording an inspection ("I inspected ...") is your acknowledgement only; it is not proof of
containment or cleanup. The default select value was previously "No remote process inspection
confirmed". When a run has no diagnostic, the panel shows that its owned worker status was recorded.
