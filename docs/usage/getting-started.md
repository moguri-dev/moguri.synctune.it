# Getting started

Moguri has a desktop app, an OpenTUI terminal client, a CLI, and an importable SDK. They connect to the same local service, which stores sessions and handles approvals.

This guide starts after installation. To install Moguri, follow [Installation](../../vendor/moguri/docs/installation.md). No public release has been published yet; the [download page](../../download/index.html) shows the current status. Mobile clients and IDE tools are not available.

## Requirements

| What you want to use | Requirements |
| --- | --- |
| Desktop app, TUI, and CLI | A Mac with Apple silicon and a Moguri release. There are no Intel, Linux, or Windows release builds. |
| GitHub Copilot models | A Copilot-entitled account, permission under its account policies, and network access. |
| Other hosted providers | An OpenRouter key or sign-in, an Anthropic API key, an OpenAI API key, or a ChatGPT account. See [Providers](../../vendor/moguri/docs/settings/providers.md). |
| Your own model server | An explicitly configured OpenAI-compatible endpoint and accurate model capability declarations. See [Local models](../../vendor/moguri/docs/settings/local-models.md). |
| Git and GitHub workflows | Git and, for authenticated GitHub operations, the GitHub CLI installed and signed in by you. |
| Remote execution | A host you control with the matching Moguri build, an independently verified host key, and an explicit workspace mapping. See [Remote SSH](../../vendor/moguri/docs/settings/remote-ssh.md). |
| Sandbox | Apple-silicon macOS and the separately reviewed SendBox setup, which installs its own pinned runtime. See [Sandbox](../../vendor/moguri/docs/settings/sandbox.md). |

Installing the app does not select a model, sign you in, download model weights, or grant tools permission.

Contributors with access to the source repository build from source instead; see [Development setup](../../vendor/moguri/docs/development.md).

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

In the desktop app, choose **Sign in** under **Settings / Models / Providers / GitHub Copilot**. In the TUI, press Ctrl+L or run `/connect`.

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
