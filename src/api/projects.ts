import { apiClient } from './client'

export interface Project {
  id: number
  name: string
  owner_id: number
  github_repo: string
  created_at: string
  updated_at: string
}

export interface ProjectConfig {
  id: number
  name: string
  github_repo: string
  applications: Application[]
  addons: Addon[]
  created_at: string
  updated_at: string
}

export interface Application {
  name: string
  tier: string
  github?: GitHubConfig
  build?: BuildConfig
  endpoints?: EndpointConfig[]
}

export interface GitHubConfig {
  owner: string
  repo: string
  branch: string
  installationId: string
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

export interface Addon {
  name: string
  type: string
  tier: string
  storage: string
}

export interface CreateProjectRequest {
  name: string
}

export interface DeployApplicationRequest {
  name: string
  tier: string
  github?: GitHubConfig
  build?: BuildConfig
  endpoints?: EndpointConfig[]
}

export interface DeployAddonRequest {
  name: string
  type: string
  tier: string
  storage: string
}

export const projectsAPI = {
  getProjects: () => apiClient.get<Project[]>('/projects'),
  getProject: (id: number) => apiClient.get<ProjectConfig>(`/projects/${id}`),
  createProject: (data: CreateProjectRequest) => apiClient.post<Project>('/projects', data),
  deleteProject: (id: number) => apiClient.delete(`/projects/${id}`),
  deployApplication: (projectId: number, data: DeployApplicationRequest) =>
    apiClient.post(`/projects/${projectId}/applications`, data),
  deployAddon: (projectId: number, data: DeployAddonRequest) =>
    apiClient.post(`/projects/${projectId}/addons`, data),
}