# CI and bot integrations

This document describes **GitHub Actions workflows in this repository** and how they relate to day-to-day development. It is derived from the workflow files under [`.github/workflows`](../../.github/workflows).

## QA Tests (`qa-tests.yml`)

**Purpose:** Build and run automated tests (C# and Angular) and Playwright E2E tiers on a schedule and on selected branches.

| Item | Details |
|------|---------|
| **File** | [`.github/workflows/qa-tests.yml`](../../.github/workflows/qa-tests.yml) |
| **Triggers** | Push to `main`, `dev-deploy`, `QA-Tests`; pull requests targeting `main` or `dev-deploy`; nightly cron (`0 2 * * *` UTC); manual `workflow_dispatch` with Playwright tier choice |
| **.NET SDK** | `9.0.x` (`DOTNET_VERSION`) |
| **Node.js** | `20` (`NODE_VERSION`) |
| **Checkout** | Uses `submodules: recursive` and initializes the `UNOPS.Workflow` submodule |

**Operational note:** If CI fails on checkout or submodule steps, ensure submodules are initialized locally (`git submodule update --init --recursive`) and that any required tokens for private submodules match your environment (see the workflow’s `actions/checkout` configuration).

## Gemini AI Assistant (`gemini-dispatch.yml`)

**Purpose:** Route GitHub events to the organization’s reusable **Gemini** workflow for AI-assisted review and commands (e.g. comment-driven invocations on PRs and issues).

| Item | Details |
|------|---------|
| **File** | [`.github/workflows/gemini-dispatch.yml`](../../.github/workflows/gemini-dispatch.yml) |
| **Reusable workflow** | `UNOPS-ITG/.github/.github/workflows/gemini-dispatch.yaml@fix/gemini-dispatch-and-cli-config` |
| **Triggers** | `issue_comment` (created), `pull_request_review_comment` (created), `pull_request_review` (submitted), `pull_request` (opened, synchronize) |
| **Permissions passed to callee** | `contents: read`, `id-token: write`, `issues: write`, `pull-requests: write` |
| **Secrets** | `inherit` (repository/organization secrets as configured in GitHub) |

**Constraint:** Behavior of the *called* workflow (exact commands, CLI version, and required secrets) lives in the `UNOPS-ITG/.github` repository, not in this app’s source tree. Update the pin (`@branch-or-sha`) in `gemini-dispatch.yml` when the org standardizes a new reusable version.

## Related documentation

- [BACKEND_TESTING_GUIDE.md](./BACKEND_TESTING_GUIDE.md) — backend test practices in this repo
- [README.md](../../README.md) — local setup; use the same .NET/Node major versions as CI where possible
