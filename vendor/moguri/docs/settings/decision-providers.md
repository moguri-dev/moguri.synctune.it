# Decision providers

Technical reference for **Settings / Decision providers**. The app shows a short summary;
this page keeps the full detail.

## Decision providers and Local Max (page help)

Off by default, with no selected model. Explicitly select a bounded-model System One-compatible
transport, exact model ID, output/deadline/call bounds and separate hosted-data consent. Saving never
starts inference, selects a solver, changes Env or grants tools.

Current Max automatically approves tools; `reviewDelegatedTools` applies only to retained legacy bounded
configurations. Technical questions need `kind: technical-choice`, an exact question and identical
offered choices, with freeform disabled. They are not user-only facts. Steering starts off and selects
only original user-authored id/text alternatives; `continue` and `askUser` are reserved.

## Available model IDs

The disclosure was previously labeled "Available exact model IDs". Use the exact IDs listed there in the
policy JSON.

## Warning

Confidence and selected probability are separate, uncalibrated advice. Jev remains unqualified because
its documented API cannot enforce the required output-token bound. Remote/native (Sandbox) Max stays
blocked and is never moved to the Local controller. There is no provider or model fallback, and a
decision never grants a new permission or a Git approval.

## Saved-policy readiness

After saving, explicitly select Autopilot Max in the composer. Inspect the model actor, original
request, raw output, charges and cancellation under Artifacts / Decision-provider observations. User
answers and approvals always win races against a decision.
