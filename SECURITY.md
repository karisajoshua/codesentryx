# Security Policy

## Reporting a vulnerability

Do **not** disclose exploitable vulnerabilities, credentials, tokens, or private source code in a public issue.

For vulnerabilities in CodeSentryX itself, use GitHub's private vulnerability reporting feature when available. If private reporting is unavailable, contact the maintainer privately before publishing technical details.

## Scanner safety

CodeSentryX is intended for defensive analysis of repositories you own or are authorized to assess.

Rules and contributions must not:

- exfiltrate discovered secrets;
- automatically exploit identified weaknesses;
- transmit scanned source code to third parties without explicit user action;
- print complete credentials in findings or logs.

Findings should redact sensitive evidence and provide remediation guidance.
