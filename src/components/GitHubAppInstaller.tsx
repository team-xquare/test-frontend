import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { githubAPI, GitHubInstallation } from '../api/github'

interface GitHubAppInstallerProps {
  onInstallationSelect: (installation: GitHubInstallation) => void
}

export default function GitHubAppInstaller({ onInstallationSelect }: GitHubAppInstallerProps) {
  const [showInstaller, setShowInstaller] = useState(false)

  const { data: installations, isLoading, refetch } = useQuery({
    queryKey: ['github-installations'],
    queryFn: () => githubAPI.getInstallations().then(res => res.data),
  })

  const handleInstallApp = () => {
    githubAPI.installApp()
    // GitHub App 설치 후 설치 목록을 새로고침
    setTimeout(() => {
      refetch()
    }, 5000)
  }

  if (!showInstaller) {
    return (
      <button
        type="button"
        onClick={() => setShowInstaller(true)}
        className="btn-secondary text-sm"
      >
        CONNECT GITHUB
      </button>
    )
  }

  return (
    <div className="border border-primary-700 p-4 rounded">
      <h4 className="font-medium mb-4">GitHub 연결</h4>
      
      {isLoading ? (
        <div className="text-primary-400 text-sm">Loading installations...</div>
      ) : installations?.length ? (
        <div className="space-y-2">
          <div className="text-sm text-primary-400 mb-2">설치된 GitHub Apps:</div>
          {installations.map((installation) => (
            <div
              key={installation.id}
              className="flex justify-between items-center p-2 border border-primary-800 rounded cursor-pointer hover:border-primary-600"
              onClick={() => {
                onInstallationSelect(installation)
                setShowInstaller(false)
              }}
            >
              <div>
                <div className="font-medium">{installation.account_login}</div>
                <div className="text-xs text-primary-500">{installation.account_type}</div>
              </div>
              <div className="text-xs text-primary-400">
                ID: {installation.installation_id}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-sm text-primary-500 mb-4">
            GitHub App이 설치되지 않았습니다.
          </div>
          <button
            type="button"
            onClick={handleInstallApp}
            className="btn-primary text-sm"
          >
            GITHUB APP 설치
          </button>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setShowInstaller(false)}
          className="btn-secondary text-sm"
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}