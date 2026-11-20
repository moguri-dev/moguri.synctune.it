# Installing, upgrading and removing Moguri

Moguri is a macOS alpha for Apple silicon (arm64). Release builds are ad-hoc
signed and **not notarized**: they are not Developer ID signed production
releases. To build from source instead, see [development](development.md).

## Requirements

- A Mac with Apple silicon. There are no Intel or Linux release builds.
- An account with a supported model provider, or a configured local model.
  See [providers](settings/providers.md).
- Optional: the **Sandbox** environment installs the pinned SendBox runtime
  through its own reviewed setup; see [Sandbox](settings/sandbox.md). The
  **Remote** environment needs an SSH machine you configure; see
  [Remote SSH](settings/remote-ssh.md).

## Install from a release

1. Open the repository's GitHub **Releases** page and download
   `Moguri-<version>-macos-arm64.dmg` and `SHA256SUMS` from the same release.
2. In the folder that contains both files, verify the download:

   ```sh
   shasum -a 256 --check --ignore-missing SHA256SUMS
   ```

   It must print `OK` for the DMG. Do not open a file that fails this check.
3. Open the DMG and drag **Moguri** onto **Applications**.
4. Open Moguri from Applications. Because the build is not notarized, macOS
   blocks the first launch. If, and only if, you verified the checksum above:
   open **System Settings > Privacy & Security**, scroll down, click
   **Open Anyway**, then confirm **Open**. This follows
   [Apple's guidance for apps that are not notarized](https://support.apple.com/en-us/102445)
   and saves an exception for this app only.

Each release also publishes `Moguri-<version>-provenance.json`, which records
the exact source commit, and the updater's integrity manifest. The
[release process](releasing.md) explains what those prove.

### macOS launch troubleshooting

If macOS reports the app as damaged instead of offering **Open Anyway**, the
download quarantine is usually the cause for these ad-hoc-signed builds.
Moguri provides ad-hoc-signed macOS alpha builds, not notarized production
releases. These steps apply only to a trusted `.app` whose source and
integrity you have verified with `SHA256SUMS`, if Gatekeeper blocks its first
launch because of download quarantine.

Move that verified `.app` bundle into `/Applications` first. The qualified
bundle is named `Moguri.app`; if your separately verified build uses a different
name, substitute its actual bundle name:

```sh
xattr -dr com.apple.quarantine "/Applications/Moguri.app"
```

Then reopen the app yourself from Applications. This removes quarantine
recursively from this app only; it does not verify, sign or notarize it.
Never use this for untrusted downloads or to bypass malware warnings, and do
not disable Gatekeeper globally.

## First use

1. Sign in to a provider. In the desktop app, open **Settings > Models >
   Providers**; in the TUI, press **Ctrl+L** for GitHub Copilot sign-in.
   Complete the provider's own authorization yourself.
2. Pick a model. The composer shows **Env**, **Model**, **Autonomy level** and
   **Budget**. Defaults are Local, no model until you sign in or configure a
   local model, Manual and Unlimited.
3. Add a project, or start a project-free chat, and send a prompt. With
   Manual autonomy, Moguri asks before running commands or editing files.

The [setup guide](setup.md) covers every workflow in depth, and the
[Settings reference](settings/README.md) documents each setting.

## Command line tool

The app bundles the `moguri` CLI and TUI, but does not add them to your PATH.
Open the app and choose **Settings > General > Command line > Install
`moguri` command**, then follow
[the PATH instructions](setup.md#macos-command-line-installation).

## Upgrade

- **In the app:** by default Moguri checks the upstream GitHub releases at
  startup and every four hours, verifies the ZIP against the release's
  integrity manifest and stages it. You review and confirm the install and
  restart. Public releases need no token. While the repository is private, or
  to raise GitHub's rate limit, save a read-only token under **Settings >
  General > GitHub updates**; see
  [General settings](settings/general.md#github-updates). Turn off
  **Check for and download updates automatically** in the same page to check
  only on demand.
- **Manually:** quit Moguri, verify and open the new DMG, and drag Moguri onto
  Applications to replace the old app.

Moguri migrates its local state forward on first start. Migrations are
one-way: an older Moguri refuses newer state rather than deleting it, so you
cannot downgrade after running a newer version.

## Where your data lives

Moguri stores its encrypted state in `~/Library/Application Support/Moguri`,
or in `MOGURI_STATE_DIR` if you set it. Credentials live in the macOS Keychain.
See [state, policy and diagnostics](setup.md#state-policy-and-diagnostics).

## Remove Moguri

1. If you installed the command line tool, use **Settings > General > Command
   line > Remove `moguri` command** first. It removes only the unchanged
   launcher it created, not the PATH line in your shell startup file.
2. Quit Moguri and move `Moguri.app` from Applications to the Trash.

Removing the app keeps your state directory and Keychain entries, so a later
reinstall picks up where you left off. Delete them only if you intend to
discard your sessions, artifacts and saved credentials.
