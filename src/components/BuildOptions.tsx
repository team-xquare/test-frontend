import { BuildConfig } from '../api/projects'

interface BuildOptionsProps {
  buildType: string
  buildConfig: BuildConfig
  onChange: (config: BuildConfig) => void
}

export default function BuildOptions({ buildType, buildConfig, onChange }: BuildOptionsProps) {
  const updateConfig = (field: string, value: string, subType?: string) => {
    if (subType) {
      onChange({
        ...buildConfig,
        [subType]: {
          ...buildConfig[subType as keyof BuildConfig],
          [field]: value
        }
      })
    }
  }

  const renderGradleOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Java Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.gradle?.javaVersion || '17'}
          onChange={(e) => updateConfig('javaVersion', e.target.value, 'gradle')}
        >
          <option value="11">Java 11</option>
          <option value="17">Java 17</option>
          <option value="21">Java 21</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.gradle?.buildCommand || './gradlew bootJar -x test --build-cache --no-daemon'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'gradle')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">JAR Output Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.gradle?.jarOutputPath || '/build/libs/*.jar'}
          onChange={(e) => updateConfig('jarOutputPath', e.target.value, 'gradle')}
        />
      </div>
    </div>
  )

  const renderNodeJSOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Node Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.nodejs?.nodeVersion || '18'}
          onChange={(e) => updateConfig('nodeVersion', e.target.value, 'nodejs')}
        >
          <option value="16">Node 16</option>
          <option value="18">Node 18</option>
          <option value="20">Node 20</option>
          <option value="22">Node 22</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.nodejs?.buildCommand || 'npm ci && npm run build'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'nodejs')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Start Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.nodejs?.startCommand || 'npm start'}
          onChange={(e) => updateConfig('startCommand', e.target.value, 'nodejs')}
        />
      </div>
    </div>
  )

  const renderReactOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Node Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.react?.nodeVersion || '18'}
          onChange={(e) => updateConfig('nodeVersion', e.target.value, 'react')}
        >
          <option value="16">Node 16</option>
          <option value="18">Node 18</option>
          <option value="20">Node 20</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.react?.buildCommand || 'npm ci && npm run build'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'react')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Dist Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.react?.distPath || '/build'}
          onChange={(e) => updateConfig('distPath', e.target.value, 'react')}
        />
      </div>
    </div>
  )

  const renderViteOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Node Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.vite?.nodeVersion || '20'}
          onChange={(e) => updateConfig('nodeVersion', e.target.value, 'vite')}
        >
          <option value="18">Node 18</option>
          <option value="20">Node 20</option>
          <option value="22">Node 22</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.vite?.buildCommand || 'npm ci && npm run build'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'vite')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Dist Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.vite?.distPath || '/dist'}
          onChange={(e) => updateConfig('distPath', e.target.value, 'vite')}
        />
      </div>
    </div>
  )

  const renderVueOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Node Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.vue?.nodeVersion || '18'}
          onChange={(e) => updateConfig('nodeVersion', e.target.value, 'vue')}
        >
          <option value="16">Node 16</option>
          <option value="18">Node 18</option>
          <option value="20">Node 20</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.vue?.buildCommand || 'npm ci && npm run build'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'vue')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Dist Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.vue?.distPath || '/dist'}
          onChange={(e) => updateConfig('distPath', e.target.value, 'vue')}
        />
      </div>
    </div>
  )

  const renderNextJSOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Node Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.nextjs?.nodeVersion || '20'}
          onChange={(e) => updateConfig('nodeVersion', e.target.value, 'nextjs')}
        >
          <option value="18">Node 18</option>
          <option value="20">Node 20</option>
          <option value="22">Node 22</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.nextjs?.buildCommand || 'npm ci && npm run build'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'nextjs')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Start Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.nextjs?.startCommand || 'npm start'}
          onChange={(e) => updateConfig('startCommand', e.target.value, 'nextjs')}
        />
      </div>
    </div>
  )

  const renderGoOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Go Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.go?.goVersion || '1.21'}
          onChange={(e) => updateConfig('goVersion', e.target.value, 'go')}
        >
          <option value="1.20">Go 1.20</option>
          <option value="1.21">Go 1.21</option>
          <option value="1.22">Go 1.22</option>
          <option value="1.23">Go 1.23</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.go?.buildCommand || 'go build -o myservice .'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'go')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Binary Name</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.go?.binaryName || 'myservice'}
          onChange={(e) => updateConfig('binaryName', e.target.value, 'go')}
        />
      </div>
    </div>
  )

  const renderRustOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rust Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.rust?.rustVersion || '1.75'}
          onChange={(e) => updateConfig('rustVersion', e.target.value, 'rust')}
        >
          <option value="1.70">Rust 1.70</option>
          <option value="1.75">Rust 1.75</option>
          <option value="1.80">Rust 1.80</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.rust?.buildCommand || 'cargo build --release'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'rust')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Binary Name</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.rust?.binaryName || 'rust-service'}
          onChange={(e) => updateConfig('binaryName', e.target.value, 'rust')}
        />
      </div>
    </div>
  )

  const renderMavenOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Java Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.maven?.javaVersion || '17'}
          onChange={(e) => updateConfig('javaVersion', e.target.value, 'maven')}
        >
          <option value="11">Java 11</option>
          <option value="17">Java 17</option>
          <option value="21">Java 21</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.maven?.buildCommand || 'mvn clean package -DskipTests'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'maven')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">JAR Output Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.maven?.jarOutputPath || '/target/*.jar'}
          onChange={(e) => updateConfig('jarOutputPath', e.target.value, 'maven')}
        />
      </div>
    </div>
  )

  const renderDjangoOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Python Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.django?.pythonVersion || '3.11'}
          onChange={(e) => updateConfig('pythonVersion', e.target.value, 'django')}
        >
          <option value="3.9">Python 3.9</option>
          <option value="3.10">Python 3.10</option>
          <option value="3.11">Python 3.11</option>
          <option value="3.12">Python 3.12</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.django?.buildCommand || 'python manage.py collectstatic --noinput'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'django')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Start Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.django?.startCommand || 'python manage.py runserver 0.0.0.0:8080'}
          onChange={(e) => updateConfig('startCommand', e.target.value, 'django')}
        />
      </div>
    </div>
  )

  const renderFlaskOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Python Version</label>
        <select
          className="input-field w-full max-w-xs"
          value={buildConfig.flask?.pythonVersion || '3.11'}
          onChange={(e) => updateConfig('pythonVersion', e.target.value, 'flask')}
        >
          <option value="3.9">Python 3.9</option>
          <option value="3.10">Python 3.10</option>
          <option value="3.11">Python 3.11</option>
          <option value="3.12">Python 3.12</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Build Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.flask?.buildCommand || 'pip install -r requirements.txt'}
          onChange={(e) => updateConfig('buildCommand', e.target.value, 'flask')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Start Command</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.flask?.startCommand || 'gunicorn -w 4 -b 0.0.0.0:8080 app:app'}
          onChange={(e) => updateConfig('startCommand', e.target.value, 'flask')}
        />
      </div>
    </div>
  )

  const renderDockerOptions = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Dockerfile Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.docker?.dockerfilePath || './Dockerfile'}
          onChange={(e) => updateConfig('dockerfilePath', e.target.value, 'docker')}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Context Path</label>
        <input
          type="text"
          className="input-field w-full"
          value={buildConfig.docker?.contextPath || '.'}
          onChange={(e) => updateConfig('contextPath', e.target.value, 'docker')}
        />
      </div>
    </div>
  )

  const renderOptions = () => {
    switch (buildType) {
      case 'gradle': return renderGradleOptions()
      case 'nodejs': return renderNodeJSOptions()
      case 'react': return renderReactOptions()
      case 'vite': return renderViteOptions()
      case 'vue': return renderVueOptions()
      case 'nextjs': return renderNextJSOptions()
      case 'go': return renderGoOptions()
      case 'rust': return renderRustOptions()
      case 'maven': return renderMavenOptions()
      case 'django': return renderDjangoOptions()
      case 'flask': return renderFlaskOptions()
      case 'docker': return renderDockerOptions()
      default: return null
    }
  }

  return (
    <div className="space-y-4">
      <h5 className="text-sm font-medium text-primary-300">Build Options</h5>
      {renderOptions()}
    </div>
  )
}