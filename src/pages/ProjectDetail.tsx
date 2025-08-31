import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI, DeployApplicationRequest, DeployAddonRequest } from '../api/projects'
import ApplicationForm from '../components/ApplicationForm'
import AddonForm from '../components/AddonForm'

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

  const deployApplicationMutation = useMutation({
    mutationFn: (data: DeployApplicationRequest) => 
      projectsAPI.deployApplication(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setShowApplicationForm(false)
      alert('Application deployment initiated')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to deploy application')
    },
  })

  const deployAddonMutation = useMutation({
    mutationFn: (data: DeployAddonRequest) => 
      projectsAPI.deployAddon(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setShowAddonForm(false)
      alert('Addon deployment initiated')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to deploy addon')
    },
  })

  const handleDeleteProject = () => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate()
    }
  }

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
          {project.github_repo && (
            <p className="text-primary-400 mt-2">{project.github_repo}</p>
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
            DEPLOY APP
          </button>
          <button
            onClick={() => setShowAddonForm(true)}
            className="btn-secondary"
          >
            DEPLOY ADDON
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

      {showApplicationForm && (
        <ApplicationForm
          onSubmit={(data) => deployApplicationMutation.mutate(data)}
          onCancel={() => setShowApplicationForm(false)}
          isLoading={deployApplicationMutation.isPending}
        />
      )}

      {showAddonForm && (
        <AddonForm
          onSubmit={(data) => deployAddonMutation.mutate(data)}
          onCancel={() => setShowAddonForm(false)}
          isLoading={deployAddonMutation.isPending}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">APPLICATIONS</h2>
            {project.applications.length > 0 ? (
              <div className="space-y-4">
                {project.applications.map((app) => (
                  <div key={app.name} className="card p-4">
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
                  DEPLOY YOUR FIRST APP
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">ADDONS</h2>
            {project.addons.length > 0 ? (
              <div className="space-y-4">
                {project.addons.map((addon) => (
                  <div key={addon.name} className="card p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{addon.name}</h3>
                      <span className="text-xs bg-primary-800 px-2 py-1">
                        {addon.tier}
                      </span>
                    </div>
                    <p className="text-sm text-primary-400 mb-2">
                      Type: {addon.type}
                    </p>
                    <div className="text-xs text-primary-500">
                      Storage: {addon.storage}
                    </div>
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
                  DEPLOY YOUR FIRST ADDON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}