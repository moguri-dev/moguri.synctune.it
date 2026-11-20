# Voice dictation

Technical reference for **Settings / Interface / Voice dictation**. The app shows a short summary;
this page keeps the full detail.

## Local voice dictation (page help)

Native NVIDIA Nemotron 3.5 ASR. Download the model once yourself; audio never goes to an ASR cloud or the
Copilot provider.

## Use a model you already have

Reuse a streaming model you already have, such as Nemotron streaming (NeMo-Speech GGUF) or Handy's
Parakeet and Moonshine streaming models (transcribe.cpp GGUF). Whisper can't stream, so it isn't
accepted. Moguri hashes the file once for your approval, locks that SHA-256, asks again if the file ever
changes, and never moves or deletes it.

- **Model file or folder:** type a path (absolute or starting with `~/`) and click **Review**, or use
  **Choose…**. A file goes straight to review; a folder lists the speech models in it.
- **Find installed models:** searches, only when clicked, Handy's model folder
  (`~/Library/Application Support/com.pais.handy/models`) and the Hugging Face cache (`~/.cache/huggingface`,
  honoring `HF_HOME`, `HF_HUB_CACHE` and `HUGGINGFACE_HUB_CACHE`). Results are not saved.
- Each result is classified from its GGUF header: **Streaming** (the header says it streams), **Checked on
  review** (a speech model whose streaming support the review confirms) or **Can't stream** (Whisper,
  offline NeMo models), with the reason. Non-speech GGUFs, such as language models, are counted and skipped.
- The search never follows folder links, skips hidden folders, partial downloads and Hugging Face `blobs`/`refs`,
  deduplicates snapshot links, and stops after 6 folder levels, 50,000 entries, 300 model files or 10 seconds.
- The approach follows `mbianchidev/flAI-on-the-wall` (Handy and Hugging Face cache roots, header-based ASR
  architecture list), restricted to models that can stream live dictation.

## Enable voice dictation

Disable closes this profile's owned voice work and deletes the sole Moguri-managed model. Enable
downloads that pinned model again. The official model file is shared across profiles; external model
files and other profiles' running work are never deleted or cancelled.

## Prepare microphone while a composer is focused

Explicit standby consent opens the selected microphone only in the focused composer, without recording,
if OS access is already granted. Focusing a chat never asks for microphone permission; activate
dictation or Find microphones to authorize access first. The microphone icon marks readiness without
adding a notice to every chat. Focus loss, switching owner or profile, sleep or disable closes it.
Dictation is enabled by default, but no microphone opens and no weights download until their explicit
actions; unavailable models do not start preparation jobs.

## Microphone and activation

Device discovery is explicit and briefly opens audio solely to read permitted microphone labels, then
stops it. Recording uses exact device selection and browser-normalized local 16-kHz PCM, never an
ignored native CLI device flag.

Microphone access is user-initiated and may require OS permission. Recording is bounded to two minutes.
A conflicting draft is preserved rather than overwritten.

A saved device that has not been rediscovered shows "Saved device; find microphones to check it"
(previously "Saved device; refresh to verify availability").

## Dictation controls

Ctrl+Space defaults to held push-to-talk, independently of the microphone button. Release finishes the
recording; releasing before capture starts discards that pending capture. Uncheck Hold only to
explicitly choose shortcut toggle mode. Both stream words into the owning composer without sending a
message. Native/TUI capture supports the Default device only and explicitly rejects a selected desktop
device.

## Language

With an external model: the language choice applies to the managed Nemotron model; your external model
uses its own language handling. With the managed model: NVIDIA documents 40 locales: 19 ready, 13 broad
coverage, 8 adaptation-only. The adaptation-only group needs fine-tuning and is not advertised as ready
(those options are disabled).
