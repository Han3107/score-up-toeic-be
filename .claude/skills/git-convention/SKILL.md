---
name: git-convention
description: Apply this team's Git branch, commit, pull request, merge, and rebase conventions when planning or performing Git workflow tasks.
---

# Git Convention

Use this skill for Git workflow work in this project: creating or naming branches, writing commits, preparing pull requests, merging, rebasing, or answering questions about these conventions.

## Authorization boundaries

* Only create a commit when the user explicitly asks to commit in the current task. A request to edit, fix, implement, resolve conflicts, or prepare a PR does not authorize committing.
* Only push when the user explicitly asks to push in the current task. Prior permission to push does not carry over to later tasks or turns.
* Never merge code under any circumstances. Do not run `git merge`, `gh pr merge`, enable auto-merge, merge a pull request through an API or UI, or use cherry-pick/direct pushes to move changes into target or integration branches such as `main` or `dev`.
* If the user asks to merge, stop before the merge and tell them they must perform that action themselves. You may prepare a feature branch, resolve conflicts by rebasing it onto its base branch, and report that it is ready, subject to the separate commit and push authorization rules above.

## Branches

* Never commit directly to `main`; keep it stable.
* Use one branch per task, feature, or bug. Name it `<type>/<short-description>`.
* Allowed types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `build`, and `perf`.
* Whenever the user asks to create a branch for a new task, first fetch `origin/main`, verify the fetch succeeded, and create the new branch directly from the fetched `origin/main` commit. Never create it from a stale local `main`, the current feature branch, `dev`, or another secondary branch.
* If the latest `origin/main` cannot be fetched or verified, do not create the task branch from cached code. Report the blocker and wait until the current `main` can be obtained.
* Treat `dev` as the final integration and deployment branch: it receives stable code from `main`, rather than serving as a base for feature branches.

## Commits and pull requests

* Use Conventional Commit format: `<type>(<scope>): <description>`.
* Choose a scope that reflects the affected area, such as `auth`, `user`, `database`, `config`, `mail`, `upload`, `docker`, `deploy`, or `security`. Omit it only for genuinely broad changes.
* Keep each commit logically coherent. Never use vague messages such as `update`, `fix`, `final`, or `abc`.
* Keep one PR focused on one primary goal. Its title uses `<type>(<scope>): <summary>` and describes the whole PR, not just its final commit.
* Put internal task IDs and issue closure references in the PR description, for example `Task: TASK-004` and `Closes #15`; do not put a PR number in the title.

## Pull request integration and rebasing

* Recommend **Squash and Merge** when explaining how the user can merge a PR into `main`; never perform the merge yourself. The PR title becomes the single clean commit message on `main`.
* When a feature branch falls behind `main`, rebase it onto the latest `main` before opening or updating its PR when that is safe for collaborators.
* After rebasing an already-pushed branch, use `git push --force-with-lease`, never plain `git push --force`.
* Never update shared target branches such as `main` or `dev`. Limit changes to the feature branch and let the user perform integration.

## Safety

* Do not commit `.env`, production environment files, dependency/build output, logs, API keys, JWT secrets, database passwords, SSH private keys, or cloud credentials.
* Use `.env.example` for shareable configuration templates and leave real secrets out of the repository.