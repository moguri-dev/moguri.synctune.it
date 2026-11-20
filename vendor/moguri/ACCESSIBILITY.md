# Accessibility

Moguri should be usable with a keyboard, a screen reader, high contrast and
reduced motion. This page states the standards contributors follow, how they
are checked, and the known gaps. It is a contribution target, not a claim of
certification or a completed audit.

## Standards

- **Desktop app:** the React renderer targets
  [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA. As an Electron app, it
  should also work with macOS accessibility features: VoiceOver, Full Keyboard
  Access, Increase Contrast, Reduce Motion and display zoom.
- **Terminal UI and CLI:** every action is keyboard-driven. Information is
  never conveyed by color alone, and errors are written as readable text with a
  non-zero exit code where applicable.
- **Documentation:** descriptive link text, alt text for images and code
  blocks for commands.

## Practices

The [design rules](docs/design.md) are the detailed reference. In short:

- Use semantic elements and native controls. Every icon button has an
  accessible name that matches its tooltip.
- Keep focus visible with the shared `:focus-visible` ring. Dialogs move
  focus into their first field, and Escape returns focus to the trigger.
- Announce errors with `role="alert"` and keep status meaning in text, not
  only in color. Status tokens are never the only signal.
- Meet contrast for every theme preset in Dark and Light. Measured minimums
  are 11.03:1 for body text, 5.82:1 for secondary text and 3.08:1 for the focus
  ring and status dots.
- Honor `prefers-reduced-motion`: it disables transitions and every infinite
  animation.
- Use the token target sizes: 32px controls, and 44px for coarse pointers.
- Let content reflow at narrow widths and large zoom instead of clipping.

## Checks

- **Automated:** `tests/design-tokens.test.ts` checks WCAG contrast for every
  palette in Dark and Light, and that components use the shared tokens. The
  hidden Playwright suites (`npm run test:e2e`) find controls by role and
  accessible name, so missing names fail tests.
- **Manual:** for UI changes, check keyboard-only navigation, VoiceOver
  announcements for new controls and alerts, Increase Contrast, Reduce Motion
  and 200% zoom. Mention what you checked in your pull request.

## Known limitations

- No formal accessibility audit has been performed. App-wide verification is
  tracked in [#77](https://github.com/mbianchidev/moguri/issues/77).
- The embedded terminal renders to a canvas through Ghostty, so screen readers
  cannot read terminal output directly.
- The TUI's accessibility depends on your terminal emulator's screen reader
  support.

## Reporting a barrier

Open an [issue](https://github.com/mbianchidev/moguri/issues) that describes
the barrier, the assistive technology and macOS version you use, and the
steps to reach it. Accessibility bugs are treated as bugs, not enhancements.
