import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_URL = 'https://xquare-server.dsmhs.kr/api/v1'

export const apiClient = axios.create({
  baseURL: API_URL,
})

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const { refreshToken, logout } = useAuthStore.getState()
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })
          
          const { access_token, refresh_token: newRefreshToken, user } = response.data
          useAuthStore.getState().login({
            access_token,
            refresh_token: newRefreshToken,
            user,
          })
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          logout()
          window.location.href = '/login'
        }
      } else {
        logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)