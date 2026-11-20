# Local models

Technical reference for **Settings / Local models**. The app shows a short summary;
this page keeps the full detail.

## Configured local models (page help)

Connect an OpenAI-compatible server you started, such as ds4, Ollama or llama.cpp. Saving performs
bounded model discovery only against enabled URLs. It never scans hosts, downloads weights or selects a
model automatically.

## Endpoint configuration example

Declare the actual model limits (context window, max output tokens) and image support; discovery never
guesses them. HTTP is loopback-only; other explicitly configured endpoints require HTTPS. Unavailable
models never fall back to Copilot.

## Endpoint credentials

Save bearer or header auth configuration first (`"auth": "header"` with `"authHeader": "api-key"` sends
the key in that header). Keys bind to the exact endpoint and stay in the profile's secret backend, never
this JSON or model context. Plain `headers` must not carry credentials; `"discovery": false` uses only
the listed model IDs.

After storing a key, inspect the endpoint discovery status before selecting a model.
