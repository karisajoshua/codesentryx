import { describe, expect, it } from 'vitest'
import { scanRepository } from '../packages/scanner-core/repository-scan.js'
import { wildcardCorsRule } from '../packages/rules/index.js'
import type { RepositorySourceProvider } from '../packages/github/types.js'

describe('scanRepository', () => {
  it('scans source supplied by an authorized provider', async () => {
    const provider: RepositorySourceProvider = {
      async getRepository(owner, name) {
        return { owner, name, fullName: `${owner}/${name}`, defaultBranch: 'main', private: true }
      },
      async listSourceFiles() {
        return [{ path: 'server.ts', content: "const cors = { origin: '*' }" }]
      },
    }

    const result = await scanRepository(provider, [wildcardCorsRule], 'acme', 'private-app')
    expect(result.repository).toBe('acme/private-app')
    expect(result.findings).toHaveLength(1)
  })
})
