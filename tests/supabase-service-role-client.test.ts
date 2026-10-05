import { describe, expect, it } from 'vitest'
import { Scanner } from '../packages/scanner-core/scanner.js'
import { supabaseServiceRoleClientRule } from '../packages/rules/supabase-service-role-client.js'

describe('supabaseServiceRoleClientRule', () => {
  it('flags a service-role reference in client code and redacts its value', () => {
    const scanner = new Scanner([supabaseServiceRoleClientRule])
    const findings = scanner.scan([
      {
        path: 'src/lib/supabase.ts',
        content: "const SUPABASE_SERVICE_ROLE_KEY = 'synthetic-secret-value'",
      },
    ])

    expect(findings).toHaveLength(1)
    expect(findings[0]?.severity).toBe('critical')
    expect(findings[0]?.evidence).not.toContain('synthetic-secret-value')
    expect(findings[0]?.evidence).toContain('[REDACTED]')
  })

  it('does not flag a public anon key reference', () => {
    const scanner = new Scanner([supabaseServiceRoleClientRule])
    const findings = scanner.scan([
      {
        path: 'src/lib/supabase.ts',
        content: 'const key = import.meta.env.VITE_SUPABASE_ANON_KEY',
      },
    ])

    expect(findings).toHaveLength(0)
  })

  it('does not flag a server-only service-role reference', () => {
    const scanner = new Scanner([supabaseServiceRoleClientRule])
    const findings = scanner.scan([
      {
        path: 'server/admin.ts',
        content: 'const key = process.env.SUPABASE_SERVICE_ROLE_KEY',
      },
    ])

    expect(findings).toHaveLength(0)
  })
})
