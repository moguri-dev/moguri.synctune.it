# Providers

Technical reference for **Settings / Providers**. The app shows a short summary;
this page keeps the full detail.

## Availability

- Provider and model availability preferences belong to the current profile.
- Disabling a provider keeps its login and configuration but blocks new model selections and new model calls
  (admissions) through it. Calls that already ran keep their actual outcome and charges.
- Enabling a provider never signs in or starts inference. Refreshing the model list never signs in or starts
  inference either.
- Until the profile's provider inventory loads, no default models are substituted.

## Enabled models and sources

- Only models that are enabled, available and have a selected source appear in model pickers, work through
  `/model`, or are used by routing.
- Models whose upstream IDs match exactly share one row. When several providers offer that ID, choose one
  provider as the source. A saved source never changes silently when it becomes unavailable; the row shows
  "Saved source unavailable" instead.
- The list groups models by the provider that serves them (the chosen source, else the first available
  offering), then by AI lab when a provider offers models from several labs. Every group starts collapsed;
  searching or filtering opens the groups that match. **Order by price** lists free models first (local
  models and providers that declare a zero price), then priced models from the cheapest output price, then
  models without a known price. **Providers** and **AI labs** filters narrow the list. Prices come from the
  provider's own catalogue for pay-per-use providers (OpenRouter, Anthropic API, OpenAI API) or Moguri's
  published API-equivalent table; they are not your bill. The same grouped list is used by Kupo's model
  pool, Cascade classes and the legacy approved-solver list (D59).
- Provider declarations and AI lab labels are not proof of model family, independence or quality.
- With no models, nothing is guessed: sign in to a provider or configure one.
- If a change is not acknowledged by the service, inspect the saved state before retrying.

## Model providers (page help)

Model-provider authentication is separate from GitHub repository integration. Configure Local endpoints
under Local models. No provider is substituted when a connection fails.

## Accounts

Connect GitHub Copilot or your own OpenRouter, Anthropic API, OpenAI API or ChatGPT account. Keys and
sign-in tokens stay in your OS keychain and never reach the renderer, logs or model context. API keys
bill the provider's API; Sign in with ChatGPT uses your ChatGPT plan. Claude.ai subscription sign-in is
not offered because Anthropic does not permit it for third-party apps.

## Agent harnesses

Agent harnesses are off by default. Each harness runs your own installed command-line agent with your
own sign-in; Moguri never installs it or collects its credentials. Harnesses support Local only, the
Unlimited budget, and text and pasted text input. Switches save immediately; refresh available models
afterwards to recheck the harness version and sign-in.

## Claude Agent

Runs your own installed, unmodified Claude Code with your own sign-in. Sign in with `claude auth login`
in your terminal; Moguri never installs Claude Code or collects Claude credentials. Claude Code makes
its own model calls and runs its own tools after Moguri approves each call. Local only, Unlimited
budget, text and pasted text.

Both transports (Claude Agent SDK and the Claude Code stream-json protocol) launch the same executable.
Moguri never runs a Claude binary bundled with the SDK. Refresh available models after changing the
executable to recheck its version and sign-in.

## Codex Agent

Runs your own installed Codex CLI through `codex app-server` with your own `codex login` (ChatGPT or API
key). Moguri never installs Codex or collects Codex credentials. Codex asks Moguri before commands and
file changes; anything it runs without asking (its own exec-policy rules, or known-safe reads in older
versions) is checked against your policy afterwards. Local only, Unlimited budget, text and pasted text.

Codex models come from your login's `model/list`. Refresh available models after changing the
executable to recheck its version and sign-in.

## Chat names

Naming is one tool-less, separately charged model call after the first reply, using the first prompt's
text. It prefers a configured loopback model, a current price estimate, then the actual solver model
(original wording). The "Automatic" naming model choice runs in the chat's original Env. Your
Env, budget and chosen names are preserved. Legacy chats are not renamed; saving this setting does not
run a model.

**Rename the chat when the topic changes** (default on) applies only to chats Moguri already named. When a
new request, plus any steers since the last naming, shares almost no vocabulary with the current title and
the previous naming source, Moguri makes one more naming call with the current title and the new text. The
model may keep the title. At most three renames per chat; a title you set yourself is never replaced.
