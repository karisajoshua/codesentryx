# Hosted repository scanning

CodeSentryX treats a source-control platform as an authorized source provider, not as the scanner.

## Flow

1. The user authenticates with the source-control provider.
2. The user explicitly authorizes selected repositories.
3. A server-only integration obtains short-lived repository access.
4. The integration converts supported repository files into the CodeSentryX `SourceFile` contract.
5. `scanRepository` runs the normal CodeSentryX scanner and rules.
6. Findings are redacted before presentation or persistence.
7. Repository source is discarded after the scan by default.

The hosted scanner must not install dependencies or execute scripts from a target repository.

## GitHub permissions for v1

Use a GitHub App and start with read-only repository contents. Add pull-request/check permissions later, only when PR feedback is implemented.

Authentication identifies the user. GitHub App installation authorization determines which repositories CodeSentryX may scan. Keep those decisions separate.

## Data retention

Persist scan metadata and redacted findings, not repository source, unless a future feature has an explicit documented reason and user consent.
