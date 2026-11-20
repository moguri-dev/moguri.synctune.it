# Knowledge tiers

Technical reference for **Settings / Knowledge tiers**. The app shows a short summary;
this page keeps the full detail.

## Sky, Terra, Glacier

- Sky expires with its actual turn or session. Terra retains project or work-item knowledge. Glacier holds explicitly reviewed compressed knowledge across the profile.
- None of the tiers grants tools, runs a model, or self-promotes.
- Tiered context injection (shown as "Notes in model context") is a separate opt-in in Repository memory. Selection is bounded and deterministic lexical matching, not a claim of semantic understanding.
- Saving a note calls no model and changes no other tier.
- Glacier notes are created only by reviewing and compressing an exact Sky or Terra source. Existing Glacier revisions can be reviewed, rolled back or forgotten, never silently re-attributed.
- Rollback must name retained bytes of an earlier revision; it creates a new revision and history is not rewritten.
- Promotion creates a copy with independent retention; the original source is unchanged.
- Forgetting revokes the note's encryption compartment for the note and all its retained revisions. Independent promoted copies are not deleted. This is not a claim of physical disk reclamation.
- Each note shows its original owner (session, project or profile) and SHA-256 content digest.
- Contract: `docs/architecture/platform-workflows.md` (Sky, Terra and Glacier).
