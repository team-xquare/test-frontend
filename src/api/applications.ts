import { apiClient } from './client'

export interface Application {
  id: number
  project_id: number
  name: string
  tier: string
  github?: GitHubConfig
  build?: BuildConfig
  endpoints?: EndpointConfig[]
  created_at: string
  updated_at: string
}

export interface GitHubConfig {
  owner: string
  repo: string
  branch: string
  installationID: string
  hash: string
  triggerPaths?: string[]
}

export interface BuildConfig {
  gradle?: GradleBuild
  nodejs?: NodeJSBuild
  react?: ReactBuild
  vite?: ViteBuild
  vue?: VueBuild
  nextjs?: NextJSBuild
  go?: GoBuild
  rust?: RustBuild
  maven?: MavenBuild
  django?: DjangoBuild
  flask?: FlaskBuild
  docker?: DockerBuild
}

export interface GradleBuild {
  javaVersion: string
  jarOutputPath: string
  buildCommand: string
}

export interface NodeJSBuild {
  nodeVersion: string
  buildCommand: string
  startCommand: string
}

export interface ReactBuild {
  nodeVersion: string
  buildCommand: string
  distPath: string
}

export interface ViteBuild {
  nodeVersion: string
  buildCommand: string
  distPath: string
}

export interface VueBuild {
  nodeVersion: string
  buildCommand: string
  distPath: string
}

export interface NextJSBuild {
  nodeVersion: string
  buildCommand: string
  startCommand: string
}

export interface GoBuild {
  goVersion: string
  buildCommand: string
  binaryName: string
}

export interface RustBuild {
  rustVersion: string
  buildCommand: string
  binaryName: string
}

export interface MavenBuild {
  javaVersion: string
  buildCommand: string
  jarOutputPath: string
}

export interface DjangoBuild {
  pythonVersion: string
  buildCommand: string
  startCommand: string
}

export interface FlaskBuild {
  pythonVersion: string
  buildCommand: string
  startCommand: string
}

export interface DockerBuild {
  dockerfilePath: string
  contextPath: string
}

export interface EndpointConfig {
  port: number
  routes: string[]
}

export interface CreateApplicationRequest {
  name: string
  tier: string
  github?: GitHubConfig
  build?: BuildConfig
  endpoints?: EndpointConfig[]
}

export interface UpdateApplicationRequest {
  name: string
  tier: string
  github?: GitHubConfig
  build?: BuildConfig
  endpoints?: EndpointConfig[]
}

export const applicationsAPI = {
  getApplicationsByProject: (projectId: number) => 
    apiClient.get<Application[]>(`/projects/${projectId}/applications`),
  getApplication: (id: number) => 
    apiClient.get<Application>(`/applications/${id}`),
  createApplication: (projectId: number, data: CreateApplicationRequest) => 
    apiClient.post<Application>(`/projects/${projectId}/applications`, data),
  updateApplication: (id: number, data: UpdateApplicationRequest) => 
    apiClient.put<Application>(`/applications/${id}`, data),
  deleteApplication: (id: number) => 
    apiClient.delete(`/applications/${id}`),
}