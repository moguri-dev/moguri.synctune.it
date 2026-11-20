# Context compaction

Technical reference for **Settings / Sessions / Context compaction**. The app shows a short summary;
this page keeps the full detail. The contract is in
[context compaction](../architecture/context-compaction.md#smart-compaction-default).

## Compact long chats automatically

On by default (D31 revision, protocol 110). Every choice on this page saves as soon as it changes.
When a chat's estimated request reaches the start point, Moguri summarizes older complete turns with
that chat's own model in one separately metered call and continues with the summary. A transcript
notice marks each summary. Off keeps original context until normal admission refuses a request that
no longer fits; Moguri never truncates history.

Kupo chats follow this switch unless the Kupo page saves its own policy.

## Start compacting at

A share of the model's working window (50% to 90%, default 75%). Moguri also starts an eighth of the
window before the 4,096-token admission headroom, so small windows compact before a request would fail.

## Token ceiling

Start by this many tokens even on larger windows (default 200,000), or **No ceiling**. Long sessions
cost less when compacted near 200k on current frontier models.

## Keep recent turns

Complete recent turns that are never summarized (default 2).

## Summary length

The summary's output bound (default 4,096 tokens), further limited by the model and to an eighth of
the working window. Moguri skips automatic compaction while the older turns are smaller than an
eighth of the window or twice this bound, because a summary could not make the request smaller.

## Failures and recovery

A summary is applied only when it is complete, metered and smaller. If it fails or its usage is not
reported, the turn stops with the reason, original context stays active and usage stays held. Send
again to continue; Moguri waits for the chat to grow by a quarter of the window before trying
automatically again. `/compact` compacts now and `/compact restore` brings the original history back.
