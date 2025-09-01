import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function GitHubSetupComplete() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  const installationId = searchParams.get('installation_id')

  useEffect(() => {
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
  }, [navigate])

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
            
            {installationId && (
              <p className="text-sm text-gray-400">
                Installation ID: <code className="text-primary-400">{installationId}</code>
              </p>
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