# CodeSentryX

> Extensible repository security and code-quality intelligence for GitHub.

CodeSentryX is an open-source TypeScript platform for scanning repositories for risky configuration, exposed secrets, weak authorization patterns, insecure API practices, and maintainability problems. Its rule engine is intentionally modular so contributors can add a useful detector without understanding the whole system.

## Why CodeSentryX?

Security tooling is often either too generic or too difficult to extend. CodeSentryX aims to make repository analysis approachable:

- **Composable rules** — each detector implements one small contract.
- **Explainable findings** — every finding includes evidence, severity, and remediation guidance.
- **GitHub-native roadmap** — PR checks, issue triage, and bot workflows are first-class goals.
- **Contributor-friendly architecture** — starter issues can be implemented independently.
- **Safe by design** — scanners report risks; they do not exploit targets or expose discovered secrets.

## Initial rule set

The first milestone focuses on static repository checks:

- wildcard CORS configuration
- Supabase service-role keys referenced from client code
- likely secrets committed to source
- unsafe browser-supplied authorization identifiers
- missing webhook signature verification

## Architecture

```text
CodeSentryX
├── packages/
│   ├── scanner-core/      # Rule contracts, findings, scan orchestration
│   └── rules/             # Built-in security and quality rules
├── apps/
│   └── cli/               # Local/CI scanner interface
├── bots/
│   └── github/            # GitHub App / PR feedback integration (roadmap)
└── docs/                  # Rule authoring and architecture documentation
```

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), then choose an issue marked `good first issue` or `help wanted`.

A good first contribution is usually a new rule: add a detector, fixtures, tests, and remediation guidance.

## Project status

**Early development.** The scanner contract and contributor foundation are being established first. Interfaces may change before the first stable release.

## Security

Please do not open public issues containing real credentials, private source code, or exploitable details about systems you do not own. See [SECURITY.md](SECURITY.md).

## License

Apache-2.0. See [LICENSE](LICENSE).
