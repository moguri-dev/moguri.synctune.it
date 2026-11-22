# Confirmations

Technical reference for **Settings / Confirmations**. The app shows a short summary;
this page keeps the full detail.

## Confirmations (page help)

Saved in this profile. Hiding a terminal pane leaves its consoles running; the console's X button
terminates it without confirmation. Snapshot and ownership checks always apply.

## Send the next queued prompt when a turn finishes

On by default (`interactions.autoSendQueue`, protocol 117). When a turn completes, the top prompt you
held with Cmd/Ctrl+Enter starts next, one turn at a time. Holding in an idle chat starts nothing.
Stopped, failed or partial turns, paused chats and prompts Moguri held after a stop, rewind, archive or
restart keep waiting for Send now or Resume. Turn it off to start every held prompt yourself. Contract:
[D53](../architecture/decisions.md#d53-queued-prompts-you-held-start-after-each-completed-turn).

## Sandbox model retries

The switch was previously labeled "Allow exact private-snapshot restaging for native model retries".
Off by default. Restaging requires verified cleanup of the original guest VM and an unchanged request,
profile, Env and current permissions. It never captures changed live source and never replays tools,
Git or unknown work.
