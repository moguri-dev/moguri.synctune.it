# Confirmations

Technical reference for **Settings / Confirmations**. The app shows a short summary;
this page keeps the full detail.

## Confirmations (page help)

Saved in this profile. Hiding a terminal pane leaves its consoles running; the console's X button
terminates it without confirmation. Snapshot and ownership checks always apply.

## Sandbox model retries

The switch was previously labeled "Allow exact private-snapshot restaging for native model retries".
Off by default. Restaging requires verified cleanup of the original guest VM and an unchanged request,
profile, Env and current permissions. It never captures changed live source and never replays tools,
Git or unknown work.
