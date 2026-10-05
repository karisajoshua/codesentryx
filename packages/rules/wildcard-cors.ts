import type { Finding, Rule, ScanContext } from '../scanner-core/types.js'

const wildcardCorsPatterns = [
  /access-control-allow-origin\s*[:=]\s*['"`]\*['"`]/i,
  /origin\s*:\s*['"`]\*['"`]/i,
  /cors\s*\(\s*\{[^}]*origin\s*:\s*['"`]\*['"`]/is,
]

export const wildcardCorsRule: Rule = {
  id: 'web/wildcard-cors',
  description: 'Detect permissive wildcard CORS configuration.',
  severity: 'medium',

  scan(context: ScanContext): readonly Finding[] {
    const findings: Finding[] = []

    for (const file of context.files) {
      const lines = file.content.split('\n')

      lines.forEach((line, index) => {
        if (!wildcardCorsPatterns.some((pattern) => pattern.test(line))) return

        findings.push({
          ruleId: this.id,
          title: 'Wildcard CORS origin detected',
          severity: this.severity,
          file: file.path,
          line: index + 1,
          evidence: line.trim().slice(0, 160),
          remediation:
            'Restrict CORS to explicitly trusted origins and validate environment-specific origin configuration.',
        })
      })
    }

    return findings
  },
}
