# Subagents

Technical reference for **Settings / Subagents**. The app shows a short summary;
this page keeps the full detail.

## Optional subagents (page help)

Off by default. When enabled, a depth-one child (it cannot start its own subagents) uses the same fixed
model and approved context. It is read-only and tool-less, has separate usage, and belongs to the same
cancellation tree as its parent chat. The switch was previously labeled "Enable optional read-only
subagents".
