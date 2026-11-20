# Startup defaults

Technical reference for **Settings / Startup defaults**. The app shows a short summary;
this page keeps the full detail.

## New-session defaults (page help)

Session overrides win over project, current-profile, shared global and factory values. Global
preferences intentionally apply to every profile. Preferences never widen hard policy, and saving does
not rewrite existing sessions.

## Shared global model

A fixed global choice applies to new chats in every profile unless overridden below or by the project or
session. Changing its model resets its model-specific window/effort defaults, not existing chats. "Last
selected" remembers only explicit selections in each profile, never the last inference or a different
profile.

A Kupo default saved before modes existed shows "Saved policy; choose a mode" (previously "Retained
policy; explicitly choose a mode"). Before every paid Kupo request, the exact model, supported effort,
evaluated class and current policy are checked.

## Remembered model status

When nothing is remembered: no model is remembered in this profile. Choose a model explicitly; no model
or provider will be guessed. A remembered Kupo selection without a named mode shows "Saved policy mode"
(previously "Retained explicit policy mode").

## Default response verbosity

Verbosity changes response guidance, not permissions, context limits or accounting. Existing sessions
keep their captured controls.

## Restore global

Restoring the shared global startup preferences preserves existing sessions and hard policy.
