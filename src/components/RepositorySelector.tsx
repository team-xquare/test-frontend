import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { githubAPI, GitHubRepository, GitHubInstallation } from '../api/github'

interface RepositorySelectorProps {
  installation: GitHubInstallation | null
  onRepositorySelect: (repository: GitHubRepository) => void
  selectedRepository: GitHubRepository | null
}

export default function RepositorySelector({ 
  installation, 
  onRepositorySelect, 
  selectedRepository 
}: RepositorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { data: repositories, isLoading } = useQuery({
    queryKey: ['repositories', installation?.installation_id],
    queryFn: () => githubAPI.getRepositories(installation!.installation_id).then(res => res.data),
    enabled: !!installation,
  })

  if (!installation) {
    return (
      <div className="text-sm text-primary-500">
        먼저 GitHub App을 연결해주세요.
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full text-left flex justify-between items-center"
      >
        <span>
          {selectedRepository 
            ? selectedRepository.full_name 
            : 'Select Repository'
          }
        </span>
        <span className="text-primary-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-black border border-primary-600 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-primary-400 text-sm">Loading repositories...</div>
          ) : repositories?.length ? (
            repositories.map((repo) => (
              <div
                key={repo.id}
                className="p-3 hover:bg-primary-900 cursor-pointer border-b border-primary-800 last:border-b-0"
                onClick={() => {
                  onRepositorySelect(repo)
                  setIsOpen(false)
                }}
              >
                <div className="font-medium">{repo.name}</div>
                <div className="text-xs text-primary-500">
                  {repo.full_name} {repo.private ? '(Private)' : '(Public)'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-primary-500 text-sm">
              No repositories found
            </div>
          )}
        </div>
      )}
    </div>
  )
}