import { useState } from 'react'
import { DeployApplicationRequest, BuildConfig } from '../api/projects'
import { GitHubInstallation, GitHubRepository } from '../api/github'
import GitHubAppInstaller from './GitHubAppInstaller'
import RepositorySelector from './RepositorySelector'
import BuildOptions from './BuildOptions'

interface ApplicationFormProps {
  onSubmit: (data: DeployApplicationRequest) => void
  onCancel: () => void
  isLoading: boolean
}

type BuildType = 'gradle' | 'nodejs' | 'react' | 'vite' | 'vue' | 'nextjs' | 'go' | 'rust' | 'maven' | 'django' | 'flask' | 'docker'

export default function ApplicationForm({ onSubmit, onCancel, isLoading }: ApplicationFormProps) {
  const [formData, setFormData] = useState<DeployApplicationRequest>({
    name: '',
    tier: 'x3.small',
    github: {
      owner: '',
      repo: '',
      branch: 'main',
      installationId: '',
      hash: 'latest',
    },
    build: {},
    endpoints: [{ port: 8080, routes: [''] }],
  })
  const [buildType, setBuildType] = useState<BuildType>('gradle')
  const [selectedInstallation, setSelectedInstallation] = useState<GitHubInstallation | null>(null)
  const [selectedRepository, setSelectedRepository] = useState<GitHubRepository | null>(null)

  const handleBuildTypeChange = (type: BuildType) => {
    setBuildType(type)
    const newBuild: BuildConfig = {}
    
    switch (type) {
      case 'gradle':
        newBuild.gradle = {
          javaVersion: '17',
          jarOutputPath: '/build/libs/*.jar',
          buildCommand: './gradlew bootJar -x test --build-cache --no-daemon',
        }
        break
      case 'nodejs':
        newBuild.nodejs = {
          nodeVersion: '18',
          buildCommand: 'npm ci && npm run build',
          startCommand: 'npm start',
        }
        break
      case 'react':
        newBuild.react = {
          nodeVersion: '18',
          buildCommand: 'npm ci && npm run build',
          distPath: '/build',
        }
        break
      case 'vite':
        newBuild.vite = {
          nodeVersion: '20',
          buildCommand: 'npm ci && npm run build',
          distPath: '/dist',
        }
        break
      case 'vue':
        newBuild.vue = {
          nodeVersion: '18',
          buildCommand: 'npm ci && npm run build',
          distPath: '/dist',
        }
        break
      case 'nextjs':
        newBuild.nextjs = {
          nodeVersion: '20',
          buildCommand: 'npm ci && npm run build',
          startCommand: 'npm start',
        }
        break
      case 'go':
        newBuild.go = {
          goVersion: '1.21',
          buildCommand: 'go build -o myservice .',
          binaryName: 'myservice',
        }
        break
      case 'rust':
        newBuild.rust = {
          rustVersion: '1.75',
          buildCommand: 'cargo build --release',
          binaryName: 'rust-service',
        }
        break
      case 'maven':
        newBuild.maven = {
          javaVersion: '17',
          buildCommand: 'mvn clean package -DskipTests',
          jarOutputPath: '/target/*.jar',
        }
        break
      case 'django':
        newBuild.django = {
          pythonVersion: '3.11',
          buildCommand: 'python manage.py collectstatic --noinput',
          startCommand: 'python manage.py runserver 0.0.0.0:8080',
        }
        break
      case 'flask':
        newBuild.flask = {
          pythonVersion: '3.11',
          buildCommand: 'pip install -r requirements.txt',
          startCommand: 'gunicorn -w 4 -b 0.0.0.0:8080 app:app',
        }
        break
      case 'docker':
        newBuild.docker = {
          dockerfilePath: './Dockerfile',
          contextPath: '.',
        }
        break
    }
    
    setFormData({ ...formData, build: newBuild })
  }

  const updateEndpoint = (index: number, field: 'port' | 'routes', value: number | string[]) => {
    const newEndpoints = [...(formData.endpoints || [])]
    if (field === 'port') {
      newEndpoints[index] = { ...newEndpoints[index], port: value as number }
    } else {
      newEndpoints[index] = { ...newEndpoints[index], routes: value as string[] }
    }
    setFormData({ ...formData, endpoints: newEndpoints })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // GitHub 정보 자동 설정
    const finalFormData = {
      ...formData,
      github: selectedRepository ? {
        owner: selectedRepository.owner.login,
        repo: selectedRepository.name,
        branch: formData.github?.branch || 'main',
        installationId: selectedInstallation?.installation_id || '',
        hash: 'latest', // 인프라에서 자동으로 설정
      } : undefined,
    }
    
    onSubmit(finalFormData)
  }

  const handleInstallationSelect = (installation: GitHubInstallation) => {
    setSelectedInstallation(installation)
    setSelectedRepository(null) // 설치 변경 시 저장소 초기화
  }

  const handleRepositorySelect = (repository: GitHubRepository) => {
    setSelectedRepository(repository)
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-6">DEPLOY APPLICATION</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Application Name</label>
            <input
              type="text"
              required
              className="input-field w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tier</label>
            <select
              className="input-field w-full"
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            >
              <option value="x3.micro">x3.micro</option>
              <option value="x3.small">x3.small</option>
              <option value="x3.medium">x3.medium</option>
              <option value="x3.large">x3.large</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">GitHub Configuration</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub App</label>
              <GitHubAppInstaller onInstallationSelect={handleInstallationSelect} />
              {selectedInstallation && (
                <div className="mt-2 text-sm text-primary-400">
                  Connected: {selectedInstallation.account_login}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Repository</label>
              <RepositorySelector
                installation={selectedInstallation}
                onRepositorySelect={handleRepositorySelect}
                selectedRepository={selectedRepository}
              />
            </div>

            {selectedRepository && (
              <div>
                <label className="block text-sm font-medium mb-2">Branch</label>
                <input
                  type="text"
                  className="input-field w-full max-w-xs"
                  value={formData.github?.branch || 'main'}
                  onChange={(e) => setFormData({
                    ...formData,
                    github: { ...formData.github!, branch: e.target.value }
                  })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Build Configuration</h4>
          <div>
            <label className="block text-sm font-medium mb-2">Build Type</label>
            <select
              className="input-field w-full max-w-xs"
              value={buildType}
              onChange={(e) => handleBuildTypeChange(e.target.value as BuildType)}
            >
              <option value="gradle">Gradle (Spring Boot)</option>
              <option value="nodejs">Node.js</option>
              <option value="react">React</option>
              <option value="vite">Vite</option>
              <option value="vue">Vue.js</option>
              <option value="nextjs">Next.js</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="maven">Maven</option>
              <option value="django">Django</option>
              <option value="flask">Flask</option>
              <option value="docker">Docker</option>
            </select>
          </div>
          
          <BuildOptions
            buildType={buildType}
            buildConfig={formData.build || {}}
            onChange={(config) => setFormData({ ...formData, build: config })}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Endpoints</h4>
          {formData.endpoints?.map((endpoint, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Port</label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={endpoint.port}
                  onChange={(e) => updateEndpoint(index, 'port', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Routes (comma-separated)</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={endpoint.routes.join(', ')}
                  onChange={(e) => updateEndpoint(index, 'routes', e.target.value.split(', ').filter(r => r.trim()))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'DEPLOYING...' : 'DEPLOY'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  )
}