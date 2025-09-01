import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI } from '../api/projects'
import { applicationsAPI } from '../api/applications'
import { addonsAPI } from '../api/addons'
import { githubAPI } from '../api/github'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showAddonForm, setShowAddonForm] = useState(false)
  
  // Application form states
  const [selectedInstallation, setSelectedInstallation] = useState('')
  const [selectedRepository, setSelectedRepository] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('main')
  const [buildType, setBuildType] = useState('')
  const [endpoints, setEndpoints] = useState([{ port: 8080, routes: ['/'] }])
  
  // Addon form states
  const [addonType, setAddonType] = useState('')

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsAPI.getProject(Number(id)).then(res => res.data),
    enabled: !!id,
  })

  const { data: applications = [] } = useQuery({
    queryKey: ['applications', id],
    queryFn: () => applicationsAPI.getApplicationsByProject(Number(id)).then(res => res.data),
    enabled: !!id,
  })

  const { data: addons = [] } = useQuery({
    queryKey: ['addons', id], 
    queryFn: () => addonsAPI.getAddonsByProject(Number(id)).then(res => res.data),
    enabled: !!id,
  })

  // GitHub data
  const { data: installations = [] } = useQuery({
    queryKey: ['github-installations'],
    queryFn: () => githubAPI.getInstallations().then(res => res.data),
  })

  const { data: repositories = [] } = useQuery({
    queryKey: ['github-repositories', selectedInstallation],
    queryFn: () => githubAPI.getRepositories(selectedInstallation).then(res => res.data),
    enabled: !!selectedInstallation,
  })

  const deleteProjectMutation = useMutation({
    mutationFn: () => projectsAPI.deleteProject(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/projects')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete project')
    },
  })

  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate()
    }
  }

  const createApplicationMutation = useMutation({
    mutationFn: (data: any) => applicationsAPI.createApplication(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', id] })
      setShowApplicationForm(false)
      // Reset form
      setSelectedInstallation('')
      setSelectedRepository('')
      setSelectedBranch('main')
      setBuildType('')
      setEndpoints([{ port: 8080, routes: ['/'] }])
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create application')
    },
  })

  const createAddonMutation = useMutation({
    mutationFn: (data: any) => addonsAPI.createAddon(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addons', id] })
      setShowAddonForm(false)
      // Reset form
      setAddonType('')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create addon')
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-400">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <div className="text-primary-500 mb-4">Project not found</div>
        <button onClick={() => navigate('/projects')} className="btn-primary">
          BACK TO PROJECTS
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-primary-400 mt-2">{project.description}</p>
          )}
          <p className="text-sm text-primary-500 mt-1">
            Created {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowApplicationForm(true)}
            className="btn-primary"
          >
            ADD APPLICATION
          </button>
          <button
            onClick={() => setShowAddonForm(true)}
            className="btn-secondary"
          >
            ADD ADDON
          </button>
          <button
            onClick={handleDeleteProject}
            disabled={deleteProjectMutation.isPending}
            className="btn-secondary text-red-400 hover:bg-red-900 hover:border-red-400"
          >
            DELETE PROJECT
          </button>
        </div>
      </div>

      {/* Application Form */}
      {showApplicationForm && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">CREATE APPLICATION</h3>
            {installations.length === 0 && (
              <button 
                onClick={() => githubAPI.installApp(1)}
                className="btn-secondary text-sm"
              >
                INSTALL GITHUB APP
              </button>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              const selectedRepo = repositories.find(r => r.full_name === selectedRepository)
              const applicationData = {
                name: formData.get('name'),
                tier: formData.get('tier'),
                github: selectedRepository ? {
                  owner: selectedRepo?.owner.login,
                  repo: selectedRepo?.name,
                  branch: selectedBranch,
                  installationId: selectedInstallation,
                } : undefined,
                build: buildType ? {
                  [buildType]: getBuildConfig(buildType, formData)
                } : undefined,
                endpoints: endpoints.length > 0 ? endpoints : undefined,
              }
              
              createApplicationMutation.mutate(applicationData)
            }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Application Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tier</label>
                  <select name="tier" required className="input-field w-full">
                    <option value="">Select tier</option>
                    <option value="x3.micro">x3.micro</option>
                    <option value="x3.small">x3.small</option>
                    <option value="x3.medium">x3.medium</option>
                    <option value="x3.large">x3.large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GitHub Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">GitHub Repository</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Installation</label>
                  <select 
                    value={selectedInstallation}
                    onChange={(e) => setSelectedInstallation(e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select installation</option>
                    {installations.map((installation) => (
                      <option key={installation.id} value={installation.installation_id}>
                        {installation.account_login}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Repository</label>
                  <select 
                    value={selectedRepository}
                    onChange={(e) => setSelectedRepository(e.target.value)}
                    disabled={!selectedInstallation}
                    className="input-field w-full"
                  >
                    <option value="">Select repository</option>
                    {repositories.map((repo) => (
                      <option key={repo.id} value={repo.full_name}>
                        {repo.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Branch</label>
                  <input
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="input-field w-full"
                    placeholder="main"
                  />
                </div>
              </div>
            </div>

            {/* Build Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">Build Configuration</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Build Type</label>
                <select 
                  value={buildType}
                  onChange={(e) => setBuildType(e.target.value)}
                  className="input-field w-full max-w-md"
                >
                  <option value="">Select build type</option>
                  <option value="gradle">Gradle (Java/Kotlin)</option>
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
              
              {/* Build Type Specific Config */}
              {renderBuildConfig(buildType)}
            </div>

            {/* Endpoints */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">Endpoints</h4>
              {endpoints.map((endpoint, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-2">Port</label>
                    <input
                      type="number"
                      value={endpoint.port}
                      onChange={(e) => {
                        const newEndpoints = [...endpoints]
                        newEndpoints[index].port = parseInt(e.target.value)
                        setEndpoints(newEndpoints)
                      }}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Routes</label>
                    <input
                      type="text"
                      value={endpoint.routes.join(',')}
                      onChange={(e) => {
                        const newEndpoints = [...endpoints]
                        newEndpoints[index].routes = e.target.value.split(',').map(r => r.trim())
                        setEndpoints(newEndpoints)
                      }}
                      className="input-field w-full"
                      placeholder="/, /api, /health"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setEndpoints(endpoints.filter((_, i) => i !== index))}
                      className="btn-secondary text-red-400"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEndpoints([...endpoints, { port: 8080, routes: ['/'] }])}
                className="btn-secondary text-sm"
              >
                ADD ENDPOINT
              </button>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="btn-primary"
              >
                {createApplicationMutation.isPending ? 'CREATING...' : 'CREATE APPLICATION'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplicationForm(false)}
                className="btn-secondary"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addon Form */}
      {showAddonForm && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">CREATE ADDON</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              const addonData = {
                name: formData.get('name'),
                type: addonType,
                tier: formData.get('tier'),
                storage: formData.get('storage'),
              }
              
              createAddonMutation.mutate(addonData)
            }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Addon Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="input-field w-full"
                    placeholder="my-database"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select 
                    value={addonType}
                    onChange={(e) => setAddonType(e.target.value)}
                    required 
                    className="input-field w-full"
                  >
                    <option value="">Select type</option>
                    <option value="mysql">MySQL</option>
                    <option value="redis">Redis</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resource Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-200">Resource Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tier</label>
                  <select name="tier" required className="input-field w-full">
                    <option value="">Select tier</option>
                    <option value="x3.micro">x3.micro</option>
                    <option value="x3.small">x3.small</option>
                    <option value="x3.medium">x3.medium</option>
                    <option value="x3.large">x3.large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Storage</label>
                  <select name="storage" required className="input-field w-full">
                    <option value="">Select storage</option>
                    <option value="1Gi">1Gi</option>
                    <option value="5Gi">5Gi</option>
                    <option value="10Gi">10Gi</option>
                    <option value="20Gi">20Gi</option>
                    <option value="50Gi">50Gi</option>
                  </select>
                </div>
              </div>
            </div>


            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={createAddonMutation.isPending}
                className="btn-primary"
              >
                {createAddonMutation.isPending ? 'CREATING...' : 'CREATE ADDON'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddonForm(false)}
                className="btn-secondary"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">APPLICATIONS</h2>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{app.name}</h3>
                      <span className="text-xs bg-primary-800 px-2 py-1">
                        {app.tier}
                      </span>
                    </div>
                    {app.github && (
                      <p className="text-sm text-primary-400 mb-2">
                        {app.github.owner}/{app.github.repo}@{app.github.branch}
                      </p>
                    )}
                    {app.endpoints && app.endpoints.length > 0 && (
                      <div className="text-xs text-primary-500">
                        Port: {app.endpoints[0].port} | Routes: {app.endpoints[0].routes.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-primary-700">
                <div className="text-primary-500 mb-4">No applications deployed</div>
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="btn-secondary"
                >
                  ADD YOUR FIRST APPLICATION
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">ADDONS</h2>
            {addons.length > 0 ? (
              <div className="space-y-4">
                {addons.map((addon) => (
                  <div key={addon.id} className="card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{addon.name}</h3>
                      <span className="text-xs bg-primary-800 px-2 py-1">
                        {addon.tier}
                      </span>
                    </div>
                    <p className="text-sm text-primary-400 mb-2">
                      Type: {addon.type}
                    </p>
                    {addon.storage && (
                      <div className="text-xs text-primary-500">
                        Storage: {addon.storage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-primary-700">
                <div className="text-primary-500 mb-4">No addons deployed</div>
                <button
                  onClick={() => setShowAddonForm(true)}
                  className="btn-secondary"
                >
                  ADD YOUR FIRST ADDON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Helper functions for build configuration
  function renderBuildConfig(buildType: string) {
    switch (buildType) {
      case 'gradle':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Java Version</label>
              <select name="javaVersion" className="input-field w-full">
                <option value="11">Java 11</option>
                <option value="17">Java 17</option>
                <option value="21">Java 21</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="./gradlew build" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">JAR Output Path</label>
              <input name="jarOutputPath" type="text" defaultValue="build/libs/*.jar" className="input-field w-full" />
            </div>
          </div>
        )
      case 'nodejs':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Node Version</label>
              <select name="nodeVersion" className="input-field w-full">
                <option value="18">Node 18</option>
                <option value="20">Node 20</option>
                <option value="22">Node 22</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="npm run build" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Command</label>
              <input name="startCommand" type="text" defaultValue="npm start" className="input-field w-full" />
            </div>
          </div>
        )
      case 'react':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Node Version</label>
              <select name="nodeVersion" className="input-field w-full">
                <option value="18">Node 18</option>
                <option value="20">Node 20</option>
                <option value="22">Node 22</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="npm run build" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dist Path</label>
              <input name="distPath" type="text" defaultValue="build" className="input-field w-full" />
            </div>
          </div>
        )
      case 'vite':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Node Version</label>
              <select name="nodeVersion" className="input-field w-full">
                <option value="18">Node 18</option>
                <option value="20">Node 20</option>
                <option value="22">Node 22</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="npm run build" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dist Path</label>
              <input name="distPath" type="text" defaultValue="dist" className="input-field w-full" />
            </div>
          </div>
        )
      case 'nextjs':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Node Version</label>
              <select name="nodeVersion" className="input-field w-full">
                <option value="18">Node 18</option>
                <option value="20">Node 20</option>
                <option value="22">Node 22</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="npm run build" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Command</label>
              <input name="startCommand" type="text" defaultValue="npm start" className="input-field w-full" />
            </div>
          </div>
        )
      case 'go':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Go Version</label>
              <select name="goVersion" className="input-field w-full">
                <option value="1.21">Go 1.21</option>
                <option value="1.22">Go 1.22</option>
                <option value="1.23">Go 1.23</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Build Command</label>
              <input name="buildCommand" type="text" defaultValue="go build -o app" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Binary Name</label>
              <input name="binaryName" type="text" defaultValue="app" className="input-field w-full" />
            </div>
          </div>
        )
      case 'docker':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dockerfile Path</label>
              <input name="dockerfilePath" type="text" defaultValue="Dockerfile" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Context Path</label>
              <input name="contextPath" type="text" defaultValue="." className="input-field w-full" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  function getBuildConfig(buildType: string, formData: FormData) {
    switch (buildType) {
      case 'gradle':
        return {
          javaVersion: formData.get('javaVersion'),
          buildCommand: formData.get('buildCommand'),
          jarOutputPath: formData.get('jarOutputPath'),
        }
      case 'nodejs':
        return {
          nodeVersion: formData.get('nodeVersion'),
          buildCommand: formData.get('buildCommand'),
          startCommand: formData.get('startCommand'),
        }
      case 'react':
      case 'vite':
      case 'vue':
        return {
          nodeVersion: formData.get('nodeVersion'),
          buildCommand: formData.get('buildCommand'),
          distPath: formData.get('distPath'),
        }
      case 'nextjs':
        return {
          nodeVersion: formData.get('nodeVersion'),
          buildCommand: formData.get('buildCommand'),
          startCommand: formData.get('startCommand'),
        }
      case 'go':
        return {
          goVersion: formData.get('goVersion'),
          buildCommand: formData.get('buildCommand'),
          binaryName: formData.get('binaryName'),
        }
      case 'docker':
        return {
          dockerfilePath: formData.get('dockerfilePath'),
          contextPath: formData.get('contextPath'),
        }
      default:
        return {}
    }
  }

  // Helper functions for addon configuration
}