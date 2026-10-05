# Contributing to CodeSentryX

Thanks for helping build CodeSentryX.

## Ways to contribute

- Add a security or code-quality rule.
- Improve rule precision and test fixtures.
- Build CLI output/reporters.
- Improve GitHub integration.
- Improve documentation and developer experience.

## Claiming work

Before starting substantial work, comment `/attempt` on the issue. A maintainer can then confirm the assignment. This avoids duplicate implementations.

## Development

Requirements: Node.js 22+ and pnpm 10+.

```bash
pnpm install
pnpm check
pnpm test
```

Create a branch from `main`:

```bash
git checkout -b feat/short-description
```

Use Conventional Commits, for example:

```text
feat(rules): detect exposed Supabase service role keys
fix(scanner): preserve finding line numbers
test(rules): add CORS fixtures
docs: explain rule authoring
```

## Adding a rule

A rule must:

1. implement the `Rule` contract;
2. have a stable namespaced ID;
3. return actionable findings without leaking full secrets;
4. include tests for positive and negative cases;
5. document remediation clearly;
6. avoid network calls unless the rule explicitly requires them.

Security detectors should prefer false negatives over noisy, unbounded matching when a precise signal is available.

## Pull requests

Keep PRs focused. Explain what changed, why, how it was tested, and any known limitations. Link the issue with `Fixes #<number>` when appropriate.

Never include real credentials, private repository content, or third-party secrets in tests. Use synthetic fixtures only.
