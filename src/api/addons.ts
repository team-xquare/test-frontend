import { apiClient } from './client'

export interface Addon {
  id: number
  project_id: number
  name: string
  type: string
  tier: string
  storage: string
  config?: any
  created_at: string
  updated_at: string
}

export interface CreateAddonRequest {
  name: string
  type: string
  tier: string
  storage: string
  config?: any
}

export interface UpdateAddonRequest {
  name: string
  type: string
  tier: string
  storage: string
  config?: any
}

export const addonsAPI = {
  getAddonsByProject: (projectId: number) => 
    apiClient.get<Addon[]>(`/projects/${projectId}/addons`),
  getAddon: (id: number) => 
    apiClient.get<Addon>(`/addons/${id}`),
  createAddon: (projectId: number, data: CreateAddonRequest) => 
    apiClient.post<Addon>(`/projects/${projectId}/addons`, data),
  updateAddon: (id: number, data: UpdateAddonRequest) => 
    apiClient.put<Addon>(`/addons/${id}`, data),
  deleteAddon: (id: number) => 
    apiClient.delete(`/addons/${id}`),
}