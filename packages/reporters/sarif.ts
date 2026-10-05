import type { Finding, Severity } from '../scanner-core/types.js'

const levelBySeverity: Record<Severity, 'none' | 'note' | 'warning' | 'error'> = {
  info: 'note',
  low: 'note',
  medium: 'warning',
  high: 'error',
  critical: 'error',
}

function ruleDescriptor(finding: Finding) {
  return {
    id: finding.ruleId,
    shortDescription: { text: finding.title },
    help: { text: finding.remediation },
    properties: { severity: finding.severity },
  }
}

export function createSarifReport(findings: readonly Finding[]) {
  const rules = Array.from(
    new Map(findings.map((finding) => [finding.ruleId, ruleDescriptor(finding)])).values(),
  )

  return {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: 'CodeSentryX',
            informationUri: 'https://github.com/karisajoshua/codesentryx',
            rules,
          },
        },
        results: findings.map((finding) => ({
          ruleId: finding.ruleId,
          level: levelBySeverity[finding.severity],
          message: { text: finding.title },
          locations: [
            {
              physicalLocation: {
                artifactLocation: { uri: finding.file.replaceAll('\\', '/') },
                region: finding.line ? { startLine: finding.line } : undefined,
              },
            },
          ],
          properties: {
            severity: finding.severity,
            evidence: finding.evidence,
            remediation: finding.remediation,
          },
        })),
      },
    ],
  }
}

export function formatSarifReport(findings: readonly Finding[]): string {
  return JSON.stringify(createSarifReport(findings), null, 2)
}
