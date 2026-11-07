# Getting started

Moguri has a desktop app, an OpenTUI terminal client, a CLI, and an importable SDK. They connect to the same local service, which stores sessions and handles approvals.

There is no public installer or npm-registry package linked from this site yet. These instructions apply to a trusted development app, a source checkout, or a packed SDK archive supplied by the project maintainer. Mobile clients and IDE tools are not installation options here.

## Requirements

| What you want to use | Requirements |
| --- | --- |
| Desktop app | A matching development app for your platform. The current native delivery is a macOS alpha. |
| Source checkout or SDK consumer | Node 26.4 or newer within Node 26, npm, and platform-compatible native dependencies. |
| GitHub Copilot models | A Copilot-entitled account, permission under its account policies, and network access. |
| Your own model server | An explicitly configured OpenAI-compatible endpoint and accurate model capability declarations. |
| Git and GitHub workflows | Git and, for authenticated GitHub operations, the GitHub CLI installed and signed in by you. |
| Remote execution | A host you control with the matching packed Moguri worker, compatible Node, an independently verified host key, and an explicit workspace mapping. |
| Managed Sandbox | Supported Apple-silicon macOS, the required Apple Containerization runtime, and separately reviewed, qualified SendBox setup. |

Installing an app or SDK does not select a model, sign you in, download model weights, or grant tools permission.

## Desktop app

If you receive a trusted DMG, mount it and drag `Moguri.app` to the Applications shortcut. Open the installed copy yourself. Running the app directly from the mounted image is not the managed installation.

1. Open **Settings / Models / Providers**.
2. Sign in to GitHub Copilot, or configure an OpenAI-compatible endpoint.
3. Create a project or a project-free chat.
4. Select a model in the composer.
5. Check Env, Autonomy, and Budget before sending.

The native app is still an alpha. Integrity checks and ad-hoc signing are not Apple notarization. Get a corrected matching build when installation fails rather than disabling OS protections globally.

## Build a source checkout

Obtain source access from the maintainer. Run these commands from the Moguri source root, not from the website repository:

```sh
npm ci
npm run build
npm start
```

`npm start` opens the TUI. To open the development desktop app instead:

```sh
npm run desktop
```

For a one-shot CLI command without opening either UI:

```sh
npm run cli -- status
node bin/moguri.mjs --help
```

The source installation has native setup steps. Do not use the website's `--ignore-scripts` installation recipe for an operational Moguri CLI. If your npm installation uses a script allowlist, review the pending steps and approve only the required Moguri, pinned Node, and native-helper steps.

Rebuild after changing source. An already running service does not silently replace itself with the new code. Restart through the matching build when required:

```sh
node bin/moguri.mjs service restart
```

Restart interrupts active model and tool work. Saved drafts, unclaimed queues, history, and original receipts remain. See [troubleshooting](troubleshooting.md#startup-and-version-mismatches) before restarting an unhealthy or unconfirmed owner.

## Install the terminal command

A packaged macOS app includes the CLI, TUI, and pinned Node runtime. It does not add `moguri` to your shell automatically.

1. Open the installed app.
2. Choose **Settings / General / Command line / Install moguri command**.
3. Review the destination, then install the managed launcher.
4. Add `~/.local/bin` to the PATH used by your own shell.

For the current shell:

```sh
export PATH="$HOME/.local/bin:$PATH"
command -v moguri
moguri --help
```

Use your shell's normal configuration process to make the PATH change persistent. The app does not edit shell startup files.

The installer refuses existing files, symlinks, and unsafe parent directories. Inspect a collision instead of overwriting it. Moving the app changes the launcher's target. Remove the unchanged managed command through the actual app, then install it again from the new location.

## Connect GitHub Copilot

In the desktop app, choose **Sign in** under **Settings / Models / Providers / GitHub Copilot**. In the TUI, run `/connect`.

Open the displayed GitHub authorization URL yourself and enter the one-time code. The flow can enable eligible account model policies, which Moguri discloses before authorization. It does not use credentials from another editor, `gh`, or the Copilot CLI.

Credentials stay in the OS keychain for the selected profile. A missing keychain is an error, not a plaintext fallback. New profiles start disconnected.

After authorization, select a model explicitly. Login alone does not choose one. Available models depend on the account and provider adapter. Moguri is not an official GitHub client partnership.

For local or hosted OpenAI-compatible endpoints, follow [model setup](models.md#connect-an-openai-compatible-server).

## Start your first project session

1. Use **New** to open an existing repository or choose **Clone repository** and a new destination.
2. Review the repository and folder. Moguri does not overwrite an existing destination.
3. Start a session in that project.
4. Choose an available model.
5. Leave Env as Local and Autonomy as Manual unless you want a different reviewed setup.
6. Write a specific request and use Send.

From a working CLI installation:

```sh
moguri project add /absolute/path/demo-app
moguri status
moguri session create --project PROJECT_ID
```

`PROJECT_ID` is the ID shown by `moguri status`. Uppercase IDs, digests, revisions, and file paths in these docs are values you must replace with the actual values returned by your build.

To open the TUI on a local project:

```sh
moguri --project /absolute/path/demo-app
```

New factory sessions use Local execution, no selected model, Manual autonomy, and an Unlimited budget. Saved global, profile, or project settings can change those values.

## Start without a project

Choose a project-free chat, or run:

```sh
moguri session create
```

A Local project-free chat captures its Home boundary for approved tools. It does not create a repository or adopt a previous project's workspace. Remote project-free chats have no project filesystem root.

Do not assume project-free means tool-free. Check [permissions and execution](execution.md), and use read-only mode when you want an answer without writes or execution.

## Understand the first tool request

Manual and Guided factory policy allows covered native file reads, searches, data queries, and edits without a permission card. Stricter ask or deny rules still apply.

Shell commands and external MCP calls need approval or a remembered grant in Manual and Guided. Read the exact command or tool arguments before approving. A tool named "read" is not automatically safe.

Selecting a model does not grant permissions. Choosing SSH does not provide sandbox containment. Switching profiles does not bypass global restrictions.

Continue with [projects and sessions](sessions.md), [models and budgets](models.md), or the [CLI reference](cli.md).
