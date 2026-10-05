export interface GitHubRepository {
  owner: string
  name: string
  fullName: string
  defaultBranch: string
  private: boolean
}

export interface GitHubSourceFile {
  path: string
  content: string
}

export interface RepositorySourceProvider {
  getRepository(owner: string, name: string): Promise<GitHubRepository>
  listSourceFiles(repository: GitHubRepository): Promise<readonly GitHubSourceFile[]>
}
