# Stainless

Technical reference for **Settings / Integrations / Stainless**. The app shows a short summary;
this page keeps the full detail. Contract: [Stainless integration](../architecture/stainless.md).

## Page help

Uses your installed [Stainless](https://github.com/mbianchidev/stainless) browser
for previews and agent browser automation. Off by default.

## Use Stainless

Saves immediately. While off, status, check, Open in Stainless and agent
batches never launch or open anything.

## Stainless app location

A written value with an explicit Save. Empty means `/Applications/Stainless.app`,
then `~/Applications/Stainless.app`. A saved location must be the exact absolute
`.app` bundle and is used without any fallback search.

## Status

Detection reads only the bundle's `Info.plist`; it never starts Stainless.
Version, Chromium version, location and whether Moguri tested this exact build
are shown. "Last check" is kept in memory until the service restarts.

## Check compatibility

Starts one hidden Stainless with a throwaway profile, loads a generated page on
`127.0.0.1`, reads it back and closes it. No model is called. Untested builds
need a passing check before agents can use them; a failed check marks the build
incompatible until it changes or is checked again.

## Get Stainless

Shown when no bundle is found. Opens the Stainless releases page in your
default browser.
