# Notifications

Technical reference for **Settings / Interface / Notifications**. The app shows a short summary;
this page keeps the full detail.

## Attention notifications

- Questions, pending approvals and completed or failed work come from the shared service state, so every
  client shows the same attention state. Reading a notification never answers or approves anything.
- OS banners start off. They respect operating-system notification permissions and Do Not Disturb. Banner
  sound is disabled to avoid duplicate alerts; Moguri's own application sounds use the Sounds controls and the
  system output volume.

## Sounds

- The "Needs attention" sound requires an actual unanswered question, a pending approval, or failed or partial
  work; it is never triggered by an inferred badge.
- The "Session completed" sound excludes stopped, failed and partial work.
- Both sounds start enabled, both while Moguri is focused and in the background. Your saved mute and focus
  choices are preserved.
- Startup and reconnect never replay old sounds.
- If a saved custom sound is unavailable, Moguri does not substitute another sound.
- Preview output depends on the system volume and output device.

## Custom sounds

- Import a mono, 16 kHz, PCM16 (16-bit) WAV file of at most ten seconds. Compressed audio is not decoded and
  nothing is converted silently.
- Moguri stores an encrypted snapshot of the sound in this profile. The snapshot is independent of sessions
  and of the original file.
- A sound that is selected for an alert cannot be removed; choose another sound first. Removing an unused
  sound deletes it from this profile's encrypted storage.
