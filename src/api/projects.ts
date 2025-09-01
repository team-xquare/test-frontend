import { apiClient } from './client'

export interface Project {
  id: number
  name: string
  description: string
  owner_id: number
  created_at: string
  updated_at: string
}


export interface CreateProjectRequest {
  name: string
  description: string
}

export interface UpdateProjectRequest {
  name: string
  description: string
}


export const projectsAPI = {
  getProjects: () => apiClient.get<Project[]>('/projects'),
  getProject: (id: number) => apiClient.get<Project>(`/projects/${id}`),
  createProject: (data: CreateProjectRequest) => apiClient.post<Project>('/projects', data),
  updateProject: (id: number, data: UpdateProjectRequest) => apiClient.put<Project>(`/projects/${id}`, data),
  deleteProject: (id: number) => apiClient.delete(`/projects/${id}`),
}