import { apiClient } from './client'

export interface GitHubInstallation {
  id: number
  installation_id: string
  account_login: string
  account_type: string
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
  }
  private: boolean
}

export const githubAPI = {
  getInstallations: () => apiClient.get<GitHubInstallation[]>('/github/installations'),
  
  getRepositories: (installationId: string) => 
    apiClient.get<GitHubRepository[]>(`/github/installations/${installationId}/repositories`),
  
  installApp: () => {
    // GitHub App 설치 URL로 리다이렉트
    const installUrl = `https://github.com/apps/xquare-infrastructure/installations/new`
    window.open(installUrl, '_blank')
  },
}