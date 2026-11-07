# Models and budgets

Model selection, execution environment, autonomy, and budget are separate controls. An available model does not grant tools permission or make a workspace sandboxed.

## Choose a model

Sign in to Copilot or configure a model server, then open the composer Model control. Select one of the actual available entries.

`moguri models list` shows selectable models. `moguri models catalogue` also includes disabled and unready offerings. Use their canonical IDs, not a display name you invent.

```sh
moguri models list
moguri models refresh
moguri models catalogue
moguri slash '/model MODEL_ID' --session SESSION_ID
```

In the TUI, Ctrl+M opens the picker. Login does not automatically choose a model. A failed provider or stale selection does not silently switch to another source.

## Enable providers and exact sources

**Settings / Models / Providers** can disable providers or individual models while retaining configuration and credentials.

When multiple providers offer the same exact upstream API model ID, choose one source explicitly. A model row is not proof of independent weights or measured quality.

```sh
moguri models provider PROVIDER_ID disable
moguri models provider PROVIDER_ID enable
moguri models disable API_MODEL_ID
moguri models enable API_MODEL_ID
moguri models source API_MODEL_ID CONCRETE_MODEL_ID
```

Check the session selection again after disabling or re-enabling a provider. Availability gates both fixed-model and Kupo admission. Already admitted calls retain their actual result and charges.

## Connect an OpenAI-compatible server

Start and configure the server yourself. Moguri does not scan hosts, download weights, or start inference runtimes.

Open the local-model endpoint settings under Models. The `localModels` setting is an array of explicit endpoints. For example:

```json
[
  {
    "id": "demo-server",
    "name": "Demo model server",
    "enabled": true,
    "baseUrl": "http://127.0.0.1:8000/v1",
    "auth": "none",
    "models": [
      {
        "id": "demo-coder",
        "name": "Demo coder",
        "contextWindow": 32768,
        "maxTokens": 8192,
        "imageInput": false,
        "toolInput": true
      }
    ]
  }
]
```

This is an example array, not the whole settings file. Replace the URL and model ID with the server's actual advertised values. Declare real context, output, image, and tool support rather than guessing from a model name.

| Field | Meaning |
| --- | --- |
| Endpoint `id` | Stable lowercase identifier, beginning with a letter. |
| `name` | Display label. |
| `enabled` | Whether the endpoint participates in discovery and selection. |
| `baseUrl` | OpenAI-compatible API base. Remote addresses require HTTPS. HTTP is loopback-only. |
| `auth` | `none` or `bearer`. Credentials are stored separately. |
| Model `id` | The upstream model ID advertised by that server. |
| `contextWindow` | Declared maximum context, at least 8,192 tokens. |
| `maxTokens` | Declared output maximum. |
| `imageInput` | Whether the model can accept images. |
| `toolInput` | Whether it can use tools. Models without tools cannot read attached descriptors through tool calls. |

Saving an enabled endpoint performs bounded model discovery, not inference. Only configured, advertised models become selectable.

Use the endpoint's key form for bearer access, the TUI's masked `/model-token ENDPOINT_ID`, or piped stdin with `moguri models token ENDPOINT_ID`. Never put the key in the JSON, a prompt, shell arguments, or a URL.

Moving an endpoint does not reuse its old resource-bound key. Remote model keys are separate and bound to the SSH target.

## Inspect runtime readiness

Open **Model / Model details and setup** to inspect an exact configured model. Runtime and hardware readiness is informational by default.

```sh
moguri models readiness MODEL_ID --session SESSION_ID
moguri models readiness MODEL_ID required --session SESSION_ID
moguri models runtime-preview MODEL_ID --session SESSION_ID
```

Endpoint availability and hardware observations are different facts. Estimates do not attest performance or capacity.

An offline runtime version command has a separate exact preview and one-use review:

```sh
moguri models runtime-review MODEL_ID PREVIEW_DIGEST --session SESSION_ID --confirm-review
moguri models runtime-probe MODEL_ID REVIEW_ID --session SESSION_ID
```

The probe consumes its original review once. Ordinary refresh does not execute a binary, install a runtime, start a model, or reuse a previous approval.

## Set context and thinking

For a fixed model, use **Model / Context window** and **Effort**, or the shared commands:

```sh
moguri slash '/model-settings' --session SESSION_ID
moguri slash '/context-window half' --session SESSION_ID
moguri slash '/context-window max' --session SESSION_ID
moguri slash '/thinking high' --session SESSION_ID
moguri slash '/thinking default' --session SESSION_ID
```

Use only efforts supported by the actual model. `default` clears the effort override without clearing the working window.

Exact context values must fit the model and provider's allowed windows. The general minimum is 8,192 tokens. A provider-declared discrete set is not a continuous range. `half` floors half the maximum and can fail if that value is unsupported.

An unsupported saved value stays visible and blocks inference. Moguri does not silently clamp it or truncate history. Response and reasoning share the declared output allowance, which a finite budget can reduce.

New fixed-model selections retain the thinking preference where supported. Kupo mode is a separate control; pooled-role settings, when available, still use their own qualified values.

## Use Kupo

Choose Kupo in the Model picker after configuring at least one eligible model. With one eligible model, automatic Kupo uses that model without a classifier call.

With a larger eligible pool, a bounded router can choose Single, gated Cascade, or a reviewed Critique pattern. All actual router, solver, critic, revision, and escalation calls count toward usage.

```sh
moguri slash '/model kupo' --session SESSION_ID
moguri slash '/kupo status' --session SESSION_ID
moguri session kupo-mode balanced --session SESSION_ID
moguri session kupo-mode savings --session SESSION_ID
moguri session kupo-mode performance --session SESSION_ID
```

Balanced is the default automatic mode. Savings and Performance require the appropriate reviewed model evaluation and reference-price evidence. They do not infer quality classes from a model name or treat hosted access as free usage.

Review those sources in **Settings / Kupo routing / Review model evaluations and reference prices**. Narrow the approved pool or hosted task-data consent there when needed.

Existing explicit Single or Compound policies are not silently converted into automatic mode. Their classifier, pool, source reviews, and transport limits remain separate.

Finite automatic work needs enabled bounded finishing and complete role reservations. Native work additionally needs current runtime qualification. Unavailable combinations stay blocked rather than falling back to another model or Env.

**Insights / Kupo routing provenance** shows the actual plan and models. Confidence and model verdicts are advice, not measured quality, executed tests, or permission.

## Set budget limits

Unlimited is a preference, not an exemption from profile or global hard policy. Open Budget to inspect current accounting and set estimated cumulative token or USD limits.

Read and accept the interruption and estimate policy before saving. A token-only example `session-budget.json` is:

```json
{
  "kind": "limited",
  "basis": "estimate",
  "tokens": 50000
}
```

```sh
moguri budget set SESSION_ID session-budget.json --confirm-review
moguri budget status SESSION_ID
```

For profile or global hard policy, use the current observed revision and separate confirmation. Those limit files use `basis` and optional token/USD limits without the session `kind` field. An explicit `null` removes the selected policy, not accounting.

Changing a model, Env, source session, or profile does not refund accumulated usage. Restoring ordinary preferences does not clear hard caps.

## Understand cost and reservations

Inputs and visible streamed outputs can be estimates. Provider-reported usage replaces estimates when available. Cached input is included in input totals, not added twice.

USD limits need accepted model-specific estimates or reference rates. API-equivalent reference prices are not a Copilot subscription bill or an invoice. Unknown prices are not zero.

The service reserves capacity before model dispatch. Unreported or interrupted calls keep their holds until authenticated settlement or inspection. A stop cannot undo charges already incurred.

Use Dashboard's My work, Usage, Cost, and Velocity views. Filters change presentation, not admission or historical pricing:

```sh
moguri dashboard usage
moguri dashboard cost
moguri budget dashboard --project PROJECT_ID --role solver
moguri budget dashboard --filters '{"range":{"kind":"days","days":30},"bucket":"week"}'
moguri budget calls --filters '{"range":{"kind":"days","days":30},"limit":20}'
```

Repository and organization filters need verified attribution. Unassigned history remains unassigned. Velocity is observed activity, not proven productivity or invented time savings.

## Compact long conversations

Use the reviewed compaction controls when a conversation no longer fits. Compaction is a metered model operation with its own source, preview, generation, and application review.

Original history stays retained. Images are not silently compacted away. Restoring the original does not replay work or reset charges.

Automatic Kupo text compaction is a separate opt-in policy, off by default. It is not permission to discard arbitrary history.

For unavailable models, context errors, or held usage, see [troubleshooting](troubleshooting.md).
