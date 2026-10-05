# GitHub Code Scanning

CodeSentryX can emit SARIF 2.1.0 so findings can be consumed by systems that support SARIF, including GitHub Code Scanning.

## Generate SARIF

```bash
codesentryx scan . --sarif > codesentryx.sarif
```

The SARIF report includes:

- stable CodeSentryX rule IDs;
- GitHub-compatible repository-relative paths;
- source line locations when available;
- severity mapped to SARIF levels;
- remediation and safely redacted evidence.

## GitHub Actions integration

A repository can run CodeSentryX and then upload `codesentryx.sarif` using GitHub's official CodeQL SARIF upload action.

Keep the scan and upload as separate steps. This preserves CodeSentryX's portability: the scanner does not require GitHub credentials and does not upload source code itself.

> Note: availability and permissions for Code Scanning/SARIF upload depend on the target repository and its GitHub plan/settings.

## Security

Do not add raw secrets to SARIF evidence. CodeSentryX rules are expected to redact sensitive values before a finding reaches any reporter.
