import { describe, expect, it } from 'vitest'
import { Scanner } from '../packages/scanner-core/scanner.js'
import { wildcardCorsRule } from '../packages/rules/wildcard-cors.js'

describe('wildcardCorsRule', () => {
  it('reports a wildcard origin', () => {
    const scanner = new Scanner([wildcardCorsRule])
    const findings = scanner.scan([
      {
        path: 'server.ts',
        content: "const options = { origin: '*' }",
      },
    ])

    expect(findings).toHaveLength(1)
    expect(findings[0]).toMatchObject({
      ruleId: 'web/wildcard-cors',
      severity: 'medium',
      file: 'server.ts',
      line: 1,
    })
  })

  it('does not report an explicit trusted origin', () => {
    const scanner = new Scanner([wildcardCorsRule])
    const findings = scanner.scan([
      {
        path: 'server.ts',
        content: "const options = { origin: 'https://example.com' }",
      },
    ])

    expect(findings).toHaveLength(0)
  })
})
