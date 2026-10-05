import type { Finding, Rule } from './types.js'
import { Scanner } from './scanner.js'
import type { RepositorySourceProvider } from '../github/types.js'

export interface RepositoryScanResult {
  repository: string
  findings: readonly Finding[]
}

export async function scanRepository(
  provider: RepositorySourceProvider,
  rules: readonly Rule[],
  owner: string,
  name: string,
): Promise<RepositoryScanResult> {
  const repository = await provider.getRepository(owner, name)
  const files = await provider.listSourceFiles(repository)
  const findings = new Scanner(rules).scan(files)

  return { repository: repository.fullName, findings }
}
