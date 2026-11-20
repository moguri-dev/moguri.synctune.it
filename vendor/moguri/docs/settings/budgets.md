# Budgets

Technical reference for **Settings / Budgets**. The app shows a short summary;
this page keeps the full detail.

## Budget limit editors and session accounting

Used on the Budgets page (profile and global caps) and in the composer's Budget and usage dialog
(session budget and accounting summary). Contracts: `docs/architecture/budgets.md`,
`docs/architecture/budget-plans.md`, `docs/architecture/budget-winddown.md`.

- Accounting help (old wording): "Estimates are not a billing guarantee. Missing completion keeps
  reservations held. Resume, deletion and model changes do not reset this ledger."
- Planned holds help (old wording): "Planned capacity is not a model call or provider report. Only
  provably undispatched holds can be released automatically after their owner stops. Dispatched or
  uncertain usage stays held." The field was labeled "Undispatched model holds" (the usage dashboard still
  uses that label).
- Held tokens shown as "Unbounded / blocks finite admission" when unknown: unknown held usage blocks
  admission under finite caps.
- A child session's usage is charged to its owning session, including the owner's other model-created legs.
- With no telemetry snapshot: "No retained accounting snapshot is available. No free usage was assumed."
- Kupo sessions: finite session caps require the reserved wind-down (finishing) readiness; if it cannot be
  read, no finite control is enabled. Profile and global caps still apply; no policy is removed in the
  session editor.
- Select labels were "Global hard policy", "Profile hard policy" and "Session preference"; options were
  "No global cap", "No profile cap", "Unlimited, subject to hard policy" and "Estimate-based cumulative
  limits".
- USD caps need fresh model-specific rates and priced prior calls (and priced planned holds). Configure
  estimates in Settings > Budgets; unknown history cannot be reset to free.
- Consent previously read: "I accept estimate-based accounting and interruption risk."
- Accounting model (old help): input reservations are estimated; the actual output limit is forwarded to
  the provider. Provider totals reconcile once. Reported overages and missing telemetry remain visible;
  in-flight charges cannot be undone.
- While a turn runs, saving a session budget queues it for after the current turn; the cap applies when
  the queue reaches it. Profile and global policy still apply immediately.
- Save notices (old): global policy cannot be refunded by profile switching, source deletion or
  defaults; profile policy cannot be removed by factory or default resets; saving a session budget does
  not reset existing usage. A failed save never silently lifts a cap.
- `BUDGET_WARNING` (packages/protocol/src/budgets.ts) is still shown unchanged.

## Model prices

Previously titled "Provider API-equivalent prices". Contract: `docs/architecture/budgets.md`.

- The page previously showed `API_EQUIVALENT_NOTICE` (packages/protocol/src/pricing.ts): "API-equivalent
  estimates use the originating provider's published API rates, including name-matched Copilot/reseller
  models. They are not subscription charges, provider-reported spend or invoices."
- Example: a name-matched Opus 5.5 uses Anthropic's API rates even through Copilot.
- Unknown, ambiguous or expired rates stay unknown. Text-token estimates exclude subscriptions,
  regional or service surcharges and separate hosted-tool charges.
- Refreshing official reference prices never reprices historical calls and makes no model request or
  authentication. A failed or stopped refresh preserves previous references and historical costs; the
  original refresh job's final outcome remains authoritative.
- Catalog sources are either a bundled verified snapshot or an explicit official-page refresh.
- Model rows show input and output USD per million tokens (API-equivalent) and the captured source date.

## Budgets and model estimates (page help)

Session caps and profile policy share one cumulative all-role ledger (every model role counts). Unknown usage is not zero. Exact
provider-billing caps are not qualified; finite controls require explicit estimate-based accounting.

## Provider API price estimates

The switch was previously labeled "Estimate model costs using originating-provider API prices". Prices
come from the originating provider's published API rates.

## Estimates for USD limits

The consent switch was previously labeled "I accept fresh API-equivalent estimates for finite USD
limits, not exact billing caps". Only fresh (unexpired) reference prices count.

Without this consent, USD limits need your explicit dated model rate. Existing hard policy and unknown
historical charges still apply. Cached input uses reported cached subsets; an unspecified cache-write
TTL uses the highest listed write rate. Reservations include that conservative headroom.

## Local wind-down policy (previously "Explicit Local wind-down policy")

Off by default. Select an exact available model ID, separate hosted metadata consent and complete
output/deadline bounds. A reserved metadata-only finishing role uses the existing all-role ledger; it
receives no raw task, code or chat history. Unknown work or a newly stricter cap can still block it.

Saving never selects a model or approves Git. Use Candidates / Budget wind-down checkpoints for a
separate user review of accepted work on a new branch. The source index and HEAD stay intact; there is
no automatic push, merge or branch deletion. Remote and native (Sandbox) wind-down remain unqualified.

## Model-specific USD overrides

Your dated input/output rates for a canonical model ID take precedence over provider references. The
override input rate applies to every input category, including cache. An expired override is not
silently replaced. Missing or stale rates disable USD admission; the request is not treated as free.

## Example rates (previously "Illustrative estimate configuration, not Copilot pricing")

Replace illustrative rates with your own approved estimate. An explicit zero rate is allowed; unknown
metadata never supplies zero automatically.

## Current-profile hard policy

Applies across this profile's sessions and model-created legs. Unlimited preferences, default resets,
source deletion and restart cannot remove this policy or refund accounting. Removing the policy
requires this explicit revision-bound action.

## Global hard policy

Applies across every profile. Creating or switching profiles cannot refund global usage or escape
unknown held calls. No other profile's task content is disclosed here.
