import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { githubAPI } from '../api/github'

export default function GitHubSetupComplete() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [countdown, setCountdown] = useState(5)
  const [isLinking, setIsLinking] = useState(false)
  const [linkingError, setLinkingError] = useState<string | null>(null)
  const [isLinked, setIsLinked] = useState(false)

  const installationId = searchParams.get('installation_id')

  // Auto-link installation when component mounts
  useEffect(() => {
    if (installationId && isAuthenticated && user && !isLinked && !isLinking) {
      setIsLinking(true)
      setLinkingError(null)
      
      githubAPI.linkInstallation(installationId)
        .then(() => {
          setIsLinked(true)
        })
        .catch((error) => {
          console.error('Failed to link installation:', error)
          setLinkingError('설치 연결에 실패했습니다. 나중에 다시 시도해주세요.')
        })
        .finally(() => {
          setIsLinking(false)
        })
    }
  }, [installationId, isAuthenticated, user, isLinked, isLinking])

  useEffect(() => {
    // Only start countdown if we're not linking or if linking is complete/failed
    if (!installationId || !isAuthenticated || isLinked || linkingError || !isLinking) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            navigate('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [navigate, installationId, isAuthenticated, isLinked, linkingError, isLinking])

  const handleContinue = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✓</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-4">
            GitHub App 설치 완료!
          </h1>

          {/* Description */}
          <div className="space-y-3 mb-8">
            <p className="text-gray-300">
              <strong>xquare-infrastructure</strong> 앱이 성공적으로 설치되었습니다.
            </p>
            
            {/* Linking Status */}
            {installationId && isAuthenticated && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Installation ID: <code className="text-primary-400">{installationId}</code>
                </p>
                
                {isLinking && (
                  <div className="flex items-center justify-center space-x-2 text-yellow-400">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">계정에 설치를 연결 중...</span>
                  </div>
                )}
                
                {isLinked && !isLinking && (
                  <div className="flex items-center justify-center space-x-2 text-green-400">
                    <span className="text-lg">✓</span>
                    <span className="text-sm">계정 연결 완료</span>
                  </div>
                )}
                
                {linkingError && (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
                    <p className="text-sm text-red-300">{linkingError}</p>
                  </div>
                )}
              </div>
            )}
            
            {installationId && !isAuthenticated && (
              <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-3">
                <p className="text-sm text-yellow-300">
                  설치를 계정에 연결하려면 로그인이 필요합니다.
                </p>
              </div>
            )}

            <div className="bg-gray-800 p-4 rounded-lg text-left">
              <h3 className="text-sm font-medium text-white mb-2">이제 다음을 할 수 있습니다:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-primary-500">→</span>
                  저장소 선택하여 애플리케이션 배포
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-primary-500">→</span>
                  GitHub Actions 자동 트리거
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-primary-500">→</span>
                  실시간 배포 상태 확인
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="btn-primary w-full"
            >
              배포 플랫폼으로 돌아가기
            </button>

            <p className="text-sm text-gray-400">
              {countdown}초 후 자동으로 이동됩니다
            </p>

            <div className="pt-4 border-t border-gray-700">
              <a
                href="https://github.com/settings/installations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center justify-center"
              >
                GitHub에서 설치된 앱 관리
                <span className="ml-1">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}