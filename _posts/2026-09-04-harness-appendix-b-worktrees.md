---
layout: post
title: "Appendix B: Worktrees and Isolation"
date: 2026-09-04
description: "Giving parallel agents separate copies of the world with git worktrees and isolation."
tags: [agentic-ai, LLM, harness-engineering-101]
categories: [harness-engineering-101]
giscus_comments: false
related_posts: false
---

_Harness Engineering 101, Appendix - Advanced Topics.
[Series index](/blog/2026/harness-engineering-101/)_

---

Chapter 7 gave each subagent its own _array_. That isolates their
attention. It does not isolate their _world_: every agent still reads and
writes the same directory. The moment you run two agents concurrently on
the same project (a fan-out of fixers, or just the main loop plus a
background child), you have reinvented the race condition. Agent A edits
`utils.py` while agent B is mid-refactor of the same file; B's
read-before-write guard (chapter 13) starts firing constantly, or worse,
doesn't, and the merge of their work happens by accident, in place, with
no record.

The fix is the same one operating systems and CI systems reached: **give
each worker its own copy of the world, and merge deliberately.**

## Git worktrees: cheap parallel worlds

For coding agents the mechanism already exists in git. A **worktree**
(`git worktree add ../task-a branch-a`) is an additional checkout of the
same repository in another directory, sharing the object store: creating
one is fast and cheap, unlike a full clone. Each agent gets:

- its own directory (no file-level races),
- its own branch (its work is a named, reviewable, revertable unit),
- the shared history (chapter 13's recoverability, per agent).

The harness pattern: when spawning an agent whose task is "make changes"
(rather than "look things up"), create a worktree, point the child's tools
at that directory as their root, and record the branch. When the child
reports done, the _merge_ is a first-class step: show the human a diff, or
run tests, then `git merge` / rebase, then remove the worktree. If the
child failed or went sideways, removal is the whole cleanup: the main tree
never saw a byte of the mess. An unchanged worktree can be deleted
automatically; a changed one is evidence.

Claude Code exposes exactly this as an option on its Agent tool and as
`EnterWorktree` for the main session; One Code implements the same. The
noteworthy design choice in both: isolation is _opt-in per task_, because
worktrees have a cost (below), and read-only errands don't need them.

## What worktrees don't isolate

A worktree fences the _files under version control_, and nothing else.
The remaining shared surfaces, in the order they will bite you:

- **Untracked state**: `node_modules`, build caches, `.env` files.
  A fresh worktree has none of them, so the child's first `npm test`
  fails mysteriously, or spends ten minutes reinstalling. Harnesses
  handle this with setup hooks (chapter 11) or by copying/symlinking
  known state; you must decide per project, which is why "isolation:
  worktree" sometimes disappoints people expecting magic.
- **Global mutable state**: databases, docker daemons, package caches,
  the network. Two agents "isolated" in worktrees can still fight over
  port 3000 or the same test database. Worktrees isolate the _code_, not
  the _runtime_.
- **The machine itself.** For that, you are back to chapter 13's
  sandboxes: containers or VMs per agent, of which a worktree is the
  lightweight, code-only special case. The spectrum is: same directory
  (free, unsafe) → worktree (cheap, code-isolated) → container (heavier,
  runtime-isolated) → VM (heaviest, machine-isolated). Pick per task
  risk, and remember the spectrum composes: a worktree _inside_ a
  container is a perfectly sensible rung.

## The non-coding version

The pattern generalizes past git, and it is worth stating because it is
the actual principle: **agents should work on transactions, not on the
live world.** A draft email, not the send button. A staging table, not
production. A proposed diff, not an applied one. The worktree is just the
coding domain's excellent built-in transaction. When you build a harness
for a domain without one, building the "propose, review, commit" seam is
some of the highest-leverage safety work available (chapter 13's blast
radius, implemented as workflow rather than walls).

## What to remember

Context isolation (chapter 7) and world isolation are separate axes; you
need the second the moment writers run in parallel. Git worktrees are the
cheap, natural unit for code: directory + branch per agent, deliberate
merge, trivial cleanup. They do not isolate runtime or untracked state,
and they are one rung on a spectrum that ends at VMs. The principle
underneath is transactions: let agents propose in private, and make
integration a visible, human-gateable step.

_[Series index](/blog/2026/harness-engineering-101/)_
