import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI, CreateProjectRequest } from '../api/projects'

export default function Projects() {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    description: '',
  })
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getProjects().then(res => res.data),
  })

  const createMutation = useMutation({
    mutationFn: projectsAPI.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsCreating(false)
      setFormData({ name: '', description: '' })
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to create project')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-primary-400">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">PROJECTS</h1>
          <p className="text-primary-400 mt-2">Manage your deployment projects</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          NEW PROJECT
        </button>
      </div>

      {isCreating && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">CREATE PROJECT</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name
              </label>
              <input
                type="text"
                required
                className="input-field w-full max-w-md"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="input-field w-full max-w-md"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary"
              >
                {createMutation.isPending ? 'CREATING...' : 'CREATE'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <div className="card p-6 hover:border-white transition-colors">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-primary-400 mb-3">
                  {project.description}
                </p>
              )}
              <div className="text-xs text-primary-500">
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects?.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <div className="text-primary-500 mb-4">No projects yet</div>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            CREATE YOUR FIRST PROJECT
          </button>
        </div>
      )}
    </div>
  )
}