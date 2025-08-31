import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: number
    email: string
    name: string
  }
}

export const authAPI = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),
    
  register: (data: RegisterRequest) =>
    apiClient.post('/auth/register', data),
    
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refresh_token: refreshToken }),
}