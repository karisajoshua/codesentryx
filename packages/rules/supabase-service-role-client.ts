import type { Finding, Rule, ScanContext } from '../scanner-core/types.js'

const clientFilePattern = /(?:^|\/)(?:src|app|pages|components|client)(?:\/|$)/i
const serviceRoleReference = /(?:SUPABASE_SERVICE_ROLE_KEY|service[_-]?role)/i

function redact(line: string): string {
  return line
    .replace(/(SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['"`]?)[^'"`\s,;]+/gi, '$1[REDACTED]')
    .replace(/(service[_-]?role\s*[:=]\s*['"`]?)[^'"`\s,;]+/gi, '$1[REDACTED]')
    .slice(0, 180)
}

export const supabaseServiceRoleClientRule: Rule = {
  id: 'supabase/service-role-in-client',
  description: 'Detect likely Supabase service-role credentials referenced from client-side code.',
  severity: 'critical',

  scan(context: ScanContext): readonly Finding[] {
    const findings: Finding[] = []

    for (const file of context.files) {
      if (!clientFilePattern.test(file.path)) continue

      file.content.split('\n').forEach((line, index) => {
        if (!serviceRoleReference.test(line)) return

        findings.push({
          ruleId: this.id,
          title: 'Supabase service-role credential referenced from client code',
          severity: this.severity,
          file: file.path,
          line: index + 1,
          evidence: redact(line.trim()),
          remediation:
            'Keep the Supabase service-role key server-side only. Perform privileged operations in a trusted server or edge function and authorize the caller there.',
        })
      })
    }

    return findings
  },
}
