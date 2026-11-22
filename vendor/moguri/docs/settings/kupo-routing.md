# Kupo routing

Technical reference for **Settings / Kupo routing**. The app shows a short summary;
this page keeps the full detail.

## Add model scores and prices

Previously "Review model evaluations and reference prices". Contracts: `docs/architecture/automatic-kupo.md`,
`docs/architecture/routing.md`, `docs/architecture/model-evidence.md`.

- Balanced can use declared capabilities. Savings and Performance class each model by a current
  profile from this section, else as economy when it is an execution-host loopback model, else by the
  output price its pay-per-use provider declares (such as OpenRouter, D56), else by its exact published
  output API price in Moguri's price table (bundled or refreshed under Budgets): up to $5 per million
  tokens is economy, $20 or more is frontier and anything between is standard. An unpriced model without
  a profile stays unclassed and runs only in Balanced (and Dynamic's Balanced rules). Price is a class
  signal, not quality. Unknown is never treated as frontier, cheap, free or independent (D55).
- Profiles are optional. A profile overrides the price class, and a pair of profiles with comparable
  scores is also a valid Cascade pair; Cascade and Critique no longer require them (D56).
- Scores are source-reviewed normalized observations, not Moguri quality guarantees. Comparable Cascade
  models need the same evaluation-set SHA-256. A reviewed lineage Critique pair also needs a matching
  user-defined cost class. Evidence expires within 30 days of observation. No benchmark or metadata
  request runs here.
- The review shows the source SHA-256, evaluation set and cost class.
- Reference prices are reference only: not billed cost or a rate-policy change. For local models with
  basis `local-no-api-fee`, having no hosted API fee does not erase token usage, configured rates or
  unknown accounting.
- Consent previously read: "I reviewed this exact source, classification, scores, price and limitations".
- Adding a profile does not select a mode, call a model or grant permissions. The complete policy must be
  saved explicitly after review (button previously "Add to unsaved Kupo policy").

## Independent model pair

Previously titled "Actual-user source claim". Contracts: `docs/architecture/compound-workflows.md`,
`docs/architecture/model-evidence.md`.

- This prepares a local policy draft only. No source URL is fetched, no provider metadata is inspected, no
  policy is saved and no model is called. Settings are saved separately after reviewing the complete
  policy.
- The panel previously showed the full `COMPOUND_EVIDENCE_WARNING`: "Lineage eligibility is an
  actual-user-reviewed source claim, not proof about unobservable training or model quality. Provider
  declarations, aliases and matching output contracts are not that review. Passing project tests covers
  only those commands and exact bytes; critics do not grant permissions or accept source changes."
- Old field labels: "Exact draft model", "Exact critic model", "Source-backed draft lineage identifier",
  "Source-backed critic lineage identifier", "Reviewed source kind" (reviewed training report, reviewed
  model card, reviewed independent audit), "HTTPS source URL", "Exact reviewed source text", "Explicit
  review expiry, UTC ISO timestamp", "Evidence limitations".
- Consent previously read: "I reviewed this exact source and model pair. I am making a limited
  eligibility claim, not proving independent training or code quality."
- After adding, the exact model/source claim is added only to the local policy draft and matching
  Critique routes; it implies no model call or source acceptance.

## Workflow policy options

The options were renamed: "Explicit Single policy" is now "Single (approved solvers)" and "Reviewed
worktree Cascade / Critique" is now "Cascade / Critique in a worktree". Values (`auto`, `single`,
`compound`) are unchanged.

## Automatic Kupo

Kupo uses your configured models automatically. No eligible model means no inference. One eligible
model always runs directly in Single (without a classifier). With multiple models, Kupo chooses Single,
gated Cascade, cross-lab Critique or Council for each request, as the preference and workflow settings
allow. Contract: `docs/architecture/automatic-kupo.md` (D56).

## Kupo workflows

Every workflow is on by default (`kupo.workflows` absent). Each has its own settings:

- **Cascade** (`cascade.enabled`, `cascade.classes`): a model in a cheaper class drafts and a model in a
  strictly pricier class (economy, then standard, then frontier) escalates when the gate asks. A model's
  Cascade class is its reviewed profile, else your override in `classes`, else its ordinary class.
  `excluded` removes a model from Cascade entirely.
- **Critique** (`critique.enabled`, `critique.labPairs`): a critic from a different AI lab reviews the
  draft and the drafter revises within the revision bound. Labs come from the model ID, API ID, display
  name or direct provider; each pair is unordered. An empty list allows any two different known labs.
  Lab labels are name-based, not proof of independent training. Reviewed lineage pairs stay valid.
- **Council** (`council.enabled`, `council.labs`, `council.size` from 3 to 5): one drafter and
  `size - 1` reviewers, each from a different known lab, review the same draft. All passing selects it,
  a majority rejecting stops it, and anything else returns every critique to the drafter for one
  revision the whole council reviews again. An empty `labs` list allows any known lab; local models
  without a recognizable name count as one lab.
- Single is always available. Lab pairs need two different known labs without duplicates, and Council
  labs must be known; invalid settings are refused when saved.

Each preference uses a subset: Savings runs Single and Cascade; Balanced runs every enabled workflow and
avoids frontier solvers and drafters for requests above 32,768 estimated input tokens while a
non-frontier model is eligible; Performance runs Single, Critique and Council at High or xhigh; Dynamic
picks per request. Every mode picks thinking effort per request by task complexity, capped at xhigh: Kupo
never chooses Max, which tends to degrade results. The composer's mode list
(`routing.modes`) shows which workflows each mode can run with the current models, with eligible pairs
and Council models.

## Configured model pool

Selecting Kupo uses all eligible configured models by default, including models configured later. Turn
off network routing to restrict it to execution-host loopback. An optional nonempty `approvedModelIds`
list in the advanced policy narrows the pool. Disable Kupo to allow none. Configuration never starts
inference or changes autonomy.

## Model capabilities (previously "Declared capability inventory")

Categories describe supported inputs, reasoning controls and context, not measured coding quality or
latency. Unknown tool support stays unknown. No paid benchmark or extra provider inspection runs during
discovery. When no model is eligible, inspect the provider, privacy and environment diagnostics shown
under Saved-policy availability.

## Automatic context compaction

The switch was previously labeled "Allow bounded automatic text summaries at safe model boundaries".

Until you change it here, it follows [Context compaction](context-compaction.md), which is on by
default since protocol 110; the page says "Follows Context compaction until you change it here."
Changing it saves an explicit Kupo policy that permits (or forbids) metered compaction calls and
source-bound summaries, not permissions or human answers. Complete recent turns and original history
remain retained and readable. Images are not compacted or silently dropped. The advanced policy sets the
exact compactor, trigger fraction, recent turns, output bound and per-turn call limit.

## Automatic mode warning

Only a selected original response reaches ordinary permissions. New modes run Cascade with a strictly
cheaper draft class, Critique with a critic from a different AI lab and Council with one model per lab;
lab labels are name-based, not proof of independent training. Missing System One/Autopilot transports remain
blocked. Sandbox needs fresh exact native-byte qualification; there is no Local fallback.

## Compound routing policy

Declare exact Cascade/Critique routes, approved concrete models, hosted-data consent and complete role
bounds. The classifier chooses only an eligible declared route. Configuration never selects a model,
spends budget, stages code or runs tests.

Each Cascade route needs `id`, `pattern: cascade`, `draftId` and `escalationId`. Each Critique route needs
`id`, `pattern: critique`, `draftId`, `criticId` and `lineageReviewId`. Use canonical model IDs (listed
under "Available model IDs", previously "Available exact model IDs"), not names or provider family
strings. Up to four routes and eight approved role models.

## Compound warning

Public Compound requires exact selected-Env source and stages and a separate actual-user staging/test
review. Local and pinned SSH use their original roots; native-private (Sandbox) work remains physically
unqualified until fresh exact-runtime evidence passes. Finite budgets need the selected-boundary reserved
finishing (wind-down) policy. Autopilot needs an explicit compatible Decision provider and cannot bypass
reviews or hard policy. No fallback.

## Single policy

One tool-less classifier chooses one explicitly approved solver. Both calls are metered and use the
existing agent, permissions and execution env. Configuration never selects a model or starts inference.

## Approved solvers

Approve up to eight models. Availability, env, context capacity and output bounds are rechecked before
each call; this list is not a guarantee of eligibility. With no configured models, connect Copilot (or
another provider) or configure a local endpoint first. An unavailable solver shows "unavailable for
Kupo": inspect environment, privacy, context and output bounds.

## Hosted or network routing data (Single)

The switch was previously labeled "Allow approved task history to hosted or network classifiers and
solvers". Leave this off for explicitly configured loopback endpoints. A provider's local label does not
make a network URL local. Loopback is on the execution host, not proof that a configured proxy never
forwards data. Model redirects are blocked. Remote also needs its separately approved SSH host and
scoped Copilot grant.

## Classifier confidence threshold

This is model-supplied advice, not a calibrated probability or permission. Invalid or low-confidence
plans pause without another model or fallback.

## Single warning

Finite Single needs an explicitly configured qualified finishing (wind-down) policy on its selected
execution boundary. Images, documents and exact window/effort controls require every actual
classifier/solver capability; unsupported context is preserved, not dropped. This explicit policy
remains Single; automatic Cascade/Critique and separately reviewed Compound have their own contracts.
Native execution still needs fresh physical qualification. Hard policy is never lifted.

## Saved-policy availability

After saving, explicitly select kupo in the composer. Changing this policy invalidates pending routed
permissions; calls already in flight may still incur usage.

## Classifier prompt (previously "Read the fixed classifier contract")

The editable system prompt still governs the solver. Classifier output is validated data, never solver
instructions or a user answer.
