import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI } from '../api/projects'
import { applicationsAPI } from '../api/applications'
import { addonsAPI } from '../api/addons'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [showAddonForm, setShowAddonForm] = useState(false)

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
          <h3 className="text-lg font-semibold mb-4">CREATE APPLICATION</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              createApplicationMutation.mutate({
                name: formData.get('name'),
                tier: formData.get('tier'),
              })
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Application Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="input-field w-full max-w-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tier</label>
              <select name="tier" required className="input-field w-full max-w-md">
                <option value="">Select tier</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createApplicationMutation.isPending}
                className="btn-primary"
              >
                {createApplicationMutation.isPending ? 'CREATING...' : 'CREATE'}
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
          <h3 className="text-lg font-semibold mb-4">CREATE ADDON</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              createAddonMutation.mutate({
                name: formData.get('name'),
                type: formData.get('type'),
                tier: formData.get('tier'),
                storage: formData.get('storage'),
              })
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Addon Name</label>
              <input
                name="name"
                type="text"
                required
                className="input-field w-full max-w-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select name="type" required className="input-field w-full max-w-md">
                <option value="">Select type</option>
                <option value="mysql">MySQL</option>
                <option value="redis">Redis</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tier</label>
              <select name="tier" required className="input-field w-full max-w-md">
                <option value="">Select tier</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Storage</label>
              <select name="storage" required className="input-field w-full max-w-md">
                <option value="">Select storage</option>
                <option value="10GB">10GB</option>
                <option value="50GB">50GB</option>
                <option value="100GB">100GB</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createAddonMutation.isPending}
                className="btn-primary"
              >
                {createAddonMutation.isPending ? 'CREATING...' : 'CREATE'}
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
}